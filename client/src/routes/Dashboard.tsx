import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type Note = { _id: string; title: string; body?: string };

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/signin', { replace: true }); return; }
    axios.get(`${API}/api/notes`, { headers: { Authorization: `Bearer ${token}` }})
    .then(res => setNotes(res.data.notes))
    .catch(()=> setError('Auth required'));
  }, []);

  const addNote = async () => {
    setError('');
    try {
      const { data } = await axios.post(`${API}/api/notes`, { title }, { headers: { Authorization: `Bearer ${token}` }});
      setNotes([data.note, ...notes]);
      setTitle('');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create note');
    }
  };

  const del = async (id: string) => {
    setError('');
    try {
      await axios.delete(`${API}/api/notes/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      setNotes(notes.filter(n => n._id !== id));
    } catch (e: any) {
      setError('Failed to delete');
    }
  };

  const logout = () => { localStorage.removeItem('token'); navigate('/signin', { replace: true }); };

  return (
    <div className="min-h-screen flex justify-center items-start bg-white px-4 py-6">
      <div className="w-full sm:w-1/2 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 md:w-4 md:h-4 bg-blue-400 rounded-full animate-spin border-blue-500 border-t-transparent rounded-full"></div>
            <h1 className="font-semibold">Dashboard</h1>
          </div>
          <button onClick={logout} className="text-blue-600 text-sm hover:underline">Sign Out</button>
        </div>

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

        <div className="bg-gray-50 p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold">Welcome!</h2>
          <p className="text-gray-500 text-sm">Create your notes below.</p>
        </div>

        <div className="flex gap-2 mb-4">
          <input className="flex-1 border rounded px-3 py-2" placeholder="Note title" value={title} onChange={e=>setTitle(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 rounded" onClick={addNote}>Add</button>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
          <div className="space-y-2">
            {notes.map(n => (
              <div key={n._id} className="flex justify-between items-center bg-gray-100 p-3 rounded shadow">
                <span>{n.title}</span>
                <button onClick={()=>del(n._id)} className="text-red-500 hover:text-red-700" title="Delete">🗑️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}