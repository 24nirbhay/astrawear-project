import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import toast from 'react-hot-toast';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      if (!error && data) setTickets(data);
    };
    fetchTickets();
  }, []);

  const updateTicketStatus = async (id, status) => {
    const { error } = await supabase.from('tickets').update({ status }).eq('id', id);
    if (error) return toast.error('Failed to update status');
    toast.success(`Ticket marked as ${status}`);
    setTickets(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, status } : t);
      return updated;
    });
  };

  const filtered = tickets.filter(t => filter === 'All' || (t.status || 'Open') === filter);

  return (
    <div style={{
      background:'#1e293b',
      padding:'24px',
      borderRadius:'12px',
      boxShadow:'0 4px 12px rgba(0,0,0,0.4)'
    }}>
      <h2 style={{marginTop:0,marginBottom:'16px'}}>Support Tickets</h2>
      <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'16px'}}>
        <select
          value={filter}
          onChange={(e)=>setFilter(e.target.value)}
          style={{padding:'10px',borderRadius:'8px',background:'#334155',color:'#fff',border:'1px solid #475569'}}
        >
          {['All','Open','In Progress','Closed'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      {filtered.length === 0 && (
        <div style={{color:'#94a3b8',fontSize:'0.85rem'}}>No tickets found.</div>
      )}
      <ul style={{listStyle:'none',padding:0,margin:0,display:'grid',gap:'12px'}}>
        {filtered.map(t => (
          <li key={t.id} style={{background:'#334155',padding:'14px 16px',borderRadius:'10px',display:'flex',flexDirection:'column',gap:'8px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <strong style={{fontSize:'0.9rem'}}>{t.id}</strong>
              <span style={{fontSize:'0.7rem',background:'#475569',padding:'4px 8px',borderRadius:'6px'}}>{t.status || 'Open'}</span>
            </div>
            <div style={{fontSize:'0.8rem',color:'#cbd5e1'}}>
              <div><strong>Name:</strong> {t.name}</div>
              <div><strong>Phone:</strong> {t.phone}</div>
              {t.user_id && <div><strong>User ID:</strong> {t.user_id}</div>}
              <div style={{marginTop:'6px'}}><strong>Query:</strong> {t.query}</div>
              <div style={{marginTop:'4px',fontSize:'0.65rem',opacity:0.7}}>Created: {new Date(t.created_at).toLocaleString()}</div>
            </div>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              {['Open','In Progress','Closed'].map(st => (
                <button
                  key={st}
                  onClick={()=>updateTicketStatus(t.id, st)}
                  style={{
                    background: t.status === st ? '#3b82f6' : '#60a5fa',
                    border:'none',
                    padding:'8px 12px',
                    borderRadius:'6px',
                    color:'#fff',
                    cursor:'pointer',
                    fontSize:'0.7rem'
                  }}
                >{st}</button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketManagement;
