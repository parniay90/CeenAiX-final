import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Mic, Settings, Trash2, Download, X, ThumbsUp, ThumbsDown, Copy, Share2, RotateCcw, ShieldCheck, Volume2 } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';

type Language = 'en' | 'fa';
type MessageRole = 'patient' | 'ai' | 'system';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

interface HealthSnapshot {
  hba1c: { value: string; status: string; color: string };
  bp: { value: string; status: string; color: string };
  meds: { value: string; status: string; color: string };
  appointment: { value: string; status: string; color: string };
}

const healthSnapshot: HealthSnapshot = {
  hba1c: { value: '6.8%', status: '↓ Improving', color: 'text-amber-400' },
  bp: { value: '128/82', status: 'Controlled ✓', color: 'text-white' },
  meds: { value: '4', status: 'All active', color: 'text-teal-300' },
  appointment: { value: 'Apr 15', status: 'Dr. Ahmed', color: 'text-white' }
};

const suggestionPills = {
  en: {
    row1: [
      { icon: '💊', text: 'Explain my medications', keyword: 'medications' },
      { icon: '🩸', text: 'What does my HbA1c 6.8% mean?', keyword: 'hba1c' },
      { icon: '🫀', text: 'What does my cardiac MRI show?', keyword: 'mri' },
      { icon: '🥗', text: 'Foods to avoid with diabetes', keyword: 'diet' }
    ],
    row2: [
      { icon: '💊', text: 'Check drug interactions', keyword: 'interaction' },
      { icon: '🩺', text: 'Prepare for my April 15 appointment', keyword: 'appointment' },
      { icon: '🔬', text: 'Explain my Vitamin D level', keyword: 'vitamind' },
      { icon: '💓', text: 'Is my blood pressure normal?', keyword: 'bp' },
      { icon: '🌙', text: 'Why take Atorvastatin at night?', keyword: 'statin' },
      { icon: '🧠', text: 'What is HbA1c exactly?', keyword: 'hba1c_explain' }
    ]
  },
  fa: {
    row1: [
      { icon: '💊', text: 'داروهایم را توضیح بده', keyword: 'medications_fa' },
      { icon: '🩸', text: 'HbA1c من یعنی چی؟', keyword: 'hba1c' },
      { icon: '🫀', text: 'نتیجه MRI قلبم چیه؟', keyword: 'mri' },
      { icon: '🥗', text: 'چه غذاهایی نباید بخورم؟', keyword: 'diet' }
    ],
    row2: [
      { icon: '💊', text: 'تداخل دارویی چک کن', keyword: 'interaction' },
      { icon: '🩺', text: 'آماده شدن برای نوبت', keyword: 'appointment' },
      { icon: '🔬', text: 'ویتامین D من', keyword: 'vitamind' },
      { icon: '💓', text: 'فشار خونم نرماله؟', keyword: 'bp' }
    ]
  }
};

const morningTips = [
  {
    day: 0,
    text: "📋 Sunday check-in: Review your home BP log from this week. Consistent readings = good Amlodipine effect."
  },
  {
    day: 1,
    text: "💊 It's Monday — great day to refill your Metformin prescription. You have 21 days left.",
    link: '/patient/medications'
  },
  {
    day: 2,
    text: "🩸 Your HbA1c is improving! Walking 20 mins after breakfast today could help bring it toward 6.5%."
  },
  {
    day: 3,
    text: "💧 Staying well-hydrated helps your kidneys process Metformin more effectively. Aim for 8 glasses today."
  },
  {
    day: 4,
    text: "🌙 Tonight: take your Atorvastatin at bedtime. Your liver is most active at night — timing matters!"
  },
  {
    day: 5,
    text: "🫀 Weekend BP reminder: Stress and irregular eating on weekends can spike BP. Keep Amlodipine at the same time today even if your schedule changes."
  },
  {
    day: 6,
    text: "☀️ Morning sun before 10 AM — 20 minutes on your arms helps your Vitamin D level. Currently [22 ng/mL]."
  }
];

export default function AIAssistant() {
  const [language, setLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMorningTip, setShowMorningTip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 6 && currentHour < 11;
  const todayTip = morningTips[new Date().getDay()];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'patient',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    setTimeout(async () => {
      setIsThinking(false);
      const response = getAIResponse(text.toLowerCase(), language);
      const aiMessageId = (Date.now() + 1).toString();

      const aiMessage: Message = {
        id: aiMessageId,
        role: 'ai',
        content: '',
        timestamp: new Date(),
        streaming: true
      };

      setMessages(prev => [...prev, aiMessage]);
      setStreamingMessageId(aiMessageId);

      await streamText(response, aiMessageId);
    }, 1500);
  };

  const streamText = async (fullText: string, messageId: string) => {
    let currentText = '';
    const chars = fullText.split('');

    for (let i = 0; i < chars.length; i++) {
      currentText += chars[i];
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: currentText }
          : msg
      ));
      await new Promise(resolve => setTimeout(resolve, 20));
    }

    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, streaming: false }
        : msg
    ));
    setStreamingMessageId(null);
  };

  const getAIResponse = (input: string, lang: Language): string => {
    if (lang === 'fa' && input.includes('دارو')) {
      return `البته پرنیا جان! الان ۴ دارو مصرف می‌کنی:

**۱. متفورمین ۸۵۰ میلی‌گرم** — دو بار در روز (با غذا)
این داروی دیابت توه. با کاهش قند تولیدی کبد کار می‌کنه.
نتیجه خوبه — HbA1c از ۷.۴٪ در شهریور به ۶.۸٪ بهتر شده! 📉

**۲. آتورواستاتین ۲۰ میلی‌گرم** — شبانه (قبل از خواب)
برای کلسترول. کبد شب‌ها بیشتر کلسترول می‌سازه، پس شب بهترین وقت مصرفه. توجه: **گریپ‌فروت ممنوع** 🍊

**۳. آملودیپین ۵ میلی‌گرم** — هر روز صبح (یه ساعت ثابت)
برای فشار خون. فشارت ۱۲۸/۸۲ عالیه! مهمه که یک روز هم قطعش نکنی.

**۴. ویتامین D 2000 واحد** — روزانه (با غذای چرب)
ویتامین D خونت ۲۲ ng/mL — کمه. این مکمل داره بهترش می‌کنه. با تخم‌مرغ یا روغن زیتون بخور — جذبش بهتره.

---
✅ تداخل خطرناکی بین داروهات نیست.
⚠️ یادت باشه: آلرژی شدید به پنی‌سیلین داری — همیشه به پزشک و دندانپزشک بگو قبل از هر نسخه‌ای.`;
    }

    if (input.includes('medication') || input.includes('meds') || input.includes('drug') || input.includes('pill')) {
      return `Of course, Parnia! You're currently taking **4 medications** — here's what each one does for you:

**1. Metformin 850mg** — Twice daily (with meals)
Metformin is your **diabetes medication**. It works by reducing the amount of sugar your liver releases into your blood, and helping your cells respond better to insulin. It's been working — your HbA1c has improved from 7.4% to 6.8%! 📉
Take with meals to reduce stomach upset.

**2. Atorvastatin 20mg** — Once at bedtime
Atorvastatin is your **cholesterol medication** (statin). Your lipid panel came back all normal, which means it's doing its job! Your LDL is 118 mg/dL which is within the healthy range.
Important: **avoid grapefruit** while taking this — it can interfere with how your body processes the medication.
Bedtime is the best time because your liver makes most cholesterol at night.

**3. Amlodipine 5mg** — Every morning (same time!)
Amlodipine controls your **blood pressure**. Your recent readings of 128/82 mmHg are excellent — this medication is working well. Consistency is everything with BP medication — please don't skip doses.

**4. Vitamin D 2000IU** — Daily (with a fatty meal)
Your Vitamin D was 22 ng/mL (insufficient). This supplement helps bring it to the healthy range of 30+ ng/mL. In Dubai, most people have low Vitamin D because of sun avoidance.
Take it with eggs, avocado, or olive oil for best absorption.

---
✅ **Good news:** I checked and none of your medications interact dangerously with each other.
⚠️ **Remember:** You are allergic to Penicillin — always tell any new doctor or dentist before they prescribe anything.`;
    }

    if (input.includes('hba1c') && (input.includes('mean') || input.includes('6.8') || input.includes('what does'))) {
      return `Great question! Let me explain your **HbA1c: 6.8%** clearly.

**What is HbA1c?**
HbA1c measures your **average blood sugar over the past 3 months** — not just today's reading. Think of it like your blood sugar 'report card' for the whole term.

**The ranges to know:**
> Normal: below 5.7%
> Pre-diabetic: 5.7% – 6.4%
> Diabetic: 6.5% and above

**Your result: 6.8%** — you are in the diabetic range, but here's the REALLY good news:

📉 **You've improved from 7.4% in September to 6.8% now.**
That's a **0.6% drop in 6 months** — this is a clinically significant improvement! Your Metformin + diet changes are working together perfectly.

Your **target is below 6.5%** — you're only 0.3 points away. At this rate, you could reach it by your June appointment with Dr. Fatima.

**What affects HbA1c?**
- What you eat (especially carbs and sugar) 🍚
- Your Metformin medication 💊
- Physical activity (walking after meals is very effective!) 🚶‍♀️
- Stress levels 😌
- Sleep quality 😴

**Parnia's tip:** Walking 20–30 minutes after your largest meal of the day — especially after dinner — can reduce your post-meal blood sugar spike significantly. This alone can shave 0.2–0.4 points off HbA1c over time.

Dr. Fatima's note from March 5 confirms this trend too — she was very pleased with your progress! 💪`;
    }

    if (input.includes('mri') || input.includes('cardiac') || input.includes('heart')) {
      return `Your **Cardiac MRI** (February 15, 2026) is really reassuring! Let me break it down:

**The most important finding — NO scarring! ✅**
The LGE (Late Gadolinium Enhancement) sequence showed absolutely **no evidence of any heart attack or scarring** in your heart muscle. This is the most important thing.

**Your heart is pumping beautifully:**
**LVEF: 64%** — Your heart pumps out 64% of its blood with each beat. Normal is 55% or above. You're well above that threshold. 💪

**The two minor notes:**

*1. Mildly elevated T1 signal (1024 ms):*
This is a very sensitive measurement that detected a subtle early change from years of high blood pressure. It's NOT dangerous — think of it as a very early whisper that BP control matters. Your Amlodipine is exactly the right treatment. Dr. Ahmed will recheck in 2–3 years.

*2. Tiny lung spots (3.8 mm):*
Incidentally spotted — very small (smaller than a grain of rice!). At this size, 97%+ are completely harmless. Dr. Ahmed has scheduled a CT check in 1 year as standard precaution.

**Dr. Ahmed's overall verdict:** 🎉 He was very pleased. No urgent action needed — just continue your current medications and see him April 15 as planned.

> 💡 Your CAC Score from the CT scan was 42 (mild) — combined with the clean MRI, this gives Dr. Ahmed a very complete picture of your heart health.`;
    }

    if (input.includes('food') || input.includes('diet') || input.includes('eat') || input.includes('avoid')) {
      return `Since you have Type 2 Diabetes AND Hypertension, here's what I'd specifically recommend for you, Parnia:

**🚫 Foods to limit or avoid:**

*Blood sugar spikers:*
- **White rice** — the UAE staple, but very high glycemic. Try: smaller portions, or mix with vegetables
- **Dates** — despite being natural, cause rapid spikes. Even 2–3 dates = 20+ grams of fast sugar
- **Fruit juices** — even 'fresh' orange juice spikes BG. Eat whole fruit instead (the fiber slows absorption)
- **White bread, samoon, baguette** — refined carbs
- **Sweetened beverages** (Vimto, Pepsi, even 'sugar-free' drinks)

*Blood pressure extras:*
- **Pickled foods** — very high sodium
- **Canned foods** — check sodium levels
- **Processed meats** (sausages, deli meats)

**✅ Excellent choices for YOU specifically:**

*For diabetes control:*
- **Whole grains** — brown rice, bulgur, whole wheat bread
- **Legumes** — lentils, chickpeas, beans — low GI + protein
- **Non-starchy vegetables** — unlimited! (cucumber, tomato, greens)
- **Greek yogurt** — protein + low sugar (unsweetened)
- **Nuts** — almonds, walnuts — good fats, don't spike glucose

*Dubai-specific tips:*
- **Hummus** with vegetables instead of bread — great choice!
- **Grilled meats** (kabob) without rice = perfect meal
- **Tabbouleh** — very low GI, fiber-rich
- **Fattoush** — vegetables + a little bread = balanced

*For your Atorvastatin:*
Remember, **no grapefruit** 🍊 (interferes with the medication's absorption)

**Your current HbA1c is 6.8%** — you're so close to your target of 6.5%! These dietary changes, combined with your Metformin, can get you there by June.

Dr. Fatima's advice from your last visit: 'Low carb, walk after meals, especially after dinner.' 🚶‍♀️`;
    }

    if (input.includes('interaction') || input.includes('safe') || input.includes('combine')) {
      return `I'll check all your current medications for interactions:

**Your current medications:**
Metformin 850mg + Atorvastatin 20mg + Amlodipine 5mg + Vitamin D 2000IU

---

**Checking combinations:**

✅ **Metformin + Atorvastatin** — No significant interaction
Safe to take together. Both target different systems.

✅ **Metformin + Amlodipine** — No significant interaction
Actually a common and safe combination for diabetic hypertension patients.

✅ **Amlodipine + Atorvastatin** — No significant interaction
This is actually a very common pairing for cardiovascular risk reduction — Dr. Ahmed chose wisely.

✅ **Vitamin D + All three** — No interactions
Vitamin D is safe with all your medications.

---

**⚠️ Known cautions with your medications:**

*Metformin:*
- Avoid **excessive alcohol** — can increase lactic acidosis risk
- **Iodine contrast dye** (used in CT scans) — your Metformin was held before your CT scan (standard protocol)

*Atorvastatin:*
- **Grapefruit** 🍊 — always avoid! (mentioned to you before)
- Some antibiotics can interact — always tell your pharmacist you take Atorvastatin

*Amlodipine:*
- **Grapefruit** 🍊 — also applies here! (Both Amlodipine AND Atorvastatin are affected by grapefruit)
- **St. John's Wort** (herbal supplement) — can reduce effect

---

**🚨 Your allergy reminder:**
⚠️ You are **severely allergic to Penicillin** (anaphylaxis). This includes: Amoxicillin, Ampicillin, and many other '-cillin' antibiotics. Always carry your allergy card.
⚠️ You are allergic to **Sulfa drugs** (Sulfonamides). This includes Bactrim/Co-trimoxazole.

**Bottom line:** Your 4 medications work together safely. No dangerous combinations. You're on a well-chosen regimen! ✅`;
    }

    if (input.includes('appointment') || input.includes('april') || input.includes('prepare') || input.includes('visit')) {
      return `Your appointment with **Dr. Ahmed Al Rashidi** (Cardiologist, Al Noor Medical Center) is in **8 days** — on April 15, 2026 at 10:30 AM.

Here's how to make the most of it:

**📋 What to bring:**
- Emirates ID + Daman Gold insurance card
- Your home BP log (if you've been tracking). You've been logging — great! Dr. Ahmed will love this
- List of any new symptoms since your last visit
- Any questions you want to ask

**🩺 What Dr. Ahmed will likely review:**

Based on your recent results, he'll probably discuss:
1. **Cardiac MRI follow-up** (Feb 2026) — the mildly elevated T1 signal and tiny lung spots
2. **CAC Score 42** from January CT — whether the Atorvastatin is having the intended effect on your cardiac risk
3. **Blood pressure control** — your recent 128/82 mmHg readings are excellent, he'll confirm this
4. **Lipid panel** — your latest cholesterol panel was all normal, confirm Atorvastatin dose

**❓ Questions to consider asking Dr. Ahmed:**

Here are 5 smart questions based on your health profile:

1. *'My T1 signal was 1024 ms — when should I repeat the cardiac MRI to track this?'*

2. *'The lung spots were 3.8 mm — can I book the 1-year CT follow-up now so I don't forget?'*

3. *'My blood pressure has been consistently 126–130 systolic — is it time to review the Amlodipine dose?'*

4. *'Are there any lifestyle changes that would specifically help reduce my CAC score progression?'*

5. *'Can I get my Atorvastatin changed to generic to reduce my co-pay?'*

**🏥 Getting there:**
Al Noor Medical Center — Jumeirah, Dubai

**💰 Cost reminder:**
Daman Gold covers this visit — your co-pay is ~AED 40. Bring your insurance card!

See you on April 15, Parnia! 💪 You've made excellent progress since your last visit.`;
    }

    if (input.includes('vitamin d') || input.includes('vitamin') || input.includes('sunshine')) {
      return `Your **Vitamin D: 22 ng/mL** from March 5 — let me explain.

**The Vitamin D levels:**
> Deficient: below 20 ng/mL ← you were here in December!
> Insufficient: 20–29 ng/mL ← **you are here now (22)**
> Sufficient: 30–80 ng/mL ← **your target**
> Toxic: above 100 ng/mL (very hard to reach with supplements)

**The good news:** You've improved from 18 ng/mL in December to 22 ng/mL in March — your Vitamin D 2000IU supplement is working! That's +4 ng/mL in 3 months.

**Why is it low?**
This is extremely common in Dubai! Here's why:
- The sun is intense, so most people **avoid direct sun** (or are covered)
- Air-conditioned indoor lifestyle = minimal sun exposure
- Even 'sunny' Dubai doesn't help if you're in an office!
- Vitamin D is also affected by your skin tone and age

**How to reach your target faster:**

1. 💊 Continue your **Vitamin D 2000IU daily** — non-negotiable
2. 🍳 **Take it with fat:** eggs, avocado, olive oil, nuts (Vitamin D is fat-soluble — needs fat to absorb)
3. ☀️ **20 minutes of morning sun** (before 10 AM) on your arms — safest time in Dubai
4. 🐟 **Oily fish** (salmon, sardines, mackerel) — natural Vit D
5. 🥚 Eggs + fortified foods (some cereals/milk)

**What happens if it stays low?**
Vitamin D affects: bone health, immune function, mood, muscle strength, and even blood sugar control (low Vitamin D is associated with worse diabetes outcomes).

**Your next retest:** June 5, 2026 (at your appointment with Dr. Fatima). At the rate you're improving, you could reach 30+ ng/mL by then! 🌟`;
    }

    if (input.includes('blood pressure') || input.includes('bp') || input.includes('hypertension') || input.includes('pressure')) {
      return `Yes Parnia — your blood pressure is **well controlled**! Let me show you your recent readings:

**Your last 7 days of home readings:**
Mar 8: 131/84 | Mar 9: 129/82 | Mar 10: 128/83
Mar 11: 130/81 | Mar 12: 127/80 | Mar 13: 126/82
Mar 14: **128/82** ← most recent

**Average: ~128/82 mmHg** ✅

**BP categories (American Heart Association):**
> Normal: below 120/80 — ideal
> Elevated: 120–129 / <80
> Stage 1 High: 130–139 / 80–89 ← **You're at the border**
> Stage 2 High: 140+ / 90+
> Crisis: 180+ / 120+

Your readings are at the **upper end of normal / very low Stage 1** — well controlled with Amlodipine. Dr. Ahmed set your personal target at **below 130/80**, and you're very close or at that target most days.

**Dr. Ahmed's message from March 14:** ☑️
*'128/82 is right on target. Keep it up!'*

**What's working for you:**
✅ Amlodipine 5mg every morning (you have 100% adherence!)
✅ Home monitoring (excellent habit!)
✅ Your improving HbA1c is helping too — high blood sugar directly damages blood vessel walls

**Tips to keep it there:**
- Continue Amlodipine at exactly the same time daily
- Reduce sodium (pickled foods, canned goods, restaurant food)
- The 20-minute walks you've been doing — keep it up!
- Manage stress (your BP spikes when stressed)
- Limit caffeine before measuring (coffee is fine for you, just not right before taking your reading)

**When to contact Dr. Ahmed immediately:**
If you see readings consistently above 150/95, or a single reading above 180/120, message him right away. 📱`;
    }

    if (input.includes('statin') || input.includes('atorvastatin') || input.includes('bedtime') || input.includes('night') || input.includes('cholesterol')) {
      return `Great question! Here's the science behind it:

**Why Atorvastatin at bedtime? 🌙**

Your **Atorvastatin 20mg** is a statin — it works by blocking an enzyme in your liver called **HMG-CoA reductase**, which is responsible for making cholesterol.

Here's the key: **your liver makes most of its cholesterol at night**, especially between midnight and 6 AM. So taking Atorvastatin at bedtime (around 10 PM) means the medication is at peak levels exactly when your liver is most active in producing cholesterol. It's better timing for maximum effect.

**Does it make a difference?**
For Atorvastatin specifically, studies show that bedtime dosing can improve LDL reduction by up to 25% compared to morning dosing. Your **LDL: 118 mg/dL** being normal is partly because of this timing!

**Your current adherence:** Your evening dose adherence has been excellent — this is contributing to your good lipid panel results. 💪

**Important reminders for Atorvastatin:**

1. **🍊 No grapefruit — ever.** Grapefruit contains compounds that block the enzyme that breaks down Atorvastatin — causing it to build up to dangerous levels in your blood. Even grapefruit juice hours later affects it.

2. **Watch for muscle pain:** If you develop unusual muscle aches, weakness, or dark urine — contact Dr. Ahmed immediately (rare but important sign)

3. **Alcohol:** Limit to 1 drink maximum — both alcohol and Atorvastatin are processed by the liver

4. **Don't stop suddenly** — always consult Dr. Ahmed before stopping even if you feel fine

Your cholesterol is well controlled — keep taking it every night! 🌙`;
    }

    return `Thanks for your question, Parnia! While I do my best to help with health topics related to your profile, that specific question is a bit outside what I can answer confidently right now.

Here's what I **can** help you with:
- ❓ Questions about your medications (Metformin, Atorvastatin, Amlodipine, Vitamin D)
- 📊 Explaining your lab results (HbA1c, blood pressure, cholesterol, Vitamin D)
- 🩺 Preparing for your appointments
- 🥗 Diet and lifestyle advice for diabetes and hypertension
- 💊 Drug interactions and safety
- 🫀 Understanding your imaging results

For other medical questions, I'd recommend:
- Messaging your GP for general questions
- Or Dr. Fatima Al Mansoori for diabetes questions

Is there anything from the list above I can help with? 😊`;
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setInputText('What does my HbA1c mean?');
      setTimeout(() => {
        sendMessage('What does my HbA1c mean?');
      }, 500);
    }, 3000);
  };

  const clearChat = () => {
    if (confirm('Clear your conversation with CeenAiX AI? This cannot be undone.')) {
      setMessages([]);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <PatientTopNav patientName="Ahmed Al Maktoum" />

      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar />

        <main className="flex-1 overflow-hidden bg-slate-900">
        <div className="h-full flex flex-col overflow-hidden">
          <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 animate-ping">
                  <div className="w-16 h-16 rounded-full border-2 border-teal-500/40" />
                </div>
                <div className="absolute inset-0 animate-pulse" style={{ animationDuration: '3s' }}>
                  <div className="w-16 h-16 rounded-full border-2 border-teal-500/15" />
                </div>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <Bot className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>CeenAiX AI</h1>
                <p className="text-xs text-teal-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                  Your Personal Health Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="bg-white/8 border border-white/12 rounded-full p-1.5 flex items-center gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    language === 'en'
                      ? 'bg-white text-teal-600'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => setLanguage('fa')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    language === 'fa'
                      ? 'bg-white text-teal-600'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  🇮🇷 فارسی
                </button>
              </div>

              <button
                onClick={clearChat}
                className="p-2 text-white/60 hover:text-white/80 transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-white/60 hover:text-white/80 transition-colors" title="Export Chat">
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-white/60 hover:text-white/80 transition-colors"
                title="AI Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="max-w-4xl mx-auto px-8 py-8">
              {messages.length === 0 && (
                <>
                  {isMorning && showMorningTip && (
                    <div className="mb-8">
                      <div className="max-w-xl mx-auto bg-teal-900/50 border border-teal-500/30 rounded-3xl p-6">
                        <p className="text-sm text-teal-300 mb-2">☀️ Good morning, Parnia! Today's health tip:</p>
                        <p className="text-white/90 text-sm leading-relaxed mb-4">{todayTip.text}</p>
                        <button
                          onClick={() => setShowMorningTip(false)}
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Start Chatting ▸
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      سلام Parnia! 👋
                    </h2>
                    <p className="text-lg text-white/70">How can I help you today?</p>
                  </div>

                  <div className="max-w-xl mx-auto mb-8">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6">
                      <div className="flex items-start gap-3">
                        <div className="text-amber-400 mt-0.5">⚠️</div>
                        <p className="text-sm text-amber-200 leading-relaxed">
                          I provide general health information based on your health profile. I am NOT a substitute for your doctors. For emergencies, call 998 (UAE ambulance).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-xl mx-auto mb-8">
                    <div className="bg-white/4 border border-white/8 rounded-3xl p-8">
                      <p className="text-xs text-teal-400 uppercase tracking-wider mb-4 font-mono">Your Health Summary</p>
                      <div className="grid grid-cols-2 gap-8 mb-6">
                        <div>
                          <p className="text-xs text-white/50 mb-1 font-mono">HbA1c</p>
                          <p className={`text-2xl font-bold font-mono ${healthSnapshot.hba1c.color}`}>
                            {healthSnapshot.hba1c.value}
                          </p>
                          <p className="text-xs text-emerald-400 mt-1">{healthSnapshot.hba1c.status}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/50 mb-1 font-mono">Blood Pressure</p>
                          <p className={`text-2xl font-bold font-mono ${healthSnapshot.bp.color}`}>
                            {healthSnapshot.bp.value}
                          </p>
                          <p className="text-xs text-emerald-400 mt-1">{healthSnapshot.bp.status}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/50 mb-1 font-mono">Medications</p>
                          <p className={`text-2xl font-bold font-mono ${healthSnapshot.meds.color}`}>
                            {healthSnapshot.meds.value}
                          </p>
                          <p className="text-xs text-white/50 mt-1">{healthSnapshot.meds.status}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/50 mb-1 font-mono">Next Visit</p>
                          <p className={`text-2xl font-bold font-mono ${healthSnapshot.appointment.color}`}>
                            {healthSnapshot.appointment.value}
                          </p>
                          <p className="text-xs text-white/50 mt-1">{healthSnapshot.appointment.status}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/6">
                        <p className="text-xs text-red-300 leading-relaxed">
                          ⚠️ I know you are allergic to Penicillin (SEVERE) and Sulfa drugs — I'll flag these in all responses.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-4 font-mono text-center">Try asking me...</p>
                    <div className="space-y-4">
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {suggestionPills[language].row1.map((pill, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(pill.text)}
                            className="flex-shrink-0 bg-teal-900/20 border border-teal-500/30 hover:bg-teal-900/30 hover:shadow-lg hover:shadow-teal-500/10 hover:scale-105 text-teal-200 px-5 py-2.5 rounded-full text-sm transition-all whitespace-nowrap"
                          >
                            {pill.icon} {pill.text}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {suggestionPills[language].row2.map((pill, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(pill.text)}
                            className="flex-shrink-0 bg-teal-900/20 border border-teal-500/30 hover:bg-teal-900/30 hover:shadow-lg hover:shadow-teal-500/10 hover:scale-105 text-teal-200 px-5 py-2.5 rounded-full text-sm transition-all whitespace-nowrap"
                          >
                            {pill.icon} {pill.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {messages.map((message, index) => (
                <div key={message.id} className={`mb-8 ${message.role === 'patient' ? 'flex justify-end' : 'flex justify-start'}`}>
                  {message.role === 'ai' && (
                    <div className="flex items-start gap-4 max-w-[85%]">
                      <div className="w-10 h-10 rounded-xl bg-teal-900 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-6 h-6 text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-teal-900/12 border border-teal-500/20 rounded-3xl rounded-tl-sm p-6 shadow-lg shadow-teal-500/5">
                          {index === 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-bold text-teal-300" style={{ fontFamily: 'Playfair Display, serif' }}>
                                CeenAiX AI
                              </p>
                              <p className="text-xs text-teal-400/60 font-mono">● Personalized for Parnia</p>
                            </div>
                          )}
                          <div className="text-white/90 leading-relaxed whitespace-pre-line text-[15px]">
                            {message.content}
                            {message.streaming && <span className="inline-block w-0.5 h-5 bg-teal-400 ml-1 animate-pulse" />}
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/6">
                            <p className="text-xs text-white/30 italic">
                              ℹ️ General health information only — not medical advice. Always follow your doctors' instructions.
                            </p>
                          </div>
                        </div>
                        {!message.streaming && (
                          <div className="flex items-center gap-2 mt-2 opacity-0 hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-white/30 hover:text-white/60 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-white/30 hover:text-white/60 transition-colors">
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-white/30 hover:text-white/60 transition-colors">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-white/30 hover:text-white/60 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-white/30 hover:text-white/60 transition-colors">
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {message.role === 'patient' && (
                    <div className="max-w-[70%]">
                      <div className="bg-teal-600 rounded-3xl rounded-tr-sm p-6 shadow-lg shadow-teal-500/30">
                        <p className="text-white leading-relaxed text-[15px]">{message.content}</p>
                      </div>
                      <p className="text-xs text-white/30 mt-1 text-right font-mono">
                        {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex items-start gap-4 max-w-[85%] mb-8">
                  <div className="w-10 h-10 rounded-xl bg-teal-900 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-6 h-6 text-teal-400" />
                  </div>
                  <div className="bg-teal-900/12 border border-teal-500/20 rounded-3xl rounded-tl-sm p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                    <p className="text-xs text-teal-300/60 italic font-mono">Checking your health profile...</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border-t border-white/6 px-8 py-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-4">
                <button
                  onClick={handleVoiceInput}
                  disabled={isRecording}
                  className={`p-3 rounded-xl transition-all ${
                    isRecording
                      ? 'bg-red-600 text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                  title="Voice Input"
                >
                  {isRecording ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                </button>

                <div className="flex-1">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(inputText);
                      }
                    }}
                    placeholder={language === 'en' ? 'Ask me anything about your health...' : '...بپرسید'}
                    className="w-full bg-white/6 border border-white/10 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 rounded-3xl px-5 py-3 text-white placeholder-white/40 resize-none outline-none transition-all"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  {isRecording && (
                    <p className="text-xs text-teal-400 mt-1 ml-5">Listening... (tap to stop)</p>
                  )}
                </div>

                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={!inputText.trim()}
                  className={`p-4 rounded-xl transition-all ${
                    inputText.trim()
                      ? 'bg-gradient-to-br from-teal-600 to-emerald-600 shadow-lg shadow-teal-500/40 hover:scale-105'
                      : 'bg-white/8 text-white/20'
                  }`}
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>

              <p className="text-center text-xs text-white/20 mt-3 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Your health data is private and encrypted
              </p>
            </div>
          </div>
        </div>
        </main>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={() => setShowSettings(false)}>
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>AI Assistant Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-white/60 hover:text-white/80">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-8 max-h-[600px] overflow-y-auto">
              <div>
                <p className="text-sm text-white/70 mb-3">Language</p>
                <div className="bg-white/8 border border-white/12 rounded-full p-1 flex items-center gap-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      language === 'en' ? 'bg-white text-teal-600' : 'text-white/60'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => setLanguage('fa')}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      language === 'fa' ? 'bg-white text-teal-600' : 'text-white/60'
                    }`}
                  >
                    🇮🇷 Persian
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-white/70 mb-3">Response Style</p>
                <label className="flex items-center gap-3 p-3 bg-white/4 rounded-lg cursor-pointer hover:bg-white/6 transition-colors">
                  <input type="radio" name="style" defaultChecked className="text-teal-600" />
                  <span className="text-sm text-white/90">Friendly & personal</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white/4 rounded-lg cursor-pointer hover:bg-white/6 transition-colors mt-2">
                  <input type="radio" name="style" className="text-teal-600" />
                  <span className="text-sm text-white/90">Clinical & formal</span>
                </label>
              </div>

              <div>
                <p className="text-sm text-white/70 mb-3">Health Data Access</p>
                <div className="space-y-2">
                  {['Access my medications', 'Access my lab results', 'Access my imaging results', 'Access my upcoming appointments', 'Reference my allergies in responses'].map((item, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 bg-white/4 rounded-lg cursor-pointer hover:bg-white/6 transition-colors">
                      <input type="checkbox" defaultChecked className="text-teal-600 rounded" />
                      <span className="text-sm text-white/90">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 p-3 bg-white/4 rounded-lg cursor-pointer hover:bg-white/6 transition-colors">
                  <input type="checkbox" defaultChecked className="text-teal-600 rounded" />
                  <span className="text-sm text-white/90">Show disclaimers on responses</span>
                </label>
              </div>

              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
