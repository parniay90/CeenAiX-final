import React, { useState } from 'react';
import { Star, MessageSquare, Flag, ChevronDown } from 'lucide-react';

interface ReviewsSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const reviews = [
  {
    id: 1, name: 'Khalid Hassan Abdullah', anon: false, insurance: 'ADNIC Standard', rating: 5, date: '6 March 2026',
    text: 'Dr. Ahmed is exceptionally thorough. He takes time to explain everything clearly and I always leave the appointment feeling confident about my treatment. Highly recommend.',
    reply: 'Thank you for your kind words, Khalid. Looking forward to your next visit in May!',
  },
  {
    id: 2, name: 'Anonymous', anon: true, insurance: 'Daman Gold', rating: 5, date: '14 February 2026',
    text: 'Best cardiologist in Dubai in my opinion. Very knowledgeable, calm, and reassuring. My ECG showed something unusual and he explained it in full detail without making me panic.',
    reply: null,
  },
  {
    id: 3, name: 'Sarah M.', anon: false, insurance: 'AXA Gulf', rating: 4, date: '9 January 2026',
    text: 'Great doctor, very professional. Waiting time was a bit long but the consultation itself was excellent. He clearly knows his field very well.',
    reply: null,
  },
  {
    id: 4, name: 'Mohammed Al Rasheed', anon: false, insurance: 'Thiqa', rating: 5, date: '3 December 2025',
    text: 'Dr. Ahmed has been managing my heart failure for over a year. He is dedicated, responsive, and always available through the app. I feel very well cared for.',
    reply: null,
  },
  {
    id: 5, name: 'Anonymous', anon: true, insurance: 'AXA Gulf', rating: 5, date: '22 November 2025',
    text: 'Came in worried about chest pain. Dr. Ahmed was thorough, ordered the right tests, and called me personally with results. Exceptional care.',
    reply: null,
  },
];

const distribution = [
  { stars: 5, pct: 91, count: 169 },
  { stars: 4, pct: 6, count: 11 },
  { stars: 3, pct: 2, count: 4 },
  { stars: 2, pct: 1, count: 2 },
  { stars: 1, pct: 0, count: 0 },
];

const StarRow: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={`text-amber-400 ${s <= rating ? 'fill-amber-400' : ''}`} style={{ width: size, height: size }} />
    ))}
  </div>
);

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ showToast }) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all');

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Patient Ratings & Reviews</h2>
            <p className="text-[12px] text-slate-400">186 verified reviews · Only from verified appointments</p>
          </div>
        </div>
        <button onClick={() => showToast('✅ Review analytics opened')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[12px] text-slate-600 font-medium transition-colors">
          📊 Analytics
        </button>
      </div>

      <div className="p-6 border-b border-slate-100">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-[56px] font-bold text-amber-600 leading-none mb-2" style={{ fontFamily: 'DM Mono, monospace' }}>4.9</p>
            <StarRow rating={5} size={22} />
            <p className="text-[12px] text-slate-400 mt-1">out of 5.0</p>
            <p className="text-[11px] text-slate-400">186 verified reviews</p>
          </div>
          <div className="space-y-2">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center space-x-2">
                <span className="text-[12px] text-slate-500 w-4 flex-shrink-0">{d.stars}★</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="text-[11px] text-slate-400 flex-shrink-0 w-14 text-right" style={{ fontFamily: 'DM Mono, monospace' }}>
                  {d.pct}% ({d.count})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {[['🕐 Punctuality', '4.7'], ['💬 Communication', '5.0'], ['🩺 Medical Knowledge', '5.0']].map(([label, val]) => (
            <div key={label} className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-[11px] text-slate-500 mb-1">{label}</p>
              <p className="text-[16px] font-bold text-amber-600" style={{ fontFamily: 'DM Mono, monospace' }}>{val} ★</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-3 border-b border-slate-100 flex items-center space-x-2">
        {['all', '5', '4', '3-'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${filter === f ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f === 'all' ? 'All Reviews' : f === '3-' ? '3★ and below' : `${f}★`}
          </button>
        ))}
        <div className="ml-auto flex items-center space-x-2">
          <span className="text-[12px] text-slate-400">Sort:</span>
          <select className="border border-slate-200 rounded-lg px-2 py-1 text-[12px] text-slate-600 focus:outline-none">
            <option>Newest</option>
            <option>Most Helpful</option>
          </select>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-slate-100 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <StarRow rating={review.rating} size={14} />
                <span className="text-[13px] font-semibold text-slate-800">{review.name}</span>
                {!review.anon && (
                  <span className="px-1.5 py-0.5 bg-teal-50 text-teal-600 text-[9px] font-bold rounded-full border border-teal-100">Verified</span>
                )}
              </div>
              <span className="text-[11px] text-slate-400" style={{ fontFamily: 'DM Mono, monospace' }}>{review.date}</span>
            </div>
            {review.insurance && (
              <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded mb-2">{review.insurance} patient</span>
            )}
            <p className="text-[13px] text-slate-700 leading-relaxed mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              {review.text}
            </p>
            {review.reply && (
              <div className="ml-4 pl-4 border-l-2 border-teal-200 bg-teal-50 rounded-r-xl p-3">
                <p className="text-[11px] font-bold text-teal-700 mb-0.5">Dr. Ahmed replied:</p>
                <p className="text-[12px] text-teal-700 italic">{review.reply}</p>
              </div>
            )}
            {replyingTo === review.id ? (
              <div className="mt-3 space-y-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                />
                <div className="flex space-x-2">
                  <button onClick={() => { setReplyingTo(null); setReplyText(''); showToast('✅ Reply posted'); }} className="px-4 py-1.5 bg-teal-500 text-white rounded-lg text-[12px] font-medium hover:bg-teal-600 transition-colors">
                    Post Reply
                  </button>
                  <button onClick={() => setReplyingTo(null)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-[12px] text-slate-500 hover:bg-slate-200 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 mt-2">
                {!review.reply && (
                  <button onClick={() => setReplyingTo(review.id)} className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] text-slate-500 transition-colors">
                    <MessageSquare className="w-3 h-3" /><span>Reply</span>
                  </button>
                )}
                <button onClick={() => showToast('✅ Review flagged for review')} className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] text-slate-500 transition-colors">
                  <Flag className="w-3 h-3" /><span>Flag</span>
                </button>
              </div>
            )}
          </div>
        ))}

        <button onClick={() => showToast('✅ Loading more reviews')} className="w-full py-3 border border-teal-300 text-teal-600 hover:bg-teal-50 rounded-xl text-[13px] font-medium transition-colors flex items-center justify-center space-x-2">
          <ChevronDown className="w-4 h-4" /><span>Load More Reviews</span>
        </button>
      </div>

      <div className="mx-4 mb-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
        <p className="text-[13px] font-semibold text-teal-800 mb-1">💡 Responding to reviews improves patient trust</p>
        <p className="text-[12px] text-teal-700">88% of patients say a doctor's response to a review positively influences their booking decision.</p>
        <p className="text-[12px] text-teal-600 mt-1">Dr. Ahmed has replied to 23 of 186 reviews</p>
      </div>
    </div>
  );
};

export default ReviewsSection;
