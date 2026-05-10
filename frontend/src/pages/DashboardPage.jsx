import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AiPanel from '../components/AiPanel';
import { getTrainings, createTraining, updateTraining, deleteTraining } from '../services/api';

const DashboardPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'PENDING' });
  const [activeTab, setActiveTab] = useState('trainings');

  // Load trainings on mount
  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const res = await getTrainings();
      setTrainings(res.data);
    } catch (err) {
      console.error('Failed to fetch trainings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    try {
      if (editingId) {
        await updateTraining(editingId, formData);
      } else {
        await createTraining(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', status: 'PENDING' });
      fetchTrainings();
    } catch (err) {
      console.error('Failed to save training:', err);
    }
  };

  const handleEdit = (training) => {
    setFormData({ title: training.title, description: training.description || '', status: training.status });
    setEditingId(training.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this training?')) return;
    try {
      await deleteTraining(id);
      fetchTrainings();
    } catch (err) {
      console.error('Failed to delete training:', err);
    }
  };

  const statusColors = {
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    COMPLETED: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fadeIn">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Trainings</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{trainings.length}</p>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{trainings.filter(t => t.status === 'ACTIVE').length}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{trainings.filter(t => t.status === 'PENDING').length}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm mb-6 w-fit">
          <button
            onClick={() => setActiveTab('trainings')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'trainings'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📋 Trainings
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'ai'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🤖 AI Panel
          </button>
        </div>

        {/* Training Management Tab */}
        {activeTab === 'trainings' && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Compliance Trainings</h2>
              <button
                id="create-training-button"
                onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: '', description: '', status: 'PENDING' }); }}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-lg hover:from-primary-400 hover:to-primary-500 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Training</span>
              </button>
            </div>

            {/* Create/Edit Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slideUp">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    {editingId ? 'Edit Training' : 'Create Training'}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                      <input
                        id="training-title-input"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="Training title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                      <textarea
                        id="training-desc-input"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="Training description (or use AI to generate)"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
                      <select
                        id="training-status-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-lg hover:from-primary-400 hover:to-primary-500 transition-all"
                      >
                        {editingId ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowForm(false); setEditingId(null); }}
                        className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Training Cards */}
            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading trainings...</div>
            ) : trainings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-slate-500">No trainings yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {trainings.map((training) => (
                  <div
                    key={training.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all animate-fadeIn"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-800">{training.title}</h3>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusColors[training.status] || statusColors.PENDING}`}>
                            {training.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          {training.description || 'No description available'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(training)}
                          className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(training.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Panel Tab */}
        {activeTab === 'ai' && (
          <div className="animate-fadeIn">
            <AiPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
