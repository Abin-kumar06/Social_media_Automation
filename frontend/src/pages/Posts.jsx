import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Posts = () => {
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
        <div className="flex-1 flex flex-col h-full">
            {/* Page Heading */}
            <header className="p-8 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Posts Management</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and monitor your AI-generated social media content across platforms.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            Calendar View
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 md:hidden">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Create
                        </button>
                    </div>
                </div>
            </header>

            {/* Filters & Search */}
            <section className="px-8 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="relative block">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <span className="material-symbols-outlined">search</span>
                            </span>
                            <input className="block w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 pl-10 pr-3 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" placeholder="Search posts by content or keyword..." type="text" />
                        </label>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {['All Status', 'Draft', 'Generating', 'Success', 'Failed'].map((status) => (
                            <button key={status} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${status === 'All Status' ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-transparent' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}>
                                {status}
                                {status === 'All Status' && <span className="material-symbols-outlined text-sm">expand_more</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Table Content */}
            <section className="px-8 py-4 flex-1">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            {posts.length === 0 && !loading ? (
                                <div className="p-12 text-center text-slate-500">
                                    <p>No posts found.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-20">Thumbnail</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Content</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Platform</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Time</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {posts.map((post) => (
                                            <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 overflow-hidden">
                                                        {post.media_url ? (
                                                            <img src={post.media_url} className="w-full h-full object-cover" alt="Post thumbnail" />
                                                        ) : (
                                                            <span className="material-symbols-outlined">image</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 max-w-xs">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{post.content || 'Untitled Post'}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="material-symbols-outlined text-pink-600">photo_camera</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold 
                                ${post.status === 'published' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                                                            post.status === 'generating' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                                                        {post.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(post.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">visibility</span></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Posts;
