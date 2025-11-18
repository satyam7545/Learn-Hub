import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Users, BookOpen, TrendingUp, Award, CheckCircle, XCircle, ToggleLeft, ToggleRight, UserPlus } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchCourses();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/admin/courses');
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      fetchUsers();
    } catch (error) {
      alert('Failed to toggle user status');
    }
  };

  const updateCourseStatus = async (courseId, status) => {
    try {
      await api.put(`/admin/courses/${courseId}/status`, { status });
      alert(`Course ${status} successfully!`);
      fetchCourses();
      fetchStats();
    } catch (error) {
      alert('Failed to update course status');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      alert('User deleted successfully!');
      fetchUsers();
      fetchStats();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const createAdmin = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (adminFormData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      await api.post('/admin/create-admin', adminFormData);
      setFormSuccess('Admin user created successfully!');
      setAdminFormData({ name: '', email: '', password: '' });
      fetchUsers();
      fetchStats();
      setTimeout(() => {
        setShowAdminForm(false);
        setFormSuccess('');
      }, 2000);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to create admin user');
    }
  };

  return (
    <div className="admin-dashboard dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
      </div>

      {stats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
              <Users size={28} color="#6366f1" />
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
              <span className="stat-detail">
                {stats.totalStudents} students • {stats.totalTeachers} teachers
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
              <BookOpen size={28} color="#10b981" />
            </div>
            <div className="stat-info">
              <h3>{stats.totalCourses}</h3>
              <p>Total Courses</p>
              <span className="stat-detail">
                {stats.publishedCourses} published • {stats.pendingCourses} pending
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
              <TrendingUp size={28} color="#f59e0b" />
            </div>
            <div className="stat-info">
              <h3>{stats.totalEnrollments}</h3>
              <p>Total Enrollments</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
              <Award size={28} color="#8b5cf6" />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingCourses}</h3>
              <p>Pending Reviews</p>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users Management
        </button>
        <button
          className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          Courses Management
        </button>
        <button
          className={`tab ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          Admin Management
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Platform Overview</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Recent Activity</h3>
                <p>Platform is running smoothly</p>
                <ul className="activity-list">
                  <li>✓ {users.filter(u => u.isActive).length} active users</li>
                  <li>✓ {courses.filter(c => c.status === 'published').length} published courses</li>
                  <li>⚠ {courses.filter(c => c.status === 'pending').length} courses pending approval</li>
                </ul>
              </div>
              <div className="overview-card">
                <h3>User Distribution</h3>
                <div className="distribution">
                  <div className="dist-item">
                    <span>Students</span>
                    <strong>{stats?.totalStudents || 0}</strong>
                  </div>
                  <div className="dist-item">
                    <span>Teachers</span>
                    <strong>{stats?.totalTeachers || 0}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Users Management</h2>
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : (
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-indicator ${u.isActive ? 'active' : 'inactive'}`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={() => toggleUserStatus(u._id)}
                              title={u.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {u.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            </button>
                            {u.role !== 'admin' && (
                              <button
                                className="btn-icon danger"
                                onClick={() => deleteUser(u._id)}
                                title="Delete"
                              >
                                <XCircle size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-section">
            <h2>Courses Management</h2>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Course Title</th>
                    <th>Instructor</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Students</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td>
                        <div className="course-title-cell">
                          <strong>{course.title}</strong>
                          <span>{course.level}</span>
                        </div>
                      </td>
                      <td>{course.instructor?.name}</td>
                      <td>{course.category}</td>
                      <td>
                        <span className={`status-badge ${course.status}`}>
                          {course.status}
                        </span>
                      </td>
                      <td>{course.enrollmentCount}</td>
                      <td>
                        <div className="action-buttons">
                          {course.status === 'pending' && (
                            <>
                              <button
                                className="btn-icon success"
                                onClick={() => updateCourseStatus(course._id, 'published')}
                                title="Approve"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                className="btn-icon danger"
                                onClick={() => updateCourseStatus(course._id, 'rejected')}
                                title="Reject"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          {course.status === 'published' && (
                            <button
                              className="btn-icon danger"
                              onClick={() => updateCourseStatus(course._id, 'rejected')}
                              title="Unpublish"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="admins-section">
            <div className="section-header-with-button">
              <h2>Admin Management</h2>
              <button
                className="btn-primary"
                onClick={() => setShowAdminForm(!showAdminForm)}
              >
                <UserPlus size={18} />
                {showAdminForm ? 'Cancel' : 'Create New Admin'}
              </button>
            </div>

            {showAdminForm && (
              <div className="admin-form-card">
                <h3>Create New Admin User</h3>
                {formError && (
                  <div className="alert alert-error">
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="alert alert-success">
                    {formSuccess}
                  </div>
                )}
                <form onSubmit={createAdmin}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={adminFormData.name}
                      onChange={(e) => setAdminFormData({...adminFormData, name: e.target.value})}
                      required
                      placeholder="Enter admin name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={adminFormData.email}
                      onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                      required
                      placeholder="Enter admin email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={adminFormData.password}
                      onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                      required
                      minLength="6"
                      placeholder="Enter password (min 6 characters)"
                    />
                  </div>
                  <button type="submit" className="btn-submit">
                    Create Admin User
                  </button>
                </form>
              </div>
            )}

            <div className="admins-list">
              <h3>Current Administrators</h3>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'admin').map((admin) => (
                      <tr key={admin._id}>
                        <td>{admin.name}</td>
                        <td>{admin.email}</td>
                        <td>
                          <span className={`status-badge ${admin.isActive ? 'published' : 'rejected'}`}>
                            {admin.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
