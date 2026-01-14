import { useState, useEffect } from 'react';
import { termsApi } from '../../api/terms.api';
import { lessonsApi } from '../../api/lessons.api';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import LessonForm from './LessonForm';
import LessonAssetsManager from './LessonAssetsManager';

export default function ContentManager({ program }) {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creatingTerm, setCreatingTerm] = useState(false);
    const [isTermModalOpen, setIsTermModalOpen] = useState(false);
    const [newTermTitle, setNewTermTitle] = useState('');

    // Lesson state
    const [expandedTerms, setExpandedTerms] = useState({}); // { termId: boolean }
    const [termLessons, setTermLessons] = useState({}); // { termId: [lessons] }
    const [lessonsLoading, setLessonsLoading] = useState({}); // { termId: boolean }

    // Lesson Modal State
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedTermId, setSelectedTermId] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);
    const [savingLesson, setSavingLesson] = useState(false);
    const [lessonModalTab, setLessonModalTab] = useState('settings'); // settings, thumbnails

    // Edit Term State
    const [editingTerm, setEditingTerm] = useState(null);
    const [termFormData, setTermFormData] = useState({ title: '' });

    // Schedule Modal State
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [schedulingLessonId, setSchedulingLessonId] = useState(null);
    const [schedulingTermId, setSchedulingTermId] = useState(null);
    const [scheduleDateTime, setScheduleDateTime] = useState('');
    const [scheduling, setScheduling] = useState(false);

    useEffect(() => {
        if (program?.id) {
            fetchTerms();
        }
    }, [program]);

    const fetchTerms = async () => {
        try {
            setLoading(true);
            const data = await termsApi.getAll({ program_id: program.id });
            // Sort by term_number
            const sorted = data.sort((a, b) => a.term_number - b.term_number);
            setTerms(sorted);
        } catch (err) {
            console.error('Failed to fetch terms', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLessons = async (termId, force = false) => {
        if (!force && termLessons[termId]) return; // Already fetched, skip unless forced

        try {
            setLessonsLoading((prev) => ({ ...prev, [termId]: true }));
            const data = await lessonsApi.getAll({ term_id: termId });
            // Sort by lesson_number
            const sorted = data.sort((a, b) => a.lesson_number - b.lesson_number);
            setTermLessons((prev) => ({ ...prev, [termId]: sorted }));
        } catch (err) {
            console.error(`Failed to fetch lessons for term ${termId}`, err);
        } finally {
            setLessonsLoading((prev) => ({ ...prev, [termId]: false }));
        }
    };

    const toggleTerm = (termId) => {
        setExpandedTerms((prev) => {
            const isExpanded = !prev[termId];
            if (isExpanded) {
                fetchLessons(termId);
            }
            return { ...prev, [termId]: isExpanded };
        });
    };

    const handleCreateTerm = async (e) => {
        e.preventDefault();
        if (!newTermTitle.trim()) return;

        try {
            setCreatingTerm(true);
            // Determine next term number
            const nextNum = terms.length > 0 ? Math.max(...terms.map(t => t.term_number)) + 1 : 1;

            await termsApi.create({
                program_id: program.id,
                term_number: nextNum,
                title: newTermTitle
            });

            setNewTermTitle('');
            setIsTermModalOpen(false);
            fetchTerms();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create term');
        } finally {
            setCreatingTerm(false);
        }
    };

    const handleEditTerm = (term) => {
        setEditingTerm(term);
        setTermFormData({ title: term.title || '' });
    };

    const handleUpdateTerm = async (e) => {
        e.preventDefault();

        try {
            setCreatingTerm(true);
            await termsApi.update(editingTerm.id, termFormData);
            setEditingTerm(null);
            setTermFormData({ title: '' });
            fetchTerms(); // Refresh term list
            alert('Term updated successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update term');
        } finally {
            setCreatingTerm(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            case 'scheduled': return 'bg-yellow-100 text-yellow-700';
            case 'archived': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const openAddLesson = (termId) => {
        setSelectedTermId(termId);
        setEditingLesson(null);
        setIsLessonModalOpen(true);
        setLessonModalTab('settings');
    };

    const openEditLesson = async (lesson) => {
        try {
            // Fetch full details including URLs and assets
            const fullLesson = await lessonsApi.getById(lesson.id);
            setSelectedTermId(lesson.term_id);
            setEditingLesson(fullLesson);
            setIsLessonModalOpen(true);
        } catch (err) {
            alert('Failed to load lesson details');
        }
    };

    const handleLessonSubmit = async (formData) => {
        try {
            setSavingLesson(true);
            if (editingLesson) {
                await lessonsApi.update(editingLesson.id, formData);
            } else {
                // Extract scheduling info if present
                const { scheduleDateTime, ...lessonData } = formData;

                // Create the lesson
                const createdLesson = await lessonsApi.create({
                    ...lessonData,
                    term_id: selectedTermId
                });

                // If scheduling was requested, schedule it
                if (scheduleDateTime) {
                    const publishAt = new Date(scheduleDateTime).toISOString();
                    await lessonsApi.schedule(createdLesson.id, { publish_at: publishAt });
                }
            }
            setIsLessonModalOpen(false);

            // Clear lesson cache for this term
            setTermLessons(prev => {
                const updated = { ...prev };
                delete updated[selectedTermId];
                return updated;
            });

            // Refresh term counts
            await fetchTerms();

            // Refetch lessons if term is expanded
            if (expandedTerms[selectedTermId]) {
                await fetchLessons(selectedTermId, true);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save lesson');
        } finally {
            setSavingLesson(false);
        }
    };

    const handleLessonAction = async (lessonId, action, termId) => {
        if (!confirm(`Are you sure you want to ${action} this lesson?`)) return;
        try {
            setLessonsLoading(prev => ({ ...prev, [termId]: true }));
            if (action === 'publish') await lessonsApi.publish(lessonId);
            if (action === 'archive') await lessonsApi.archive(lessonId);

            // Clear lesson cache for this term
            setTermLessons(prev => {
                const updated = { ...prev };
                delete updated[termId];
                return updated;
            });

            // Refresh term counts
            await fetchTerms();

            // Refetch lessons with force
            await fetchLessons(termId, true);
        } catch (err) {
            alert(`Failed to ${action} lesson`);
        } finally {
            setLessonsLoading(prev => ({ ...prev, [termId]: false }));
        }
    };

    const openScheduleModal = (lessonId, termId) => {
        setSchedulingLessonId(lessonId);
        setSchedulingTermId(termId);
        // Set default to 10 minutes from now
        const now = new Date();
        now.setMinutes(now.getMinutes() + 10);
        const localDateTime = now.toISOString().slice(0, 16);
        setScheduleDateTime(localDateTime);
        setIsScheduleModalOpen(true);
    };

    const handleScheduleLesson = async (e) => {
        e.preventDefault();
        if (!scheduleDateTime) {
            alert('Please select a date and time');
            return;
        }

        try {
            setScheduling(true);
            const publishAt = new Date(scheduleDateTime).toISOString();
            await lessonsApi.schedule(schedulingLessonId, { publish_at: publishAt });
            alert('Lesson scheduled successfully!');
            setIsScheduleModalOpen(false);

            // Clear lesson cache for this term
            setTermLessons(prev => {
                const updated = { ...prev };
                delete updated[schedulingTermId];
                return updated;
            });

            // Refresh term counts
            await fetchTerms();

            // Refetch lessons with force
            await fetchLessons(schedulingTermId, true);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to schedule lesson');
        } finally {
            setScheduling(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Program Content</h3>
                <Button onClick={() => setIsTermModalOpen(true)}>+ Add Term</Button>
            </div>

            <div className="space-y-4">
                {terms.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 mb-2">No terms yet</p>
                        <Button variant="outline" onClick={() => setIsTermModalOpen(true)}>Create First Term</Button>
                    </div>
                ) : (
                    terms.map((term) => (
                        <div key={term.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div
                                className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                                onClick={() => toggleTerm(term.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`transform transition-transform ${expandedTerms[term.id] ? 'rotate-90' : ''}`}>
                                        ▶
                                    </span>
                                    <span className="font-medium text-gray-900">Term {term.term_number}: {term.title}</span>
                                    <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                        {term.lesson_count || 0} lessons
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        className="text-xs py-1 h-auto"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditTerm(term);
                                        }}
                                    >
                                        Edit Term
                                    </Button>
                                </div>
                            </div>

                            {expandedTerms[term.id] && (
                                <div className="p-4 bg-white border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-medium text-gray-700">Lessons</h4>
                                        <Button
                                            variant="outline"
                                            className="text-xs py-1 h-auto"
                                            onClick={() => openAddLesson(term.id)}
                                        >
                                            + Add Lesson
                                        </Button>
                                    </div>

                                    {lessonsLoading[term.id] ? (
                                        <div className="py-4 flex justify-center"><Loader size="sm" /></div>
                                    ) : termLessons[term.id]?.length > 0 ? (
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100 text-left text-gray-500">
                                                    <th className="py-2 pl-2">#</th>
                                                    <th className="py-2">Title</th>
                                                    <th className="py-2">Type</th>
                                                    <th className="py-2">Status</th>
                                                    <th className="py-2 pr-2 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {termLessons[term.id].map((lesson) => (
                                                    <tr key={lesson.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                        <td className="py-2 pl-2 text-gray-500">{lesson.lesson_number}</td>
                                                        <td className="py-2 font-medium text-gray-900">{lesson.title}</td>
                                                        <td className="py-2 capitalize text-gray-600">{lesson.content_type}</td>
                                                        <td className="py-2">
                                                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(lesson.status)}`}>
                                                                {lesson.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 pr-2 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => openEditLesson(lesson)}
                                                                    className="text-blue-600 hover:text-blue-800 text-xs"
                                                                >
                                                                    Edit
                                                                </button>
                                                                {(lesson.status === 'draft' || lesson.status === 'scheduled') && (
                                                                    <button
                                                                        onClick={() => handleLessonAction(lesson.id, 'publish', term.id)}
                                                                        className="text-green-600 hover:text-green-800 text-xs"
                                                                    >
                                                                        Publish
                                                                    </button>
                                                                )}
                                                                {(lesson.status === 'draft' || lesson.status === 'scheduled') && (
                                                                    <button
                                                                        onClick={() => openScheduleModal(lesson.id, term.id)}
                                                                        className="text-yellow-600 hover:text-yellow-800 text-xs"
                                                                    >
                                                                        Schedule
                                                                    </button>
                                                                )}
                                                                {lesson.status !== 'archived' && (
                                                                    <button
                                                                        onClick={() => handleLessonAction(lesson.id, 'archive', term.id)}
                                                                        className="text-red-600 hover:text-red-800 text-xs"
                                                                    >
                                                                        Archive
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic py-2">No lessons in this term</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isTermModalOpen}
                onClose={() => setIsTermModalOpen(false)}
                title="Create New Term"
                size="sm"
            >
                <form onSubmit={handleCreateTerm} className="space-y-4">
                    <Input
                        label="Term Title"
                        value={newTermTitle}
                        onChange={(e) => setNewTermTitle(e.target.value)}
                        placeholder="e.g., Fundamentals"
                        required
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsTermModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={creatingTerm}>
                            {creatingTerm ? 'Creating...' : 'Create Term'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isLessonModalOpen}
                onClose={() => setIsLessonModalOpen(false)}
                title={editingLesson ? "Edit Lesson" : "Create New Lesson"}
                size="lg"
            >
                {/* Tabs for Lesson Modal */}
                {editingLesson && (
                    <div className="border-b border-gray-200 mb-4">
                        <nav className="-mb-px flex space-x-6">
                            <button
                                onClick={() => setLessonModalTab('settings')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${lessonModalTab === 'settings'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Settings
                            </button>
                            <button
                                onClick={() => setLessonModalTab('thumbnails')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${lessonModalTab === 'thumbnails'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Thumbnails
                            </button>
                        </nav>
                    </div>
                )}

                {lessonModalTab === 'settings' && (
                    <LessonForm
                        onSubmit={handleLessonSubmit}
                        onCancel={() => setIsLessonModalOpen(false)}
                        loading={savingLesson}
                        initialData={editingLesson}
                        programLanguages={program?.languages_available || ['en']}
                        primaryLanguage={program?.language_primary || 'en'}
                    />
                )}

                {lessonModalTab === 'thumbnails' && editingLesson && (
                    <LessonAssetsManager
                        lesson={editingLesson}
                        onUpdate={() => {
                            // Refresh lesson data to show new assets immediately if we were to re-render
                            // Actually we might need to re-fetch the specific lesson or just rely on the parent list update?
                            // Let's refetch the specific lesson logic if we want to be super correct, 
                            // but for now verifying assets exist might require closing/reopening or updating local state.
                            // A simple way is to re-call the API to get fresh lesson data for this modal.
                            lessonsApi.getById(editingLesson.id).then(data => setEditingLesson(data));
                        }}
                    />
                )}
            </Modal>

            <Modal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                title="Schedule Lesson"
                size="sm"
            >
                <form onSubmit={handleScheduleLesson} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Publish Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            value={scheduleDateTime}
                            onChange={(e) => setScheduleDateTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            The lesson will be automatically published at this time
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsScheduleModalOpen(false)}
                            disabled={scheduling}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={scheduling}>
                            {scheduling ? 'Scheduling...' : 'Schedule Lesson'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Term Modal */}
            {editingTerm && (
                <Modal
                    isOpen={!!editingTerm}
                    onClose={() => {
                        setEditingTerm(null);
                        setTermFormData({ title: '' });
                    }}
                    title="Edit Term"
                    size="sm"
                >
                    <form onSubmit={handleUpdateTerm} className="space-y-4">
                        <Input
                            label="Term Title (Optional)"
                            value={termFormData.title}
                            onChange={(e) => setTermFormData({ ...termFormData, title: e.target.value })}
                            placeholder="e.g., Advanced Concepts"
                        />
                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setEditingTerm(null);
                                    setTermFormData({ title: '' });
                                }}
                                disabled={creatingTerm}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={creatingTerm}>
                                {creatingTerm ? 'Updating...' : 'Update Term'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
