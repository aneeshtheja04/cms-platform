import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function LessonForm({ onSubmit, onCancel, loading, initialData = null, programLanguages = ['en'], primaryLanguage = 'en' }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        lesson_number: initialData?.lesson_number || 1,
        content_type: initialData?.content_type || 'video',
        duration_ms: initialData?.duration_ms || 0,
        is_paid: initialData?.is_paid || false,
        content_language_primary: initialData?.content_language_primary || primaryLanguage,
        content_languages_available: initialData?.content_languages_available || [primaryLanguage],
        subtitle_languages: initialData?.subtitle_languages || [],
        // Simple URL map handling for MVP
        content_urls: initialData?.content_urls_by_language || {},
        subtitle_urls: initialData?.subtitle_urls_by_language || {},
    });

    const [activeLang, setActiveLang] = useState(primaryLanguage);

    // Scheduling state
    const [scheduleForLater, setScheduleForLater] = useState(false);
    const [scheduleDateTime, setScheduleDateTime] = useState(() => {
        // Default: 10 minutes from now
        const now = new Date();
        now.setMinutes(now.getMinutes() + 10);
        return now.toISOString().slice(0, 16);
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUrlChange = (lang, url, type = 'content') => {
        setFormData(prev => ({
            ...prev,
            [type === 'content' ? 'content_urls' : 'subtitle_urls']: {
                ...prev[type === 'content' ? 'content_urls' : 'subtitle_urls'],
                [lang]: url
            }
        }));
    };

    const handleLangToggle = (lang, field) => {
        setFormData(prev => {
            const list = prev[field];
            const newList = list.includes(lang)
                ? list.filter(l => l !== lang)
                : [...list, lang];
            return { ...prev, [field]: newList };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate required fields
        if (!formData.title) return alert('Title is required');
        if (!formData.duration_ms && formData.content_type === 'video') return alert('Duration is required for video');

        // Validate scheduling
        if (scheduleForLater && !scheduleDateTime) {
            return alert('Please select a publish date and time');
        }

        // Transform flat URL maps back to API structure if needed
        const payload = {
            ...formData,
            content_urls_by_language: formData.content_urls,
            subtitle_urls_by_language: formData.subtitle_urls
        };

        // Add scheduling info if "Schedule for later" is checked
        if (scheduleForLater) {
            payload.scheduleDateTime = scheduleDateTime;
        }

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Lesson Number"
                    name="lesson_number"
                    type="number"
                    value={formData.lesson_number}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                    <select
                        name="content_type"
                        value={formData.content_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                    </select>
                </div>
                <Input
                    label="Duration (ms)"
                    name="duration_ms"
                    type="number"
                    value={formData.duration_ms}
                    onChange={handleChange}
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="is_paid"
                    checked={formData.is_paid}
                    onChange={handleChange}
                    id="is_paid"
                    className="rounded text-blue-600"
                />
                <label htmlFor="is_paid" className="text-sm font-medium text-gray-700">Paid Content</label>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Content Languages & URLs</h4>
                <div className="flex gap-2 mb-4">
                    {programLanguages.map(lang => (
                        <button
                            key={lang}
                            type="button"
                            onClick={() => setActiveLang(lang)}
                            className={`px-3 py-1 text-sm rounded-full ${activeLang === lang ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                                }`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="checkbox"
                            checked={formData.content_languages_available.includes(activeLang)}
                            onChange={() => handleLangToggle(activeLang, 'content_languages_available')}
                            disabled={activeLang === primaryLanguage} // Primary is required
                        />
                        <label className="text-sm font-medium">Available in {activeLang.toUpperCase()}</label>
                    </div>

                    {formData.content_languages_available.includes(activeLang) && (
                        <Input
                            label="Content URL"
                            value={formData.content_urls[activeLang] || ''}
                            onChange={(e) => handleUrlChange(activeLang, e.target.value)}
                            placeholder={`https://.../video-${activeLang}.mp4`}
                        />
                    )}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Subtitles</h4>
                <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="checkbox"
                            checked={formData.subtitle_languages.includes(activeLang)}
                            onChange={() => handleLangToggle(activeLang, 'subtitle_languages')}
                        />
                        <label className="text-sm font-medium">Subtitles for {activeLang.toUpperCase()}</label>
                    </div>

                    {formData.subtitle_languages.includes(activeLang) && (
                        <Input
                            label="Subtitle URL"
                            value={formData.subtitle_urls[activeLang] || ''}
                            onChange={(e) => handleUrlChange(activeLang, e.target.value, 'subtitle')}
                            placeholder={`https://.../sub-${activeLang}.vtt`}
                        />
                    )}
                </div>
            </div>

            {!initialData && (
                <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Publishing Options</h4>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={scheduleForLater}
                                onChange={(e) => setScheduleForLater(e.target.checked)}
                                id="schedule_for_later"
                                className="rounded text-blue-600"
                            />
                            <label htmlFor="schedule_for_later" className="text-sm font-medium text-gray-700">
                                Schedule for later
                            </label>
                        </div>

                        {scheduleForLater && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Publish Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={scheduleDateTime}
                                    onChange={(e) => setScheduleDateTime(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required={scheduleForLater}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    The lesson will be created as "scheduled" and automatically published at this time
                                </p>
                            </div>
                        )}

                        {!scheduleForLater && (
                            <p className="text-xs text-gray-500 italic">
                                Lesson will be created as a draft. You can publish or schedule it later.
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : initialData ? 'Update Lesson' : scheduleForLater ? 'Create & Schedule' : 'Create Lesson'}
                </Button>
            </div>
        </form>
    );
}
