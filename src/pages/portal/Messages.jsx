import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, MessageSquare } from 'lucide-react';
import { ErrorState } from '@/components/ListStates';

export default function PortalMessages() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const threadRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await base44.functions.invoke('getClientPortalData', {});
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Realtime subscription for new messages
    const unsubscribe = base44.entities.Message.subscribe(() => fetchData());
    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, []);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [data?.messages]);

  // Mark admin messages as read when the thread is viewed
  useEffect(() => {
    const unreadAdmin = (data?.messages || []).filter(m => m.sender === 'admin' && !m.read);
    if (unreadAdmin.length > 0) {
      base44.entities.Message.updateMany(
        { client_id: data.user.id, sender: 'admin', read: false },
        { $set: { read: true } }
      ).then(() => fetchData()).catch(() => {});
    }
  }, [data?.messages]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    setSending(true);
    try {
      await base44.functions.invoke('adminSendMessage', { content: messageText });
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
      <div className="p-6 md:p-10 max-w-3xl">
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Client Portal</span>
          <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Messages</h1>
        </div>
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  const messages = (data?.messages || []).sort((a, b) => a.created_date.localeCompare(b.created_date));

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Client Portal</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Messages</h1>
        <p className="text-neutral-500 text-sm font-light mt-2">Message Maya securely.</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-3" strokeWidth={1} />
              <p className="text-sm text-neutral-400 font-light">No messages yet.</p>
              <p className="text-xs text-neutral-400 mt-1">Send a message to start.</p>
            </div>
          </div>
        ) : (
          <div ref={threadRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-3 rounded-2xl ${m.sender === 'client' ? 'bg-neutral-900 text-white rounded-br-sm' : 'bg-neutral-100 text-neutral-800 rounded-bl-sm'}`}>
                  <p className="text-sm font-light whitespace-pre-wrap">{m.content}</p>
                  <p className={`text-[9px] mt-1 ${m.sender === 'client' ? 'text-white/50' : 'text-neutral-400'}`}>
                    {new Date(m.created_date).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="p-4 border-t border-neutral-100 flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type a message..."
            className="flex-1 border border-neutral-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-neutral-300"
          />
          <button onClick={sendMessage} disabled={sending || !messageText.trim()} className="w-10 h-10 flex items-center justify-center bg-neutral-900 hover:bg-black text-white rounded-full disabled:opacity-30 transition-colors flex-shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}