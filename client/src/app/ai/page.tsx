'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Sparkles, Copy, Check } from 'lucide-react';
const API = process.env.NEXT_PUBLIC_API_URL;

export default function AiAssistantPage() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('viral');
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // AI Response States
  const [aiResponse, setAiResponse] = useState<{
    caption: string;
    hashtags: string;
    cta: string;
  } | null>(null);

  const tones = [
    { id: 'viral', label: '🔥 Viral', desc: 'High engagement & reach' },
    { id: 'professional', label: '💼 Professional', desc: 'Corporate & clean' },
    { id: 'funny', label: '😂 Funny', desc: 'Humorous & witty' },
    { id: 'marketing', label: '📈 Marketing', desc: 'Sales & conversion focused' },
    { id: 'gen-z', label: '🧢 Gen-Z', desc: 'Slangs & trendy vibes' },
    { id: 'tech', label: '💻 Tech', desc: 'Informative & geeky' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return toast.error('Please enter a topic or post idea!');

    setLoading(true);
    setAiResponse(null);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API}/api/ai/generate`,
        { topic, tone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Backend aur frontend ab completely aligned hain response.data.success par
      if (response.data && response.data.success) {
        const data = response.data.result;

        if (data) {
          setAiResponse({
            caption: data.caption || 'No caption generated.',
            hashtags: data.hashtags || '#automation #saas #ai',
            cta: data.cta || 'Click the link in bio to explore! 🚀',
          });
          toast.success('AI Content Generated Successfully! ✨');
        } else {
          toast.error('Data object empty from server pipeline.');
        }
      } else {
        toast.error('Failed to parse clean context from server.');
      }
    } catch (error: any) {
      console.error('AI Generation Error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate AI content.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Description Grid */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-transparent p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30 text-indigo-400">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">AI Copywriting & Strategy Engine</h2>
            <p className="text-sm text-gray-400 mt-1">
              Apne brand ke liye specialized captions, high-converting CTAs, aur hyper-targeted hashtags generate karein Gemini AI microservice ke sath.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Side: Generator Form Panel */}
        <div className="lg:col-span-2 bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What is your post about?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., A comprehensive roadmap to learn the MERN stack in 2026 with real-world SaaS projects..."
                rows={4}
                className="w-full px-4 py-3 bg-[#030712] border border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 text-gray-200 placeholder-gray-600 text-sm resize-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Content Tone
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${tone === t.id
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                        : 'bg-[#030712] border-gray-800 text-gray-400 hover:border-gray-700'
                      }`}
                  >
                    <span className="text-sm font-semibold">{t.label}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Content
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Output Panel */}
        <div className="lg:col-span-3 space-y-6">
          {aiResponse ? (
            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Caption Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">📝 Generated Caption</span>
                  <button
                    onClick={() => copyToClipboard(aiResponse.caption, 'Caption')}
                    className="text-gray-500 hover:text-gray-300 transition-colors p-1"
                  >
                    {copiedField === 'Caption' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="bg-[#030712] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {aiResponse.caption}
                </div>
              </div>

              {/* Call to Action Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">🎯 Call To Action (CTA)</span>
                  <button
                    onClick={() => copyToClipboard(aiResponse.cta, 'CTA')}
                    className="text-gray-500 hover:text-gray-300 transition-colors p-1"
                  >
                    {copiedField === 'CTA' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="bg-[#030712] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 italic">
                  {aiResponse.cta}
                </div>
              </div>

              {/* Hashtags Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">#️ Hashtags</span>
                  <button
                    onClick={() => copyToClipboard(aiResponse.hashtags, 'Hashtags')}
                    className="text-gray-500 hover:text-gray-300 transition-colors p-1"
                  >
                    {copiedField === 'Hashtags' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="bg-[#030712] border border-gray-800 rounded-xl p-4 text-sm text-indigo-300 font-mono tracking-wide">
                  {aiResponse.hashtags}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0B0F19]/40 border border-gray-800/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[450px]">
              <div className="p-4 bg-gray-900/50 rounded-full text-gray-600 border border-gray-800 mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-gray-300 font-semibold text-base">No content generated yet</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">
                Left panel mein apna topic fill karein aur tone select karke generate karein. Apka optimized data yahan instantly display ho jayega.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}