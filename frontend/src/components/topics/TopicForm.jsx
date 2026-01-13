import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function TopicForm({ onSubmit, onCancel, loading, initialData = null }) {
    const [name, setName] = useState(initialData?.name || '');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Topic name is required');
            return;
        }
        onSubmit({ name });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                label="Topic Name"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                }}
                error={error}
                placeholder="e.g. Mathematics, Science"
                required
            />

            <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : initialData ? 'Update Topic' : 'Create Topic'}
                </Button>
            </div>
        </form>
    );
}
