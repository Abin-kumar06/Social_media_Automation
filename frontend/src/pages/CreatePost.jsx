import React from 'react';

const CreatePost = () => {
    return (
        <div className="flex h-full flex-col overflow-y-auto">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                        <span className="hover:text-primary transition-colors cursor-pointer">Dashboard</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-slate-900 dark:text-white font-medium">Create Post</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Create New Post</h2>
                        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            View Drafts
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-8 pb-12 w-full grid grid-cols-12 gap-8">
                {/* Left Column: Creation Workspace */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    {/* Media Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">image</span>
                            Media & Content
                        </h3>
                        <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary/50 rounded-xl px-6 py-12 transition-all bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                            </div>
                            <p className="text-base font-bold text-slate-900 dark:text-white">Upload Media</p>
                            <p className="text-sm text-slate-500 mt-1">Drag and drop images or videos here, or <span className="text-primary font-semibold">browse</span></p>
                            <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" />
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Post Caption</label>
                            <div className="relative">
                                <textarea className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" placeholder="What's on your mind? Write your post caption here..." rows="6"></textarea>
                                <div className="absolute bottom-3 right-3 text-xs text-slate-400">0 / 2200 characters</div>
                            </div>
                        </div>
                    </section>

                    {/* AI Generation Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">magic_button</span>
                                <h3 className="text-base font-bold">AI Assistant</h3>
                            </div>
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                <span className="ms-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Enable AI</span>
                            </label>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Describe the post you want to create and let AI generate a motivational and engaging caption for you.</p>
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">prompt_suggestion</span>
                                    <input className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Create a motivational post about consistency in tech..." type="text" />
                                </div>
                                <button className="bg-gradient-to-r from-primary to-purple-500 text-white px-6 py-3 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
                                    <span>Generate</span>
                                    <span className="material-symbols-outlined text-sm">bolt</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Settings & Actions */}
                <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    {/* Platform Selection */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">share</span>
                            Platforms
                        </h3>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 rounded-lg border border-primary bg-primary/5 cursor-pointer transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white">
                                        <span className="material-symbols-outlined text-lg">photo_camera</span>
                                    </div>
                                    <span className="text-sm font-semibold">Instagram</span>
                                </div>
                                <input type="checkbox" className="rounded text-primary focus:ring-primary size-5" defaultChecked />
                            </label>

                            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer transition-all">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="size-8 rounded flex items-center justify-center bg-[#0077b5] text-white">
                                        <span className="material-symbols-outlined text-lg">work</span>
                                    </div>
                                    <span className="text-sm font-semibold">LinkedIn</span>
                                </div>
                                <input type="checkbox" className="rounded text-primary focus:ring-primary size-5 border-slate-300" />
                            </label>
                        </div>
                    </section>

                    {/* Schedule Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">schedule</span>
                            Schedule
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Publish Date</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">calendar_month</span>
                                    <input className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20" type="date" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Publish Time</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">schedule</span>
                                    <input className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20" type="time" defaultValue="09:00" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Final Actions */}
                    <div className="flex flex-col gap-3 mt-4">
                        <button className="w-full py-4 bg-gradient-to-r from-primary to-purple-500 text-white rounded-xl font-black tracking-wide text-lg shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all">
                            Publish Now
                        </button>
                        <button className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-xl">event</span>
                            Schedule for Later
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CreatePost;
