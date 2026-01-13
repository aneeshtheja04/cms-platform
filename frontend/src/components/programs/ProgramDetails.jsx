import { useState, useEffect } from 'react';
import { programsApi } from '../../api/programs.api';
import Loader from '../ui/Loader';
import ProgramForm from './ProgramForm';
import PostersManager from './PostersManager';
import ContentManager from './ContentManager';

export default function ProgramDetails({ programId }) {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProgram();
  }, [programId]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await programsApi.getById(programId);
      setProgram(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load program details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgram = async (formData) => {
    try {
      setUpdating(true);
      await programsApi.update(programId, formData);
      alert('Program updated successfully');
      fetchProgram();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update program');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader /></div>;
  if (error) return <div className="p-4 text-red-600 bg-red-50 rounded-md">{error}</div>;
  if (!program) return <div className="p-4 text-gray-600">Program not found</div>;

  const tabs = [
    { id: 'settings', label: 'Settings' },
    { id: 'posters', label: 'Posters' },
    { id: 'content', label: 'Content' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{program.title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${program.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
          {program.status}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'settings' && (
          <ProgramForm
            initialData={program}
            onSubmit={handleUpdateProgram}
            onCancel={() => { }} // No cancel needed in this view
            loading={updating}
          />
        )}

        {activeTab === 'posters' && (
          <PostersManager
            program={program}
            onUpdate={fetchProgram}
          />
        )}

        {activeTab === 'content' && (
          <ContentManager program={program} />
        )}
      </div>
    </div>
  );
}
