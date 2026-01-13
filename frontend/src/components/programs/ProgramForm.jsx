import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { topicsApi } from '../../api/topics.api';

export default function ProgramForm({ onSubmit, onCancel, loading, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    language_primary: initialData?.language_primary || 'en',
    languages_available: initialData?.languages_available || ['en'],
    topics: initialData?.topics?.map(t => t.id) || [],
  });

  const [errors, setErrors] = useState({});
  const [availableTopics, setAvailableTopics] = useState([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const data = await topicsApi.getAll();
      setAvailableTopics(data);
    } catch (err) {
      console.error('Failed to fetch topics', err);
    }
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'te', label: 'Telugu' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLanguageToggle = (lang) => {
    setFormData((prev) => {
      const languages = prev.languages_available.includes(lang)
        ? prev.languages_available.filter((l) => l !== lang)
        : [...prev.languages_available, lang];

      return {
        ...prev,
        languages_available: languages,
      };
    });
  };

  const handleTopicToggle = (topicId) => {
    setFormData((prev) => {
      const currentTopics = prev.topics || [];
      const newTopics = currentTopics.includes(topicId)
        ? currentTopics.filter((id) => id !== topicId)
        : [...currentTopics, topicId];

      return {
        ...prev,
        topics: newTopics,
      };
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.languages_available.includes(formData.language_primary)) {
      newErrors.language_primary = 'Primary language must be in available languages';
    }

    if (formData.languages_available.length === 0) {
      newErrors.languages_available = 'At least one language must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Program Title *"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g., Introduction to Programming"
        error={errors.title}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Brief description of the program..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Primary Language *
        </label>
        <select
          name="language_primary"
          value={formData.language_primary}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        {errors.language_primary && (
          <p className="mt-1 text-sm text-red-600">{errors.language_primary}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Languages *
        </label>
        <div className="flex gap-4 flex-wrap">
          {languageOptions.map((lang) => (
            <label key={lang.value} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.languages_available.includes(lang.value)}
                onChange={() => handleLanguageToggle(lang.value)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{lang.label}</span>
            </label>
          ))}
        </div>
        {errors.languages_available && (
          <p className="mt-1 text-sm text-red-600">{errors.languages_available}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topics
        </label>
        <div className="flex gap-2 flex-wrap">
          {availableTopics.map((topic) => (
            <label key={topic.id} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.topics.includes(topic.id)}
                onChange={() => handleTopicToggle(topic.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{topic.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Program' : 'Create Program'}
        </Button>
      </div>
    </form>
  );
}
