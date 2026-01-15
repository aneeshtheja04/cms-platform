import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { programsApi } from '../../api/programs.api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import Drawer from '../../components/ui/Drawer';
import ProgramForm from '../../components/programs/ProgramForm';
import ProgramDetails from '../../components/programs/ProgramDetails';
import { topicsApi } from '../../api/topics.api';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

export default function Programs() {
  const { hasRole } = useAuth();
  const canEdit = hasRole(['admin', 'editor']);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    language: '',
    topic_id: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
    fetchPrograms();
  }, []);

  const fetchTopics = async () => {
    try {
      const data = await topicsApi.getAll();
      setTopics(data);
    } catch (err) {
      console.error('Failed to fetch topics', err);
    }
  };

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const data = await programsApi.getAll(filters);
      setPrograms(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgram = async (formData) => {
    try {
      setCreating(true);
      await programsApi.create(formData);
      setIsModalOpen(false);
      fetchPrograms(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create program');
    } finally {
      setCreating(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchPrograms();
  };

  const clearFilters = () => {
    setFilters({ status: '', language: '', topic_id: '' });
    // We need to trigger fetch with empty filters immediately or use useEffect on filters
    // For now manually triggering with empty object
    programsApi.getAll({}).then(setPrograms);
  };

  const findPrimaryPoster = (program) => {
    if (!program.assets) return null;
    return program.assets.find(
      (asset) =>
        asset.language === program.language_primary &&
        asset.variant === 'portrait' &&
        asset.asset_type === 'poster'
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-gray-100 text-gray-700',
      archived: 'bg-red-100 text-red-700',
    };

    // Capitalize first letter
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.draft}`}>
        {capitalizedStatus}
      </span>
    );
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
        {canEdit && (
          <Button onClick={() => setIsModalOpen(true)}>+ Add Program</Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              name="language"
              value={filters.language}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <select
              name="topic_id"
              value={filters.topic_id}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            >
              <option value="">All Topics</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={applyFilters} className="w-full">
              Filter
            </Button>
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {programs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No programs found</p>
            {canEdit && (
              <Button onClick={() => setIsModalOpen(true)}>Create Your First Program</Button>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Poster</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Program Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Language</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {findPrimaryPoster(program) ? (
                        <img
                          src={findPrimaryPoster(program).url}
                          alt={program.title}
                          className="w-12 h-16 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs text-center border border-gray-200">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{program.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">{program.description}</p>
                      {program.topics && program.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {program.topics.map((t) => (
                            <span key={t.id} className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                              {t.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {program.languages_available.join(', ').toUpperCase()}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(program.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedProgramId(program.id);
                            setIsDrawerOpen(true);
                          }}
                          className="text-xs px-2 py-1"
                        >
                          {canEdit ? 'Manage' : 'View'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Program Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Program"
        size="md"
      >
        <ProgramForm
          onSubmit={handleCreateProgram}
          onCancel={() => setIsModalOpen(false)}
          loading={creating}
        />
      </Modal>

      {/* View Program Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedProgramId(null);
        }}
        title="Program Details"
        widthPercent={70}
      >
        {selectedProgramId && (
          <ProgramDetails programId={selectedProgramId} />
        )}
      </Drawer>
    </div>
  );
}
