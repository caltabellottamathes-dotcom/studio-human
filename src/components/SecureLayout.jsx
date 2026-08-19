import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { wordmarkImg } from '@/data/content';
import {
  LayoutDashboard, Calendar, FileText, ClipboardList,
  MessageSquare, Heart, User, Users, Settings, LogOut, Menu, X, Sparkles, Inbox
} from 'lucide-react';

const portalNav = [
  { label: 'Dashboard', to: '/portal/dashboard', icon: LayoutDashboard },
  { label: 'Afspraken', to: '/portal/afspraken', icon: Calendar },
  { label: 'Documenten', to: '/portal/documenten', icon: FileText },
  { label: 'Opdrachten', to: '/portal/opdrachten', icon: ClipboardList },
  { label: 'Berichten', to: '/portal/berichten', icon: MessageSquare },
  { label: 'Stemming', to: '/portal/stemming', icon: Heart },
  { label: 'Profiel', to: '/portal/profiel', icon: User },
];

const adminNav = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Cliënten', to: '/admin/clienten', icon: Users },
  { label: 'Agenda', to: '/admin/agenda', icon: Calendar },
  { label: 'Notities', to: '/admin/notities', icon: FileText },
  { label: 'Opdrachten', to: '/admin/opdrachten', icon: ClipboardList },
  { label: 'Berichten', to: '/admin/berichten', icon: MessageSquare },
  { label: 'Aanvragen', to: '/admin/aanvragen', icon: Inbox },
  { label: 'Reflectie', to: '/admin/zelfreflectie', icon: Sparkles },
  { label: 'Instellingen', to: '/admin/instellingen', icon: Settings },
];

export default function SecureLayout({ variant = 'portal' }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = variant === 'admin' ? adminNav : portalNav;
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout(false);
    navigate('/');
  };

  const SidebarContent = (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-neutral-100">
        <Link to="/" className="inline-block">
          <img src={wordmarkImg} alt="amorvitae." className="h-5 w-auto" />
        </Link>
        <span className="block mt-1 text-[9px] uppercase tracking-[0.2em] text-neutral-400">
          {variant === 'admin' ? 'Beheerdersportaal' : 'Cliëntportaal'}
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive(item.to)
                ? 'bg-red-50 text-red-600'
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-body text-[11px] uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-neutral-100 space-y-2">
        <div className="px-2">
          <p className="text-xs text-neutral-700 font-medium truncate">{user?.full_name || user?.email}</p>
          <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-0.5">
            {variant === 'admin' ? 'Beheerder' : 'Cliënt'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          Uitloggen
        </button>
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-200 h-14 flex items-center justify-between px-4">
        <Link to="/">
          <img src={wordmarkImg} alt="amorvitae." className="h-4 w-auto" />
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