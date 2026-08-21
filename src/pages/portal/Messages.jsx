import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeSection from '@/components/FadeSection';
import PortalPageHeader from '@/components/portal/PortalPageHeader';
import { ErrorState } from '@/components/ListStates';
import { useBrand } from '@/hooks/useBrand';

export default function PortalMessages() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const threadRef = useRef(null);
  const { practitionerName } = useBrand();

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
    const unreadAdmin = (data?.messages || []).filter((m) => m.sender === 'admin' && !m.read);
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
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-10 lg:px-14 py-10 md:py-14 max-w-[60rem]">
        <PortalPageHeader label="Client Portal" title="Messages" />
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  const messages = (data?.messages || []).sort((a, b) => a.created_date.localeCompare(b.created_date));

  return (
    <div className="px-6 md:px-10 lg:px-14 py-10 md:py-14 max-w-[60rem]">
      <PortalPageHeader label="Client Portal" title="Messages" sub={`Message ${practitionerName} securely.`} />

      <FadeSection>
        <div
          className="bg-white/60 border border-neutral-200/70 rounded-[1.5rem] flex flex-col"
          style={{ height: 'calc(100vh - 280px)', minHeight: '420px' }}
        >
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-3" strokeWidth={1} />
                <p className="font-display text-lg text-neutral-700">No messages yet</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-2">Send a message to start the conversation</p>
              </div>
            </div>
          ) : (
            <div ref={threadRef} className="flex-1 overflow-y-auto p-5 md:p-7 space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                        m.sender === 'client' ? 'bg-red-600 text-red-50 rounded-br-sm' : 'bg-neutral-100 text-neutral-800 rounded-bl-sm'
                      }`}
                    >
                      {m.sender === 'admin' && (
                        <p className="font-mono text-[9px] uppercase tracking-widest text-red-600/70 mb-1">{practitionerName}</p>
                      )}
                      <p className="text-sm font-light whitespace-pre-wrap leading-relaxed">{m.content}</p>
                      <p className="font-mono text-[9px] mt-1.5 text-neutral-400">
                        {new Date(m.created_date).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="p-4 border-t border-neutral-100 flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type a message..."
              className="flex-1 border border-neutral-200 rounded-full px-5 py-3 text-sm font-light focus:outline-none focus:border-neutral-400 bg-white"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !messageText.trim()}
              className="w-12 h-12 flex items-center justify-center bg-red-600 hover:bg-red-700 text-red-50 rounded-full disabled:opacity-30 transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </FadeSection>
    </div>
  );
}