import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

function RequestRow({ req, onApprove, onReject, updating }) {
  return (
    <div className="border border-border rounded-xl p-5 bg-white flex items-center gap-4">
      <div className="flex-1">
        <div className="text-[13px] font-bold text-navy mb-[2px]">{req.projects?.title ?? 'Unknown project'}</div>
        <div className="text-[11px] text-text3">User: {req.user_id}</div>
        <div className="text-[11px] text-text3">
          Requested: {new Date(req.requested_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
      <span className={`text-[11px] font-bold uppercase tracking-[0.08em] px-2 py-[3px] rounded ${STATUS_COLORS[req.status]}`}>
        {req.status}
      </span>
      <div className="flex gap-2">
        {req.status !== 'approved' && (
          <button onClick={onApprove} disabled={updating}
            className="text-[12px] font-semibold bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
            Approve
          </button>
        )}
        {req.status !== 'rejected' && (
          <button onClick={onReject} disabled={updating}
            className="text-[12px] font-semibold border border-red-300 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors">
            Reject
          </button>
        )}
      </div>
    </div>
  )
}

export default function AccessRequestsAdmin() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    const { data } = await supabase
      .from('access_requests')
      .select(`
        id, status, requested_at, reviewed_at,
        project_id, user_id,
        projects ( title )
      `)
      .order('requested_at', { ascending: false })

    setRequests(data ?? [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    setUpdating(id)
    await supabase
      .from('access_requests')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', id)
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status, reviewed_at: new Date().toISOString() } : r)
    )
    setUpdating(null)
  }

  if (loading) return <div className="p-8 text-text3">Loading…</div>

  const pending = requests.filter(r => r.status === 'pending')
  const others = requests.filter(r => r.status !== 'pending')

  return (
    <div className="p-8 max-w-[760px]">
      <h2 className="text-[18px] font-extrabold text-navy mb-6">Access Requests</h2>

      {requests.length === 0 && (
        <p className="text-[14px] text-text3">No access requests yet.</p>
      )}

      {pending.length > 0 && (
        <>
          <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-text3 mb-3">Pending ({pending.length})</h3>
          <div className="flex flex-col gap-3 mb-8">
            {pending.map(req => (
              <RequestRow key={req.id} req={req}
                onApprove={() => updateStatus(req.id, 'approved')}
                onReject={() => updateStatus(req.id, 'rejected')}
                updating={updating === req.id} />
            ))}
          </div>
        </>
      )}

      {others.length > 0 && (
        <>
          <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-text3 mb-3">Reviewed</h3>
          <div className="flex flex-col gap-3">
            {others.map(req => (
              <RequestRow key={req.id} req={req}
                onApprove={() => updateStatus(req.id, 'approved')}
                onReject={() => updateStatus(req.id, 'rejected')}
                updating={updating === req.id} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
