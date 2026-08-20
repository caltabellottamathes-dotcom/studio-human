import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, MessageSquare } from 'lucide-react';
import { ErrorState } from '@/components/ListStates';

export default function AdminMessages() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await base44.functions.invoke('adminGetContent', {});
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const conversations = React.useMemo(() => {
    const map = {};
    (data?.messages || []).forEach(m => {
      if (!map[m.client_id]) {
        map[m.client_id] = { client_id: m.client_id, client_name: m.client_display_name || m.client_name || 'Unknown', messages: [], unread: 0 };
      }
      map[m.client_id].messages.push(m);
      if (m.sender === 'client' && !m.read) map[m.client_id].unread++;
    });
    return Object.values(map).sort((a, b) => {
      const aLast = a.messages[a.messages.length - 1]?.created_date || '';
      const bLast = b.messages[b.messages.length - 1]?.created_date || '';
      return bLast.localeCompare(aLast);
    });
  }, [data]);

  const activeConv = conversations.find(c => c.client_id === selectedClient);

  // Mark the selected client's messages as read when the thread is opened
  useEffect(() => {
    if (!selectedClient) return;
    const hasUnread = (activeConv?.messages || []).some(m => m.sender === 'client' && !m.read);
    if (!hasUnread) return;
    base44.entities.Message.updateMany(
      { client_id: selectedClient, sender: 'client', read: false },
      { $set: { read: true } }
    ).then(() => fetchData()).catch(() => {});
  }, [selectedClient]);

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedClient) return;
    setSending(true);
    try {
      await base44.functions.invoke('adminSendMessage', {
        client_id: selectedClient,
        client_name: activeConv?.client_name || '',
        content: messageText
      });
      setMessageText('');
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10 max-w-6xl">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Manage</span>
          <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Messages</h1>
        </div>
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Manage</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Messages</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        {/* Conversation list */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-3 border-b border-neutral-100">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400">Conversations ({conversations.length})</p>
          </div>
          <div className="overflow-y-auto h-full max-h-[550px]">
            {conversations.length === 0 ? (
              <p className="text-sm text-neutral-400 font-light p-6 text-center">No messages yet.</p>
            ) : (
              <div className="divide-y divide-neutral-100">
                {conversations.map(c => (
                  <button key={c.client_id} onClick={() => setSelectedClient(c.client_id)} className={`w-full text-left p-4 hover:bg-neutral-50 transition-colors ${selectedClient === c.client_id ? 'bg-red-50/50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-800 font-medium truncate">{c.client_name}</p>
                      {c.unread > 0 && <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">{c.unread}</span>}
                    </div>
                    <p className="text-xs text-neutral-400 truncate mt-1">{c.messages[c.messages.length - 1]?.content}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message thread */}
        <div className="md:col-span-2 bg-white rounded-xl border border-neutral-200 flex flex-col">
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-3" strokeWidth={1} />
                <p className="text-sm text-neutral-400 font-light">Select a conversation</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-neutral-100">
                <p className="text-sm text-neutral-800 font-medium">{activeConv.client_name}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[450px]">
                {activeConv.messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-lg ${m.sender === 'admin' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                      <p className="text-sm font-light">{m.content}</p>
                      <p className={`text-[9px] mt-1 ${m.sender === 'admin' ? 'text-white/50' : 'text-neutral-400'}`}>{new Date(m.created_date).toLocaleString('en-US')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-neutral-100 flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                  placeholder="Type a message..."
                  className="flex-1 border border-neutral-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neutral-300"
                />
                <button onClick={sendMessage} disabled={sending || !messageText.trim()} className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-lg disabled:opacity-30 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}