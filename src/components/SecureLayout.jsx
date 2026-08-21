import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard, Calendar, FileText, ClipboardList,
  MessageSquare, Heart, User, Users, Settings, LogOut, Menu, X, Sparkles, Inbox, Receipt
} from 'lucide-react';
import LivePulse from '@/components/admin/LivePulse';

const adminGroups = [
  {
    label: 'Practice',
    items: [
      { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Clients', to: '/admin/clients', icon: Users },
      { label: 'Schedule', to: '/admin/schedule', icon: Calendar },
      { label: 'Session Notes', to: '/admin/session-notes', icon: FileText },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { label: 'Assignments', to: '/admin/assignments', icon: ClipboardList },
      { label: 'Messages', to: '/admin/messages', icon: MessageSquare },
      { label: 'Requests', to: '/admin/requests', icon: Inbox },
    ],
  },
  {
    label: 'Studio',
    items: [
      { label: 'Reflection', to: '/admin/assessment', icon: Sparkles },
      { label: 'Settings', to: '/admin/settings', icon: Settings },
    ],
  },
];

const portalGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', to: '/portal/dashboard', icon: LayoutDashboard },
      { label: 'Appointments', to: '/portal/appointments', icon: Calendar },
    ],
  },
  {
    label: 'Care',
    items: [
      { label: 'Documents', to: '/portal/documents', icon: FileText },
      { label: 'Assignments', to: '/portal/assignments', icon: ClipboardList },
      { label: 'Messages', to: '/portal/messages', icon: MessageSquare },
      { label: 'Mood', to: '/portal/mood', icon: Heart },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Invoices', to: '/portal/invoices', icon: Receipt },
      { label: 'Profile', to: '/portal/profile', icon: User },
    ],
  },
];

export default function SecureLayout({ variant = 'portal' }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const groups = variant === 'admin' ? adminGroups : portalGroups;
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout(false);
    navigate('/');
  };

  const SidebarContent = (
    <aside className="w-64 bg-neutral-50 border-r border-neutral-200/70 flex flex-col h-full">
      <div className="px-7 py-7 border-b border-neutral-200/60">
        <Link to="/" className="inline-block">
          <span className="font-display text-xl tracking-tight text-neutral-800">studioHuman</span>
        </Link>
        <div className="flex items-center gap-2 mt-2.5">
          <LivePulse />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-red-600/70">
            {variant === 'admin' ? 'Admin Portal' : 'Client Portal'}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.label} className="mb-7 last:mb-0">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-300 px-3 block mb-2.5">
              {group.label}
            </span>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="relative flex items-center gap-3 pl-4 pr-3 py-2.5 group rounded-md"
                  >
                    {active && (
                      <motion.span
                        layoutId={`${variant}-nav-active`}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-full bg-red-500"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <item.icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? 'text-red-600' : 'text-neutral-400 group-hover:text-neutral-700'}`}
                      strokeWidth={1.5}
                    />
                    <span
                      className={`font-mono text-[11px] uppercase tracking-widest transition-colors ${active ? 'text-neutral-800' : 'text-neutral-400 group-hover:text-neutral-700'}`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-5 py-5 border-t border-neutral-200/60">
        <p className="font-display text-sm text-neutral-800 truncate">{user?.full_name || user?.email}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
            {variant === 'admin' ? 'Admin' : 'Client'}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-neutral-400 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 z-30">
        {SidebarContent}
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0">{SidebarContent}</div>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-neutral-50/90 backdrop-blur-md border-b border-neutral-200/70 h-14 flex items-center justify-between px-5">
        <Link to="/">
          <span className="font-display text-base tracking-tight text-neutral-800">studioHuman</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-neutral-600">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}