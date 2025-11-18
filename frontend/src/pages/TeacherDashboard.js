import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { BookOpen, Users, ClipboardList, Calendar, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState('all');
  
  // Course modal state
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'Programming',
    level: 'Beginner',
    price: 0,
    duration: 0,
    learningOutcomes: '',
    requirements: ''
  });

  // Assignment modal state
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    maxScore: 100,
    fileUrl: ''
  });

  // Attendance modal state
  const [showCreateAttendanceModal, setShowCreateAttendanceModal] = useState(false);
  const [newAttendance, setNewAttendance] = useState({
    courseId: '',
    date: '',
    topic: '',
    records: []
  });
  const [selectedCourseStudents, setSelectedCourseStudents] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      fetchAssignments();
      fetchAttendance();
    }
  }, [courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses/instructor/my-courses');
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const assignmentPromises = courses.map(course =>
        api.get(`/assignments/course/${course._id}`)
      );
      const responses = await Promise.all(assignmentPromises);
      const allAssignments = responses.flatMap(res => res.data.assignments);
      setAssignments(allAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const attendancePromises = courses.map(course =>
        api.get(`/attendance/course/${course._id}`)
      );
      const responses = await Promise.all(attendancePromises);
      const allAttendance = responses.flatMap(res => res.data.attendance);
      setAttendance(allAttendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...newCourse,
        learningOutcomes: newCourse.learningOutcomes.split('\n').filter(x => x.trim()),
        requirements: newCourse.requirements.split('\n').filter(x => x.trim())
      };

      await api.post('/courses', courseData);
      alert('Course created successfully!');
      setShowCreateCourseModal(false);
      fetchCourses();
      setNewCourse({
        title: '',
        description: '',
        category: 'Programming',
        level: 'Beginner',
        price: 0,
        duration: 0,
        learningOutcomes: '',
        requirements: ''
      });
    } catch (error) {
      alert('Failed to create course: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      alert('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      alert('Failed to delete course');
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assignments', newAssignment);
      alert('Assignment created successfully!');
      setShowCreateAssignmentModal(false);
      fetchAssignments();
      setNewAssignment({
        title: '',
        description: '',
        courseId: '',
        dueDate: '',
        maxScore: 100,
        fileUrl: ''
      });
    } catch (error) {
      alert('Failed to create assignment: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await api.delete(`/assignments/${assignmentId}`);
      alert('Assignment deleted successfully!');
      fetchAssignments();
    } catch (error) {
      alert('Failed to delete assignment');
    }
  };

  const handleCourseSelectForAttendance = async (courseId) => {
    setNewAttendance({ ...newAttendance, courseId });
    try {
      const response = await api.get(`/enrollments/course/${courseId}/students`);
      const students = response.data.students || [];
      setSelectedCourseStudents(students);
      setNewAttendance(prev => ({
        ...prev,
        records: students.map(student => ({
          student: student._id,
          status: 'present',
          remarks: ''
        }))
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      setSelectedCourseStudents([]);
    }
  };

  const handleAttendanceStatusChange = (studentId, status) => {
    setNewAttendance(prev => ({
      ...prev,
      records: prev.records.map(record =>
        record.student === studentId ? { ...record, status } : record
      )
    }));
  };

  const handleCreateAttendance = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attendance', newAttendance);
      alert('Attendance recorded successfully!');
      setShowCreateAttendanceModal(false);
      fetchAttendance();
      setNewAttendance({
        courseId: '',
        date: '',
        topic: '',
        records: []
      });
      setSelectedCourseStudents([]);
    } catch (error) {
      alert('Failed to record attendance: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  // Filter logic
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments = assignments.filter(assignment => {
    const matchesCourse = !assignmentFilter || assignment.course._id === assignmentFilter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course?.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const filteredAttendance = attendance.filter(record => {
    const matchesCourse = !attendanceFilter || record.course._id === attendanceFilter;
    const matchesSearch = record.course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.topic.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesCourse || !matchesSearch) return false;
    
    if (attendanceStatusFilter !== 'all') {
      return record.records.some(r => r.status === attendanceStatusFilter);
    }
    return true;
  });

  const totalStudents = courses.reduce((sum, course) => sum + course.enrollmentCount, 0);
  const totalAssignments = assignments.length;
  const totalAttendance = attendance.length;
  const avgRating = courses.length > 0
    ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)
    : 0;

  return (
    <div className="teacher-dashboard dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p>Manage your courses, assignments, and attendance</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
            <BookOpen size={28} color="#6366f1" />
          </div>
          <div className="stat-info">
            <h3>{courses.length}</h3>
            <p>Total Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
            <Users size={28} color="#10b981" />
          </div>
          <div className="stat-info">
            <h3>{totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
            <ClipboardList size={28} color="#f59e0b" />
          </div>
          <div className="stat-info">
            <h3>{totalAssignments}</h3>
            <p>Assignments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
            <Calendar size={28} color="#8b5cf6" />
          </div>
          <div className="stat-info">
            <h3>{totalAttendance}</h3>
            <p>Attendance Records</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <BookOpen size={20} />
          <span>Courses</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          <ClipboardList size={20} />
          <span>Assignments</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <Calendar size={20} />
          <span>Attendance</span>
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'courses' && (
          <>
            <div className="content-header">
              <h2>My Courses</h2>
              <button className="btn-create" onClick={() => setShowCreateCourseModal(true)}>
                <Plus size={20} />
                Create Course
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={64} />
                <h3>No courses yet</h3>
                <p>Create your first course and start teaching</p>
              </div>
            ) : (
              <div className="courses-grid">
                {courses.map((course) => (
                  <div key={course._id} className="course-card">
                    <div className="course-card-header">
                      <h3>{course.title}</h3>
                      <span className={`status-badge ${course.status}`}>
                        {course.status}
                      </span>
                    </div>
                    <p className="course-description">{course.description}</p>
                    <div className="course-stats">
                      <div className="course-stat">
                        <Users size={16} />
                        <span>{course.enrollmentCount} students</span>
                      </div>
                      <div className="course-stat">
                        <Clock size={16} />
                        <span>{course.duration}h</span>
                      </div>
                    </div>
                    <div className="course-card-actions">
                      <button className="btn-icon" title="View">
                        <Eye size={18} />
                      </button>
                      <button className="btn-icon" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn-icon danger"
                        title="Delete"
                        onClick={() => handleDeleteCourse(course._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'assignments' && (
          <>
            <div className="content-header">
              <h2>Assignments</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={assignmentFilter}
                  onChange={(e) => setAssignmentFilter(e.target.value)}
                  style={{
                    padding: '0.8rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    minWidth: '180px'
                  }}
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <button className="btn-create" onClick={() => setShowCreateAssignmentModal(true)}>
                  <Plus size={20} />
                  Create Assignment
                </button>
              </div>
            </div>

            {filteredAssignments.length === 0 ? (
              <div className="empty-state">
                <ClipboardList size={64} />
                <h3>{assignments.length === 0 ? 'No assignments created' : 'No assignments match your filters'}</h3>
                <p>{assignments.length === 0 ? 'Create assignments to track student progress' : 'Try adjusting your search or filters'}</p>
              </div>
            ) : (
              <div className="assignments-list">
                {filteredAssignments.map((assignment) => (
                  <div key={assignment._id} className="assignment-card">
                    <div className="assignment-header">
                      <h3>{assignment.title}</h3>
                      <div className="assignment-meta">
                        <span className="due-date">
                          <Clock size={16} />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <span className="max-score">Max: {assignment.maxScore} pts</span>
                      </div>
                    </div>
                    <p>{assignment.description}</p>
                    <div className="assignment-footer">
                      <span className="submissions-count">
                        {assignment.submissions?.length || 0} submissions
                      </span>
                      <div className="assignment-actions">
                        <button className="btn-sm" title="View Submissions">
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          className="btn-sm danger"
                          title="Delete"
                          onClick={() => handleDeleteAssignment(assignment._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'attendance' && (
          <>
            <div className="content-header">
              <h2>Attendance</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search attendance..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={attendanceFilter}
                  onChange={(e) => setAttendanceFilter(e.target.value)}
                  style={{
                    padding: '0.8rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    minWidth: '180px'
                  }}
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <select
                  value={attendanceStatusFilter}
                  onChange={(e) => setAttendanceStatusFilter(e.target.value)}
                  style={{
                    padding: '0.8rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
                <button className="btn-create" onClick={() => setShowCreateAttendanceModal(true)}>
                  <Plus size={20} />
                  Mark Attendance
                </button>
              </div>
            </div>

            {filteredAttendance.length === 0 ? (
              <div className="empty-state">
                <Calendar size={64} />
                <h3>{attendance.length === 0 ? 'No attendance records' : 'No records match your filters'}</h3>
                <p>{attendance.length === 0 ? 'Start marking attendance for your classes' : 'Try adjusting your search or filters'}</p>
              </div>
            ) : (
              <div className="attendance-list">
                {filteredAttendance.map((record) => (
                  <div key={record._id} className="attendance-card">
                    <div className="attendance-header">
                      <h3>{record.topic}</h3>
                      <span className="attendance-date">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="attendance-stats">
                      <div className="attendance-stat present">
                        <CheckCircle size={18} />
                        <span>{record.records.filter(r => r.status === 'present').length} Present</span>
                      </div>
                      <div className="attendance-stat absent">
                        <XCircle size={18} />
                        <span>{record.records.filter(r => r.status === 'absent').length} Absent</span>
                      </div>
                      <div className="attendance-stat late">
                        <Clock size={18} />
                        <span>{record.records.filter(r => r.status === 'late').length} Late</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateCourseModal && (
        <div className="modal-overlay" onClick={() => setShowCreateCourseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Course</h2>
            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label>Course Title*</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description*</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category*</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    required
                  >
                    <option>Programming</option>
                    <option>Design</option>
                    <option>Business</option>
                    <option>Marketing</option>
                    <option>Photography</option>
                    <option>Music</option>
                    <option>Health & Fitness</option>
                    <option>Personal Development</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Level*</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                    required
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Duration (hours)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Learning Outcomes (one per line)</label>
                <textarea
                  value={newCourse.learningOutcomes}
                  onChange={(e) => setNewCourse({ ...newCourse, learningOutcomes: e.target.value })}
                  rows="4"
                  placeholder="What will students learn?"
                />
              </div>

              <div className="form-group">
                <label>Requirements (one per line)</label>
                <textarea
                  value={newCourse.requirements}
                  onChange={(e) => setNewCourse({ ...newCourse, requirements: e.target.value })}
                  rows="3"
                  placeholder="What prerequisites are needed?"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateCourseModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateAssignmentModal && (
        <div className="modal-overlay" onClick={() => setShowCreateAssignmentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Assignment</h2>
            <form onSubmit={handleCreateAssignment}>
              <div className="form-group">
                <label>Course*</label>
                <select
                  value={newAssignment.courseId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description*</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date*</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Max Score</label>
                  <input
                    type="number"
                    min="0"
                    value={newAssignment.maxScore}
                    onChange={(e) => setNewAssignment({ ...newAssignment, maxScore: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>File URL (optional)</label>
                <input
                  type="url"
                  value={newAssignment.fileUrl}
                  onChange={(e) => setNewAssignment({ ...newAssignment, fileUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateAssignmentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Attendance Modal */}
      {showCreateAttendanceModal && (
        <div className="modal-overlay" onClick={() => setShowCreateAttendanceModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Record Attendance</h2>
            <form onSubmit={handleCreateAttendance}>
              <div className="form-group">
                <label>Course*</label>
                <select
                  value={newAttendance.courseId}
                  onChange={(e) => handleCourseSelectForAttendance(e.target.value)}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date*</label>
                  <input
                    type="date"
                    value={newAttendance.date}
                    onChange={(e) => setNewAttendance({ ...newAttendance, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Topic*</label>
                  <input
                    type="text"
                    value={newAttendance.topic}
                    onChange={(e) => setNewAttendance({ ...newAttendance, topic: e.target.value })}
                    required
                    placeholder="Lesson topic"
                  />
                </div>
              </div>

              {selectedCourseStudents.length > 0 && (
                <div className="form-group">
                  <label>Mark Attendance</label>
                  <div className="attendance-marking">
                    {selectedCourseStudents.map((student, idx) => (
                      <div key={student._id} className="student-attendance-row">
                        <span className="student-name">{student.name}</span>
                        <div className="attendance-options">
                          <button
                            type="button"
                            className={`attendance-btn ${newAttendance.records[idx]?.status === 'present' ? 'active present' : ''}`}
                            onClick={() => handleAttendanceStatusChange(student._id, 'present')}
                          >
                            <CheckCircle size={16} />
                            Present
                          </button>
                          <button
                            type="button"
                            className={`attendance-btn ${newAttendance.records[idx]?.status === 'absent' ? 'active absent' : ''}`}
                            onClick={() => handleAttendanceStatusChange(student._id, 'absent')}
                          >
                            <XCircle size={16} />
                            Absent
                          </button>
                          <button
                            type="button"
                            className={`attendance-btn ${newAttendance.records[idx]?.status === 'late' ? 'active late' : ''}`}
                            onClick={() => handleAttendanceStatusChange(student._id, 'late')}
                          >
                            <Clock size={16} />
                            Late
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateAttendanceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={selectedCourseStudents.length === 0}>
                  Record Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
