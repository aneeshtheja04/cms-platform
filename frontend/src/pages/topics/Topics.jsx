import { useState, useEffect } from 'react';
import { topicsApi } from '../../api/topics.api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import TopicForm from '../../components/topics/TopicForm';
import { useAuth } from '../../context/AuthContext';

export default function Topics() {
    const { hasRole } = useAuth();
    const canEdit = hasRole(['admin', 'editor']);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            setLoading(true);
            const data = await topicsApi.getAll();
            setTopics(data);
        } catch (err) {
            setError('Failed to load topics');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingTopic(null);
        setIsModalOpen(true);
    };

    const handleEdit = (topic) => {
        setEditingTopic(topic);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this topic?')) return;

        try {
            await topicsApi.delete(id);
            setTopics(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert('Failed to delete topic');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            if (editingTopic) {
                await topicsApi.update(editingTopic.id, formData);
                setTopics(prev => prev.map(t => t.id === editingTopic.id ? { ...t, ...formData } : t));
            } else {
                const newTopic = await topicsApi.create(formData);
                setTopics(prev => [...prev, newTopic]);
            }
            setIsModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save topic');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader /></div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Topics</h1>
                {canEdit && (
                    <Button onClick={handleCreate}>+ Add Topic</Button>
                )}
            </div>

            <Card>
                {topics.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No topics found. Create one to get started.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-sm text-gray-500">
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Created At</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topics.map((topic) => (
                                    <tr key={topic.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">{topic.name}</td>
                                        <td className="py-3 px-4 text-gray-500 text-sm">
                                            {new Date(topic.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-2">
                                            {canEdit && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(topic)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Rename
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(topic.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTopic ? 'Edit Topic' : 'New Topic'}
                size="sm"
            >
                <TopicForm
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    loading={saving}
                    initialData={editingTopic}
                />
            </Modal>
        </div>
    );
}
