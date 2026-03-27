import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {
    Sparkles,
    Copy,
    Loader2,
    ShoppingBag,
    Globe,
    Check,
    Clock,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

// When you deploy to Render, change this to your Render URL (e.g., https://zual-backend.onrender.com)
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://zual-backend.onrender.com';

function App() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState([]);

    // 1. Fetch History from MongoDB
    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/history`);
            setHistory(res.data);
        } catch (err) {
            console.error("Error fetching history:", err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // 2. Handle Generation
    const handleGenerate = async () => {
        if (!input) return alert("Please enter product details!");

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/generate`, {
                productDescription: input
            });
            setResult(response.data.text);
            fetchHistory(); // Refresh the sidebar after new save
        } catch (error) {
            console.error("Generation error:", error);
            alert("Make sure your backend is running at: " + API_URL);
        } finally {
            setLoading(false);
        }
    };

    // 3. Copy to Clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* --- SIDEBAR --- */}
            <aside className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                            <ShoppingBag size={22} />
                        </div>
                        <div>
                            <h1 className="font-black text-2xl tracking-tighter text-slate-800">Zual.AI</h1>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">v1.0 Alpha</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={14} /> Recent Generations
                        </h3>
                    </div>

                    <div className="space-y-2">
                        {history.length > 0 ? history.map((item) => (
                            <button
                                key={item._id}
                                onClick={() => setResult(item.result)}
                                className="w-full text-left p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-sm text-slate-600 hover:border-blue-400 hover:shadow-md transition-all group relative flex items-center justify-between"
                            >
                                <span className="truncate pr-4">{item.productDescription}</span>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </button>
                        )) : (
                            <div className="py-12 text-center">
                                <p className="text-xs text-slate-400 italic">No history saved yet...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                    © 2026 Zual.AI | Made for Malaysian Sellers 🇲🇾
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Sell faster in every language.
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">
                        Generate pro-level listings for Shopee & TikTok Shop in English, Malay, and Chinese instantly.
                    </p>
                </div>

                {/* Input Box */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 lg:p-8 mb-10">
                    <div className="mb-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                            Enter Product Details
                        </label>
                        <textarea
                            className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-lg text-slate-800 placeholder:text-slate-300"
                            placeholder="Example: Kurung Modern, cooling silk material, floral prints, ironless..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xl tracking-tight transition-all active:scale-[0.98] ${loading
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200'
                            }`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <><Sparkles size={24} /> Generate High-Conversion Listing</>
                        )}
                    </button>
                </div>

                {/* Results Display */}
                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                                <Globe className="text-blue-500" size={24} />
                                Generated Copies
                            </h3>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                            >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                {copied ? 'Copied to Clipboard!' : 'Copy All Text'}
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden border-t-8 border-t-blue-600">
                            <div className="p-8 lg:p-12 prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 text-xs font-medium">
                            <div className="flex items-center gap-1"><Check size={14} className="text-green-500" /> AI Optimized</div>
                            <div className="flex items-center gap-1"><Check size={14} className="text-green-500" /> SEO Friendly</div>
                            <div className="flex items-center gap-1"><Check size={14} className="text-green-500" /> Shopee/TikTok Ready</div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;