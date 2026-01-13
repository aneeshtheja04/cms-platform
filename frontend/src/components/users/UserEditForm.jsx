import { useState, useEffect } from 'react';
import { usersApi } from '../../api/users.api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Loader from '../ui/Loader';

export default function UserEditForm({ userId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    is_active: true,
  });

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getById(userId);
      setUserData(data);
      setFormData({
        name: data.name,
        role: data.role,
        is_active: data.is_active,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Role validation
    if (!['admin', 'editor', 'viewer'].includes(formData.role)) {
      newErrors.role = 'Invalid role selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setUpdating(true);
      await usersApi.update(userId, formData);
      alert('User updated successfully!');
      onSuccess(); // Refresh list
      onClose(); // Close drawer
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchUser} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      {/* Email Field (Read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          type="email"
          value={userData?.email || ''}
          disabled
          className="bg-gray-100 text-gray-500 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
      </div>

      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter user name"
          disabled={updating}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Role Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={updating}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className="text-red-600 text-sm mt-1">{errors.role}</p>
        )}
      </div>

      {/* Status Field (Checkbox) */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            disabled={updating}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Active User
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Inactive users cannot log in
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={updating}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={updating}>
          {updating ? 'Updating...' : 'Update User'}
        </Button>
      </div>
    </form>
  );
}
