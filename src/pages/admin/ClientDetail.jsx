import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppointmentFormDialog from '@/components/admin/AppointmentFormDialog';
import SessionNoteFormDialog from '@/components/admin/SessionNoteFormDialog';
import AssignmentFormDialog from '@/components/admin/AssignmentFormDialog';
import DocumentFormDialog from '@/components/admin/DocumentFormDialog';
import {
  ArrowLeft, Calendar, FileText, ClipboardList, MessageSquare, Heart,
  User, FolderOpen, Plus, Send, Lock, ExternalLink
} from 'lucide-react';

const tabs = [
  { id: 'profiel', label: 'Profile', icon: User },
  { id: 'afspraken', label: 'Appointments', icon: Calendar },
  { id: 'notities', label: 'Session notes', icon: FileText },
  { id: 'opdrachten', label: 'Assignments', icon: ClipboardList },
  { id: 'documenten', label: 'Documents', icon: FolderOpen },
  { id: 'berichten', label: 'Messages', icon: MessageSquare },
  { id: 'stemming', label: 'Mood', icon: Heart },
];

const aptTypeLabel = { intake: 'Intake', session: 'Session', online: 'Online', physical: 'In-person', phone: 'Phone' };

export default function ClientDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profiel');
  const [dialog, setDialog] = useState(null);
  const [profileForm, setProfileForm] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [messageText, setMessageText] = useState('');

  const fetchData = async () => {
    try {
      const response = await base44.functions.invoke('getAdminClientDetail', { client_user_id: id });
      setData(response.data);
      setProfileForm(response.data?.profile || {});
    } catch (err) {
      console.error('Failed to load client:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await base44.functions.invoke('adminSaveClient', {
        action: 'save',
        id: profileForm.id,
        user_id: id,
        ...profileForm
      });
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProfile(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      await base44.functions.invoke('adminSendMessage', {
        client_id: id,
        client_name: `${data?.profile?.first_name || ''} ${data?.profile?.last_name || ''}`.trim(),
        content: messageText
      });
      setMessageText('');
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const profile = data?.profile;
  const client = { user_id: id, first_name: profile?.first_name || data?.user?.full_name?.split(' ')[0] || '', last_name: profile?.last_name || '' };
  const set = (k, v) => setProfileForm(f => ({ ...f, [k]: v }));

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      {/* Header */}
      <Link to="/admin/clienten" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to clients
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">
              {profile?.first_name || data?.user?.full_name || 'Client'} {profile?.last_name || ''}
            </h1>
            <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full ${
              profile?.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
              profile?.status === 'archived' ? 'bg-neutral-100 text-neutral-400' :
              'bg-amber-50 text-amber-600'
            }`}>{profile?.status === 'active' ? 'Active' : profile?.status === 'archived' ? 'Archived' : 'Pending'}</span>
          </div>
          <p className="text-sm text-neutral-400">{data?.user?.email}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 mb-8 pb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-[11px] uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {/* Profile */}
      {activeTab === 'profiel' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-display text-lg text-neutral-800 mb-4">Personal details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-neutral-500">First name</Label><Input value={profileForm.first_name || ''} onChange={e => set('first_name', e.target.value)} className="mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Last name</Label><Input value={profileForm.last_name || ''} onChange={e => set('last_name', e.target.value)} className="mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Date of birth</Label><Input type="date" value={profileForm.date_of_birth || ''} onChange={e => set('date_of_birth', e.target.value)} className="mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Phone</Label><Input value={profileForm.phone || ''} onChange={e => set('phone', e.target.value)} className="mt-1" /></div>
              <div className="col-span-2"><Label className="text-xs uppercase tracking-widest text-neutral-500">Address</Label><Input value={profileForm.address || ''} onChange={e => set('address', e.target.value)} className="mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Postal code</Label><Input value={profileForm.postal_code || ''} onChange={e => set('postal_code', e.target.value)} className="mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-neutral-500">City</Label><Input value={profileForm.city || ''} onChange={e => set('city', e.target.value)} className="mt-1" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-display text-lg text-neutral-800 mb-4">Emergency contact</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Name</Label><Input value={profileForm.emergency_contact_name || ''} onChange={e => set('emergency_contact_name', e.target.value)} className="mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Phone</Label><Input value={profileForm.emergency_contact_phone || ''} onChange={e => set('emergency_contact_phone', e.target.value)} className="mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-neutral-500">Relation</Label><Input value={profileForm.emergency_contact_relation || ''} onChange={e => set('emergency_contact_relation', e.target.value)} className="mt-1" /></div>
            </div>
          </div>
          <div className="bg-red-50/40 rounded-xl border border-red-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-red-600" />
              <h2 className="font-display text-lg text-neutral-800">Private notes</h2>
            </div>
            <Textarea value={profileForm.admin_notes || ''} onChange={e => set('admin_notes', e.target.value)} rows={4} placeholder="Private notes about this client — not visible to the client" />
          </div>
          <Button onClick={saveProfile} disabled={savingProfile} className="bg-neutral-900 hover:bg-black">
            {savingProfile ? 'Saving...' : 'Save profile'}
          </Button>
        </div>
      )}

      {/* Appointments */}
      {activeTab === 'afspraken' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-lg text-neutral-800">Appointments ({data?.appointments?.length || 0})</h2>
            <button onClick={() => setDialog('appointment')} className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest">
              <Plus className="w-3.5 h-3.5" /> New appointment
            </button>
          </div>
          {(data?.appointments || []).length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-8 text-center">No appointments yet.</p>
          ) : (
            <div className="space-y-2">
              {data.appointments.map(a => (
                <div key={a.id} className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex flex-col items-center justify-center">
                      <span className="text-[9px] uppercase text-red-600 leading-none">{new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-sm font-display text-red-700 leading-none mt-0.5">{new Date(a.date).getDate()}</span>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-800 font-medium">{aptTypeLabel[a.type] || a.type} · {a.start_time}</p>
                      <p className="text-xs text-neutral-400">{a.duration_minutes} min{a.location ? ` · ${a.location}` : ''}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full ${
                    a.status === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                    a.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                    a.status === 'cancelled' ? 'bg-neutral-100 text-neutral-400' : ''
                  }`}>{a.status === 'scheduled' ? 'Scheduled' : a.status === 'completed' ? 'Completed' : a.status === 'cancelled' ? 'Cancelled' : a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Session notes */}
      {activeTab === 'notities' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-display text-lg text-neutral-800">Session notes ({data?.sessionNotes?.length || 0})</h2>
              <p className="text-xs text-red-600/70 uppercase tracking-widest mt-1 flex items-center gap-1"><Lock className="w-3 h-3" /> Private — not visible to client</p>
            </div>
            <button onClick={() => setDialog('note')} className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest">
              <Plus className="w-3.5 h-3.5" /> New note
            </button>
          </div>
          {(data?.sessionNotes || []).length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-8 text-center">No session notes yet.</p>
          ) : (
            <div className="space-y-3">
              {data.sessionNotes.map(n => (
                <div key={n.id} className="bg-white rounded-lg border border-neutral-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-neutral-800 font-medium">{new Date(n.session_date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  {n.summary && <p className="text-sm text-neutral-600 font-light mb-2">{n.summary}</p>}
                  {n.observations && <p className="text-xs text-neutral-500 mt-2"><span className="uppercase tracking-widest text-neutral-400">Observations: </span>{n.observations}</p>}
                  {n.risk_assessment && <p className="text-xs text-red-600 mt-2"><span className="uppercase tracking-widest">Risk: </span>{n.risk_assessment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assignments */}
      {activeTab === 'opdrachten' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-lg text-neutral-800">Assignments ({data?.assignments?.length || 0})</h2>
            <button onClick={() => setDialog('assignment')} className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest">
              <Plus className="w-3.5 h-3.5" /> New assignment
            </button>
          </div>
          {(data?.assignments || []).length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-8 text-center">No assignments yet.</p>
          ) : (
            <div className="space-y-2">
              {data.assignments.map(a => (
                <div key={a.id} className="bg-white rounded-lg border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-800 font-medium">{a.title}</p>
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full ${
                      a.status === 'assigned' ? 'bg-blue-50 text-blue-600' :
                      a.status === 'submitted' ? 'bg-amber-50 text-amber-600' :
                      a.status === 'reviewed' ? 'bg-emerald-50 text-emerald-600' : ''
                    }`}>{a.status === 'assigned' ? 'Assigned' : a.status === 'submitted' ? 'Submitted' : a.status === 'reviewed' ? 'Reviewed' : a.status}</span>
                    </div>
                    {a.description && <p className="text-xs text-neutral-500 mt-1">{a.description}</p>}
                    {a.due_date && <p className="text-xs text-neutral-400 mt-1">Due: {new Date(a.due_date).toLocaleDateString('en-US')}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Documents */}
      {activeTab === 'documenten' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-lg text-neutral-800">Documents ({data?.documents?.length || 0})</h2>
            <button onClick={() => setDialog('document')} className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest">
              <Plus className="w-3.5 h-3.5" /> Share document
            </button>
          </div>
          {(data?.documents || []).length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-8 text-center">No documents shared yet.</p>
          ) : (
            <div className="space-y-2">
              {data.documents.map(d => (
                <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-between hover:border-neutral-300 transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-800 font-medium">{d.title}</p>
                      <p className="text-xs text-neutral-400 capitalize">{d.category}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {activeTab === 'berichten' && (
        <div>
          <h2 className="font-display text-lg text-neutral-800 mb-4">Messages</h2>
          <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-4 max-h-[400px] overflow-y-auto space-y-3">
            {(data?.messages || []).length === 0 ? (
              <p className="text-sm text-neutral-400 font-light py-8 text-center">No messages yet.</p>
            ) : (
              data.messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${m.sender === 'admin' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                    <p className="text-sm font-light">{m.content}</p>
                    <p className={`text-[9px] mt-1 ${m.sender === 'admin' ? 'text-white/50' : 'text-neutral-400'}`}>{new Date(m.created_date).toLocaleString('en-US')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <Textarea value={messageText} onChange={e => setMessageText(e.target.value)} placeholder="Type a message..." rows={2} className="flex-1" onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
            <button onClick={sendMessage} disabled={!messageText.trim()} className="self-end px-4 py-3 bg-neutral-900 hover:bg-black text-white rounded-lg disabled:opacity-30 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mood */}
      {activeTab === 'stemming' && (
        <div>
          <h2 className="font-display text-lg text-neutral-800 mb-4">Mood ({data?.moodEntries?.length || 0})</h2>
          {(data?.moodEntries || []).length === 0 ? (
            <p className="text-sm text-neutral-400 font-light py-8 text-center">No mood entries recorded.</p>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-end justify-between gap-1 h-32 mb-4">
                {data.moodEntries.slice(-14).map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t bg-red-200" style={{ height: `${m.mood_score * 18}%` }} />
                    <span className="text-[8px] text-neutral-400">{new Date(m.entry_date).getDate()}/{new Date(m.entry_date).getMonth() + 1}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mt-4">
                {data.moodEntries.slice(0, 5).map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                    <span className="text-xs text-neutral-500">{new Date(m.entry_date).toLocaleDateString('en-US')}</span>
                    <span className="text-xs text-neutral-700">{'●'.repeat(m.mood_score)}{'○'.repeat(5 - m.mood_score)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      {dialog === 'appointment' && <AppointmentFormDialog open onClose={() => setDialog(null)} client={client} onSaved={fetchData} />}
      {dialog === 'note' && <SessionNoteFormDialog open onClose={() => setDialog(null)} client={client} onSaved={fetchData} />}
      {dialog === 'assignment' && <AssignmentFormDialog open onClose={() => setDialog(null)} client={client} onSaved={fetchData} />}
      {dialog === 'document' && <DocumentFormDialog open onClose={() => setDialog(null)} client={client} onSaved={fetchData} />}
    </div>
  );
}