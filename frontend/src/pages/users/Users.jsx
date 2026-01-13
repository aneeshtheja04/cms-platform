import { useState, useEffect } from 'react';
import { usersApi } from '../../api/users.api';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import Drawer from '../../components/ui/Drawer';
import UserForm from '../../components/users/UserForm';
import UserEditForm from '../../components/users/UserEditForm';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { hasRole } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      setCreating(true);
      await usersApi.create(formData);
      setIsModalOpen(false);
      alert('User created successfully!');
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-blue-100 text-blue-700',
      editor: 'bg-green-100 text-green-700',
      viewer: 'bg-gray-100 text-gray-700',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[role] || styles.viewer}`}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          isActive
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchUsers} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        {hasRole('admin') && (
          <Button onClick={() => setIsModalOpen(true)}>+ Add User</Button>
        )}
      </div>

      {users.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No users found</p>
            {hasRole('admin') && (
              <Button onClick={() => setIsModalOpen(true)}>
                Create Your First User
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  {hasRole('admin') && (
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{user.email}</td>
                    <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-4">
                      {getStatusBadge(user.is_active)}
                    </td>
                    {hasRole('admin') && (
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setIsDrawerOpen(true);
                          }}
                          className="text-sm"
                        >
                          Edit
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New User"
        size="md"
      >
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setIsModalOpen(false)}
          loading={creating}
        />
      </Modal>

      {/* Edit User Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUserId(null);
        }}
        title="Edit User"
        widthPercent={70}
      >
        {selectedUserId && (
          <UserEditForm
            userId={selectedUserId}
            onClose={() => {
              setIsDrawerOpen(false);
              setSelectedUserId(null);
            }}
            onSuccess={fetchUsers}
          />
        )}
      </Drawer>
    </div>
  );
}
