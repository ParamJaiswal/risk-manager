import { useState } from 'react';
import { generateDescription, getRecommendations, queryAi } from '../services/api';

const AiPanel = () => {
  // State for each AI feature
  const [descTitle, setDescTitle] = useState('');
  const [description, setDescription] = useState('');
  const [descLoading, setDescLoading] = useState(false);

  const [recTopic, setRecTopic] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [queryLoading, setQueryLoading] = useState(false);

  // Generate AI Description
  const handleDescribe = async () => {
    if (!descTitle.trim()) return;
    setDescLoading(true);
    setDescription('');
    try {
      const res = await generateDescription(descTitle);
      setDescription(res.data.description);
    } catch {
      setDescription('Failed to generate description. Make sure AI service is running.');
    } finally {
      setDescLoading(false);
    }
  };

  // Get AI Recommendations
  const handleRecommend = async () => {
    if (!recTopic.trim()) return;
    setRecLoading(true);
    setRecommendations([]);
    try {
      const res = await getRecommendations(recTopic);
      setRecommendations(res.data.recommendations || []);
    } catch {
      setRecommendations(['Failed to get recommendations. Make sure AI service is running.']);
    } finally {
      setRecLoading(false);
    }
  };

  // Ask AI Question (RAG)
  const handleQuery = async () => {
    if (!question.trim()) return;
    setQueryLoading(true);
    setAnswer('');
    setSources([]);
    try {
      const res = await queryAi(question);
      setAnswer(res.data.answer);
      setSources(res.data.sources || []);
    } catch {
      setAnswer('Failed to get answer. Make sure AI service is running.');
    } finally {
      setQueryLoading(false);
    }
  };

  const LoadingDots = () => (
    <div className="flex space-x-1.5 items-center justify-center py-4">
      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-primary-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">AI Assistant</h2>
      </div>

      {/* Generate Description */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center space-x-2">
          <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-md flex items-center justify-center text-xs font-bold">1</span>
          <span>Generate Description</span>
        </h3>
        <div className="flex space-x-2">
          <input
            id="describe-input"
            type="text"
            value={descTitle}
            onChange={(e) => setDescTitle(e.target.value)}
            placeholder="Enter training title..."
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleDescribe()}
          />
          <button
            id="describe-button"
            onClick={handleDescribe}
            disabled={descLoading || !descTitle.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-lg hover:from-primary-400 hover:to-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {descLoading ? '...' : 'Generate'}
          </button>
        </div>
        {descLoading && <LoadingDots />}
        {description && (
          <div className="mt-3 p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg border border-primary-100 animate-fadeIn">
            <p className="text-sm text-slate-700 leading-relaxed">{description}</p>
          </div>
        )}
      </div>

      {/* Get Recommendations */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center space-x-2">
          <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-md flex items-center justify-center text-xs font-bold">2</span>
          <span>Get Recommendations</span>
        </h3>
        <div className="flex space-x-2">
          <input
            id="recommend-input"
            type="text"
            value={recTopic}
            onChange={(e) => setRecTopic(e.target.value)}
            placeholder="Enter training topic..."
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
          />
          <button
            id="recommend-button"
            onClick={handleRecommend}
            disabled={recLoading || !recTopic.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {recLoading ? '...' : 'Recommend'}
          </button>
        </div>
        {recLoading && <LoadingDots />}
        {recommendations.length > 0 && (
          <div className="mt-3 space-y-2 animate-fadeIn">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-slate-700">{rec}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ask AI Question (RAG) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-semibold text-slate-700 mb-1 flex items-center space-x-2">
          <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-md flex items-center justify-center text-xs font-bold">3</span>
          <span>Ask AI (RAG Chatbot)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-3">Answers from compliance documents using Retrieval-Augmented Generation</p>
        <div className="flex space-x-2">
          <input
            id="query-input"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What is GDPR? What are password rules?"
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
          />
          <button
            id="query-button"
            onClick={handleQuery}
            disabled={queryLoading || !question.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-violet-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {queryLoading ? '...' : 'Ask'}
          </button>
        </div>
        {queryLoading && <LoadingDots />}
        {answer && (
          <div className="mt-3 animate-fadeIn">
            <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg border border-violet-100">
              <p className="text-sm text-slate-700 leading-relaxed">{answer}</p>
            </div>
            {sources.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs text-slate-400">Sources:</span>
                {sources.map((s, i) => (
                  <span key={i} className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiPanel;
