import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: 'dashboard' },
        { name: 'Posts', path: '/posts', icon: 'description' },
        { name: 'Create Post', path: '/create', icon: 'add_box' },
        { name: 'Platforms', path: '/platforms', icon: 'share' },
        { name: 'Settings', path: '/settings', icon: 'settings' },
    ];

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-10 transition-transform">
                <div className="p-6 flex flex-col gap-8 h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold leading-none">SocialAuto AI</h1>
                            <p className="text-slate-500 text-xs font-normal">Pro Plan</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-1 flex-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary font-semibold'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined" style={item.name === 'Create Post' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                    {item.icon}
                                </span>
                                <p className="text-sm">{item.name}</p>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                            <div className="h-9 w-9 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=Alex+Rivera&background=random')" }}></div>
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold">Alex Rivera</p>
                                <p className="text-xs text-slate-500">alex@creator.io</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
