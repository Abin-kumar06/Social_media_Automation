import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts/');
                setPosts(response.data);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-8 space-y-8">
            {/* Page Heading */}
            <header className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Dashboard Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Manage and automate your social media content strategy</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        Last 30 Days
                    </button>
                </div>
            </header>

            {/* Stats / Metric Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-gradient-to-br from-primary to-purple-500 flex flex-col gap-2 rounded-xl p-6 shadow-lg shadow-primary/20 text-white">
                    <div className="flex justify-between items-start">
                        <p className="text-white/80 text-sm font-medium">Total Posts</p>
                        <span className="material-symbols-outlined opacity-60">analytics</span>
                    </div>
                    <p className="text-3xl font-bold tracking-tight">{posts.length}</p>
                    <div className="flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-xs">trending_up</span>
                        <p className="text-xs font-semibold">+12% from last month</p>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Scheduled</p>
                        <span className="material-symbols-outlined text-primary">schedule</span>
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">0</p>
                    <div className="flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-xs text-emerald-500">trending_up</span>
                        <p className="text-xs font-semibold text-emerald-500">+5% increasing</p>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Success Rate</p>
                        <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">100%</p>
                    <div className="flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-xs text-emerald-500">arrow_upward</span>
                        <p className="text-xs font-semibold text-emerald-500">Stable</p>
                    </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Failed</p>
                        <span className="material-symbols-outlined text-rose-500">error</span>
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">0</p>
                    <div className="flex items-center gap-1 mt-2 text-rose-500">
                        <span className="material-symbols-outlined text-xs">trending_down</span>
                        <p className="text-xs font-semibold">-2% improvement</p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Posts List */}
                <section className="lg:col-span-2 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Posts</h3>
                        <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {posts.length === 0 && !loading ? (
                            <div className="p-8 text-center text-slate-500">No posts found. Create one!</div>
                        ) : (
                            posts.slice(0, 5).map((post, i) => (
                                <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="h-12 w-12 rounded bg-slate-100 bg-gray-200 shrink-0 flex items-center justify-center text-slate-400 overflow-hidden">
                                            {/* Placeholder for image */}
                                            <span className="material-symbols-outlined">image</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{post.content || 'Untitled Post'}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-bold text-pink-600 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[10px]">photo_camera</span> {post.platform || 'INSTAGRAM'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col text-right">
                                            <p className="text-xs font-semibold text-slate-900 dark:text-white">{new Date(post.created_at).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-slate-400">{post.status}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${post.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                                                post.status === 'generating' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Quick Actions Section */}
                <section className="flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                        <div className="flex flex-col gap-3">
                            <NavLink to="/create" className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-md shadow-primary/20">
                                <span className="material-symbols-outlined text-xl">add</span>
                                Create Post
                            </NavLink>
                            <NavLink to="/platforms" className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-xl">link</span>
                                Connect Instagram
                            </NavLink>
                        </div>
                    </div>

                    {/* Account Health */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Account Health</h3>
                            <span className="text-emerald-500 font-bold text-xs uppercase">Excellent</span>
                        </div>
                        <div className="space-y-3">
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[94%]"></div>
                            </div>
                            <p className="text-xs text-slate-500">Your engagement rate is 12% higher than similar accounts this week.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
