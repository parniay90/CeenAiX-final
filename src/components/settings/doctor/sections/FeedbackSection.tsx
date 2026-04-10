import React, { useState } from 'react';
import { MessageSquare, Star, ThumbsUp } from 'lucide-react';
import SettingsCard from '../SettingsCard';

interface Props {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const featureVotes = [
  { feature: 'Video consultation recording (opt-in)', votes: 156 },
  { feature: 'AI real-time consultation transcription', votes: 203 },
  { feature: 'Arabic portal language', votes: 89 },
  { feature: 'Advanced analytics dashboard', votes: 67 },
];

const FeedbackSection: React.FC<Props> = ({ showToast }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [votes, setVotes] = useState(featureVotes.map((f) => ({ ...f, voted: false })));

  const feedbackTypes = ['✨ Feature Request', '🐛 Bug', '💡 Suggestion', '😊 Compliment', '📋 Clinical Workflow'];

  return (
    <SettingsCard id="feedback" title="Feedback" icon={MessageSquare} iconBg="bg-blue-100" iconColor="text-blue-600">
      <div className="p-6 space-y-6">
        {!submitted ? (
          <>
            <div>
              <p className="text-[14px] font-semibold text-slate-800 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                How would you rate the CeenAiX Doctor Portal?
              </p>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-[13px] text-slate-500 ml-2">
                    {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
                  </span>
                )}
              </div>
            </div>

            {rating > 0 && (
              <>
                <div>
                  <p className="text-[13px] font-medium text-slate-700 mb-2">Feedback type</p>
                  <div className="flex flex-wrap gap-2">
                    {feedbackTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setFeedbackType(type)}
                        className={`px-3 py-1.5 rounded-xl text-[12px] border transition-colors ${
                          feedbackType === type ? 'bg-teal-500 text-white border-teal-500' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  placeholder="Tell us more..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none placeholder-slate-400"
                  rows={4}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <button
                  onClick={() => { setSubmitted(true); showToast('✅ Feedback submitted — thank you!'); }}
                  className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors text-[14px]"
                >
                  Submit Feedback
                </button>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎉</span>
            </div>
            <p className="text-[15px] font-semibold text-slate-800 mb-1">Thank you for your feedback!</p>
            <p className="text-[13px] text-slate-400">Your input helps us improve CeenAiX for all doctors.</p>
            <button onClick={() => { setSubmitted(false); setRating(0); setFeedbackMsg(''); setFeedbackType(''); }} className="text-[13px] text-teal-600 hover:text-teal-700 mt-3 transition-colors">
              Submit another
            </button>
          </div>
        )}

        <div className="border-t border-slate-100 pt-5">
          <p className="text-[13px] font-semibold text-slate-800 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            What should we build next?
          </p>
          <div className="space-y-2">
            {votes.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <p className="text-[13px] text-slate-700 flex-1 pr-3" style={{ fontFamily: 'Inter, sans-serif' }}>{item.feature}</p>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-[12px] text-slate-400 font-mono">{item.voted ? item.votes + 1 : item.votes}</span>
                  <button
                    onClick={() => {
                      setVotes((prev) => prev.map((v, j) => j === i ? { ...v, voted: !v.voted } : v));
                      showToast(item.voted ? '✅ Vote removed' : '✅ Vote recorded!');
                    }}
                    className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${
                      item.voted
                        ? 'bg-teal-50 border-teal-200 text-teal-600'
                        : 'border-slate-200 text-slate-500 hover:border-teal-200 hover:text-teal-600'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{item.voted ? 'Voted' : 'Vote'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingsCard>
  );
};

export default FeedbackSection;
