import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

const Platforms = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState(null); // 'connected' | 'error' | null
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const statusParam = searchParams.get('status');
        const msgParam = searchParams.get('message');
        if (statusParam === 'success') {
            setStatus('connected');
        } else if (statusParam === 'error') {
            setStatus('error');
            setMessage(msgParam || 'Failed to connect Instagram');
        }
    }, [searchParams]);

    const handleInstagramConnect = async () => {
        try {
            setLoading(true);
            const response = await api.get('/platforms/instagram/connect/');
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Failed to get auth URL", error);
            setLoading(false);
            alert("Failed to initiate connection");
        }
    };

    return (
        <div className="flex-1 flex flex-col py-8 pb-20 px-8">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Connect Your Platforms</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">Manage your social media integrations to automate your content workflow. Connect once, publish everywhere.</p>
                </div>
                <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                    <span className="material-symbols-outlined mr-2">menu_book</span>
                    <span>View Documentation</span>
                </button>
            </div>

            {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <strong>Error:</strong> {message}
                </div>
            )}

            {/* SectionHeader */}
            <h3 className="text-[22px] font-bold leading-tight tracking-tight mb-6 text-slate-900 dark:text-white">Active Connections</h3>

            {/* Grid of Platforms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Instagram Card */}
                <div className={`bg-white dark:bg-slate-900 border ${status === 'connected' ? 'border-primary/20' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-6 shadow-xl shadow-primary/5 transition-transform hover:scale-[1.01]`}>
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="size-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-3xl">photo_camera</span>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">Instagram</p>
                                    {status === 'connected' && (
                                        <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest">Connected</span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{status === 'connected' ? '@connected_account' : 'Not Connected'}</p>
                            </div>
                        </div>
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 dark:text-slate-400">Status</span>
                            <span className={status === 'connected' ? "text-green-600 font-semibold" : "text-slate-500"}>
                                {status === 'connected' ? 'Active & Syncing' : 'Disconnected'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {status !== 'connected' ? (
                            <button
                                onClick={handleInstagramConnect}
                                disabled={loading}
                                className="w-full flex items-center justify-center rounded-lg h-10 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-70"
                            >
                                {loading ? 'Redirecting...' : 'Connect Instagram'}
                            </button>
                        ) : (
                            <>
                                <button className="flex-1 flex items-center justify-center rounded-lg h-10 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20">
                                    View Analytics
                                </button>
                                <button className="flex-1 flex items-center justify-center rounded-lg h-10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                    <span className="material-symbols-outlined mr-1 text-[18px]">logout</span>
                                    Disconnect
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Instruction Card */}
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 flex flex-col">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-primary">info</span>
                        How it works
                    </h4>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 size-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Select Platform</p>
                                <p className="text-xs text-slate-500">Choose from our available integrations list.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 size-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Authenticate</p>
                                <p className="text-xs text-slate-500">Securely sign in via OAuth to grant access.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 size-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Sync Content</p>
                                <p className="text-xs text-slate-500">Define your posting schedule and start automating.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto pt-6">
                        <a className="text-primary text-sm font-bold flex items-center gap-1 hover:underline" href="#">
                            Read integration guide <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Available Platforms */}
            <h3 className="text-[22px] font-bold leading-tight tracking-tight mb-6 mt-12 text-slate-900 dark:text-white">Available Platforms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Facebook (Coming Soon) */}
                <div className="relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 overflow-hidden">
                    <div className="flex flex-col gap-4 filter grayscale opacity-50">
                        <div className="size-12 bg-[#1877F2] rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-2xl">group</span>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">Facebook</p>
                            <p className="text-sm text-slate-500">Connect Pages & Groups</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-wider shadow-sm">Coming Soon</span>
                    </div>
                </div>

                {/* Twitter / X (Coming Soon) */}
                <div className="relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 overflow-hidden">
                    <div className="flex flex-col gap-4 filter grayscale opacity-50">
                        <div className="size-12 bg-black rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">Twitter (X)</p>
                            <p className="text-sm text-slate-500">Connect Personal & Brand accounts</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-wider shadow-sm">Coming Soon</span>
                    </div>
                </div>

                {/* LinkedIn (Coming Soon) */}
                <div className="relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 overflow-hidden">
                    <div className="flex flex-col gap-4 filter grayscale opacity-50">
                        <div className="size-12 bg-[#0077b5] rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-2xl">work</span>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">LinkedIn</p>
                            <p className="text-sm text-slate-500">Connect Professional profile</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-wider shadow-sm">Coming Soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Platforms;
