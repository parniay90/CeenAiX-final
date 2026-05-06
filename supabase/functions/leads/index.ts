import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com",
  "icloud.com", "me.com", "mac.com", "aol.com", "protonmail.com",
  "mail.com", "gmx.com", "yandex.com", "ymail.com",
]);

function isFreeEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return FREE_EMAIL_DOMAINS.has(domain);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function makeHash(...parts: string[]): string {
  return parts.join("|").toLowerCase().trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/leads/, "");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    if (req.method === "POST" && path === "/demo-request") {
      const body = await req.json();
      const {
        full_name, email, phone, organization_name, role,
        organization_type, country, team_size, interests,
        preferred_demo_time, specific_date, notes, preferred_language,
        marketing_opt_in, override_free_email,
      } = body;

      // Field validation
      const errors: Record<string, string> = {};
      if (!full_name?.trim()) errors.full_name = "required";
      if (!email?.trim() || !isValidEmail(email)) errors.email = "invalid_email";
      if (!phone?.trim()) errors.phone = "required";
      if (!organization_name?.trim()) errors.organization_name = "required";
      if (!role?.trim()) errors.role = "required";
      if (!organization_type?.trim()) errors.organization_type = "required";
      if (!country?.trim()) errors.country = "required";
      if (!team_size?.trim()) errors.team_size = "required";
      if (!interests || interests.length === 0) errors.interests = "select_one";
      if (!preferred_language?.trim()) errors.preferred_language = "required";

      // Soft free-email warning (not a hard error — client handles override)
      const freeEmail = isValidEmail(email) && isFreeEmail(email) && !override_free_email;

      if (Object.keys(errors).length > 0) {
        return new Response(JSON.stringify({ success: false, errors }), {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const source_hash = makeHash(email, organization_name);

      const { data, error } = await supabase
        .from("demo_requests")
        .insert({
          full_name: full_name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          organization_name: organization_name.trim(),
          role,
          organization_type,
          country,
          team_size,
          interests,
          preferred_demo_time: preferred_demo_time ?? "Anytime",
          specific_date: specific_date ?? null,
          notes: notes?.trim() ?? "",
          preferred_language: preferred_language ?? "en",
          marketing_opt_in: marketing_opt_in ?? false,
          source_hash,
        })
        .select("id")
        .single();

      if (error) {
        console.error("DB insert error", error);
        return new Response(
          JSON.stringify({ success: false, errors: { _global: "db_error" } }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // If marketing opt-in also add to launch_notifications
      if (marketing_opt_in) {
        const firstName = full_name.trim().split(" ")[0];
        await supabase.from("launch_notifications").upsert(
          {
            name: firstName,
            email: email.trim().toLowerCase(),
            preferred_language: preferred_language ?? "en",
            source_hash: makeHash(email),
          },
          { onConflict: "email", ignoreDuplicates: true },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          leadId: data.id,
          freeEmailWarning: freeEmail,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (req.method === "POST" && path === "/launch-notify") {
      const body = await req.json();
      const { name, email, country, persona, preferred_language } = body;

      const errors: Record<string, string> = {};
      if (!name?.trim()) errors.name = "required";
      if (!email?.trim() || !isValidEmail(email)) errors.email = "invalid_email";
      if (!preferred_language?.trim()) errors.preferred_language = "required";

      if (Object.keys(errors).length > 0) {
        return new Response(JSON.stringify({ success: false, errors }), {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const source_hash = makeHash(email);

      // Check if already subscribed
      const { data: existing } = await supabase
        .from("launch_notifications")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ success: true, leadId: existing.id, alreadySubscribed: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { data, error } = await supabase
        .from("launch_notifications")
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          country: country ?? "",
          persona: persona ?? "",
          preferred_language: preferred_language ?? "en",
          source_hash,
        })
        .select("id")
        .single();

      if (error) {
        console.error("DB insert error", error);
        return new Response(
          JSON.stringify({ success: false, errors: { _global: "db_error" } }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ success: true, leadId: data.id, alreadySubscribed: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (req.method === "GET" && path === "/count") {
      const { count, error } = await supabase
        .from("launch_notifications")
        .select("id", { count: "exact", head: true });

      if (error) {
        return new Response(JSON.stringify({ count: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Round to nearest 10, only expose if >= 25
      const raw = count ?? 0;
      const rounded = raw >= 25 ? Math.floor(raw / 10) * 10 : 0;

      return new Response(JSON.stringify({ count: rounded, visible: rounded > 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error", err);
    return new Response(
      JSON.stringify({ success: false, errors: { _global: "server_error" } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
