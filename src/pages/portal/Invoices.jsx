import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Receipt } from 'lucide-react';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/ListStates';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-neutral-100 text-neutral-500' },
  sent: { label: 'Sent', color: 'bg-blue-50 text-blue-600' },
  paid: { label: 'Paid', color: 'bg-emerald-50 text-emerald-600' },
  overdue: { label: 'Overdue', color: 'bg-red-50 text-red-600' },
  cancelled: { label: 'Cancelled', color: 'bg-neutral-100 text-neutral-400' },
};

export default function PortalInvoices() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  useEffect(() => { fetchData(); }, []);

  const invoices = (data?.invoices || []).slice().sort((a, b) =>
    (b.due_date || b.created_date || '').localeCompare(a.due_date || a.created_date || '')
  );

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-600/80 block mb-2">Client Portal</span>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-800 tracking-tight">Invoices</h1>
        <p className="text-neutral-500 text-sm font-light mt-2">A record of your invoices and their status.</p>
      </div>

      {loading ? (
        <LoadingSkeleton lines={3} />
      ) : error ? (
        <ErrorState onRetry={fetchData} />
      ) : invoices.length === 0 ? (
        <EmptyState icon={Receipt} title="No invoices yet." />
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm text-neutral-800 font-medium">{inv.invoice_number || 'Invoice'}</p>
                {inv.description && <p className="text-xs text-neutral-500 mt-0.5 truncate">{inv.description}</p>}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-neutral-400">
                    {inv.due_date ? `Due ${new Date(inv.due_date).toLocaleDateString('en-US')}` : ''}
                  </span>
                  {inv.status === 'paid' && inv.paid_date && (
                    <span className="text-xs text-emerald-600">Paid {new Date(inv.paid_date).toLocaleDateString('en-US')}</span>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display text-lg text-neutral-800">${Number(inv.amount).toFixed(2)}</p>
                <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 inline-block ${statusConfig[inv.status]?.color || statusConfig.draft.color}`}>
                  {statusConfig[inv.status]?.label || inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}