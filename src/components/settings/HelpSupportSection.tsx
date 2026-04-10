import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Star, Bug, FileText, ExternalLink } from 'lucide-react';
import { MOCK_FAQS, FAQ } from '../../types/settings';

export default function HelpSupportSection() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'feedback' | 'bug'>('faq');

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const links = [
    { label: 'DHA Patient Rights', url: '#', icon: FileText },
    { label: 'Privacy Policy', url: '#', icon: FileText },
    { label: 'Terms of Service', url: '#', icon: FileText },
    { label: 'NABIDH Information', url: '#', icon: ExternalLink },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 px-6 py-4 text-sm font-bold transition-colors ${
              activeTab === 'faq'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 px-6 py-4 text-sm font-bold transition-colors ${
              activeTab === 'contact'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Contact Support
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 px-6 py-4 text-sm font-bold transition-colors ${
              activeTab === 'feedback'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Submit Feedback
          </button>
          <button
            onClick={() => setActiveTab('bug')}
            className={`flex-1 px-6 py-4 text-sm font-bold transition-colors ${
              activeTab === 'bug'
                ? 'bg-teal-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Report Bug
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'faq' && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h3>
              {MOCK_FAQS.map((faq: FAQ) => (
                <div key={faq.id} className="bg-slate-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white mb-1">{faq.question}</div>
                      <div className="text-xs text-teal-400">{faq.category}</div>
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0 ml-3" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-3" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 pb-4 text-sm text-slate-300 border-t border-slate-600 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-teal-400" />
                <h3 className="text-lg font-bold text-white">Contact Support</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Our support team is available 24/7 to help you. Start a conversation and we'll respond as soon as possible.
              </p>

              <div className="bg-slate-700 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500 mb-1">Email Support</div>
                    <div className="text-white font-bold">support@ceenaix.ae</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Phone Support</div>
                    <div className="text-white font-bold">+971 4 123 4567</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Live Chat</div>
                    <div className="text-white font-bold">Available 24/7</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Response Time</div>
                    <div className="text-white font-bold">Within 2 hours</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Message</label>
                <textarea
                  rows={6}
                  placeholder="Describe your issue or question..."
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors">
                <MessageSquare className="w-4 h-4" />
                Start Chat with Support
              </button>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-teal-400" />
                <h3 className="text-lg font-bold text-white">Submit Feedback</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Help us improve CeenAiX by sharing your thoughts and suggestions.
              </p>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-3">How would you rate your experience?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= rating
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-slate-400 mt-2">
                    {rating === 5 && "Excellent! We're thrilled you love CeenAiX!"}
                    {rating === 4 && "Great! Thank you for your positive feedback."}
                    {rating === 3 && "Good. We'd love to know how we can improve."}
                    {rating === 2 && "We're sorry to hear that. Please tell us what went wrong."}
                    {rating === 1 && "We apologize for your experience. Your feedback is crucial to us."}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Your Feedback</label>
                <textarea
                  rows={6}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your thoughts, suggestions, or feature requests..."
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors">
                Submit Feedback
              </button>
            </div>
          )}

          {activeTab === 'bug' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Bug className="w-6 h-6 text-teal-400" />
                <h3 className="text-lg font-bold text-white">Report a Bug</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Help us fix issues by reporting bugs you encounter. Please provide as much detail as possible.
              </p>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Bug Title</label>
                <input
                  type="text"
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">What page or feature were you using?</label>
                <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500">
                  <option>Dashboard</option>
                  <option>Appointments</option>
                  <option>My Health</option>
                  <option>Messages</option>
                  <option>Settings</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Detailed Description</label>
                <textarea
                  rows={6}
                  placeholder="What happened? What did you expect to happen? What steps can we take to reproduce the issue?"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Screenshot (optional)</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer">
                  <Bug className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Drop a screenshot here or click to upload</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors">
                <Bug className="w-4 h-4" />
                Submit Bug Report
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Helpful Resources</h3>
        <div className="grid grid-cols-2 gap-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                className="flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <Icon className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span className="text-sm font-bold text-white">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
