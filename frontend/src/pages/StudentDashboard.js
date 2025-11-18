import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { BookOpen, ClipboardList, FileText, Calendar, Award, Clock, Plus, Search, Download, Upload, Trash2, Edit, Pin, Tag } from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('all'); // all, pending, submitted
  const [noteFilter, setNoteFilter] = useState(''); // filter by course
  const [attendanceFilter, setAttendanceFilter] = useState('all'); // all, present, absent, late

  // Note modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    courseId: '',
    lesson: '',
    tags: ''
  });

  // Assignment submission modal
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submission, setSubmission] = useState({
    text: '',
    fileUrl: ''
  });

  useEffect(() => {
    fetchEnrollments();
    fetchNotes();
    fetchAssignments();
    fetchAttendance();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/enrollments/my-courses');
      setEnrollments(response.data.enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments/my-submissions');
      setAssignments(response.data.submissions || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes/my-notes');
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance/my-attendance');
      setAttendance(response.data.attendance || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const noteData = {
        ...newNote,
        tags: newNote.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingNote) {
        await api.put(`/notes/${editingNote._id}`, noteData);
        alert('Note updated successfully!');
      } else {
        await api.post('/notes', noteData);
        alert('Note created successfully!');
      }

      setShowNoteModal(false);
      setEditingNote(null);
      fetchNotes();
      setNewNote({
        title: '',
        content: '',
        courseId: '',
        lesson: '',
        tags: ''
      });
    } catch (error) {
      alert('Failed to save note: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      courseId: note.course._id,
      lesson: note.lesson || '',
      tags: note.tags.join(', ')
    });
    setShowNoteModal(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${noteId}`);
      alert('Note deleted successfully!');
      fetchNotes();
    } catch (error) {
      alert('Failed to delete note');
    }
  };

  const handlePinNote = async (noteId, isPinned) => {
    try {
      await api.put(`/notes/${noteId}`, { isPinned: !isPinned });
      fetchNotes();
    } catch (error) {
      alert('Failed to pin/unpin note');
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/assignments/${selectedAssignment._id}/submit`, submission);
      alert('Assignment submitted successfully!');
      setShowSubmissionModal(false);
      setSelectedAssignment(null);
      setSubmission({ text: '', fileUrl: '' });
      fetchAssignments();
    } catch (error) {
      alert('Failed to submit assignment: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const openSubmissionModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionModal(true);
  };

  // Filter logic
  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments = assignments.filter(item => {
    const matchesFilter = assignmentFilter === 'all' ||
      (assignmentFilter === 'pending' && !item.submission) ||
      (assignmentFilter === 'submitted' && item.submission);
    const matchesSearch = item.assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignment.course?.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredNotes = notes.filter(note => {
    const matchesCourse = !noteFilter || note.course?._id === noteFilter;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCourse && matchesSearch;
  });

  const filteredAttendance = attendance.filter(record => {
    const matchesFilter = attendanceFilter === 'all' || record.status === attendanceFilter;
    const matchesSearch = record.course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.topic.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const completedCourses = enrollments.filter(e => e.completedAt).length;
  const totalProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0;
  const totalNotes = notes.length;
  const pendingAssignments = assignments.filter(a => !a.submission).length;

  return (
    <div className="student-dashboard dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Continue your learning journey</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
            <BookOpen size={28} color="#6366f1" />
          </div>
          <div className="stat-info">
            <h3>{enrollments.length}</h3>
            <p>Enrolled Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
            <Award size={28} color="#10b981" />
          </div>
          <div className="stat-info">
            <h3>{completedCourses}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
            <ClipboardList size={28} color="#f59e0b" />
          </div>
          <div className="stat-info">
            <h3>{assignments.length}</h3>
            <p>Assignments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
            <FileText size={28} color="#8b5cf6" />
          </div>
          <div className="stat-info">
            <h3>{totalNotes}</h3>
            <p>My Notes</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <BookOpen size={20} />
          <span>My Courses</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          <ClipboardList size={20} />
          <span>Assignments</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <FileText size={20} />
          <span>My Notes</span>
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
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading courses...</p>
              </div>
            ) : filteredEnrollments.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={64} />
                <h3>No courses yet</h3>
                <p>Start your learning journey by enrolling in a course</p>
                <Link to="/courses" className="btn-primary">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="courses-grid">
                {filteredEnrollments.map((enrollment) => (
                  <div key={enrollment._id} className="course-card">
                    <div className="course-header">
                      <h3>{enrollment.course?.title}</h3>
                      <span className="instructor-name">by {enrollment.course?.instructor?.name}</span>
                    </div>

                    <div className="course-progress">
                      <div className="progress-header">
                        <span>Progress</span>
                        <span className="progress-percent">{enrollment.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="course-info">
                      <span>
                        <Clock size={16} />
                        {enrollment.course?.duration}h
                      </span>
                    </div>

                    {enrollment.completedAt ? (
                      <div className="course-status completed">
                        <Award size={18} />
                        Completed
                      </div>
                    ) : (
                      <Link
                        to={`/courses/${enrollment.course?._id}`}
                        className="btn-continue"
                      >
                        Continue Learning
                      </Link>
                    )}
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
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="all">All Assignments</option>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>
            </div>

            {filteredAssignments.length === 0 ? (
              <div className="empty-state">
                <ClipboardList size={64} />
                <h3>{assignments.length === 0 ? 'No assignments yet' : 'No assignments match your filters'}</h3>
                <p>{assignments.length === 0 ? 'Assignments from your courses will appear here' : 'Try adjusting your search or filters'}</p>
              </div>
            ) : (
              <div className="assignments-list">
                {filteredAssignments.map((item) => (
                  <div key={item.assignment._id} className="assignment-card">
                    <div className="assignment-header">
                      <h3>{item.assignment.title}</h3>
                      <div className="assignment-meta">
                        <span className="course-badge">{item.assignment.course?.title}</span>
                        <span className={`status-badge ${item.submission ? 'submitted' : 'pending'}`}>
                          {item.submission ? 'Submitted' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <p>{item.assignment.description}</p>

                    <div className="assignment-details">
                      <div className="detail-item">
                        <Clock size={16} />
                        <span>Due: {new Date(item.assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <Award size={16} />
                        <span>Max Score: {item.assignment.maxScore}</span>
                      </div>
                      {item.submission && item.submission.score !== undefined && (
                        <div className="detail-item score">
                          <strong>Score: {item.submission.score}/{item.assignment.maxScore}</strong>
                        </div>
                      )}
                    </div>

                    {item.submission ? (
                      <div className="submission-info">
                        <p><strong>Submitted on:</strong> {new Date(item.submission.submittedAt).toLocaleDateString()}</p>
                        {item.submission.feedback && (
                          <div className="feedback">
                            <strong>Feedback:</strong>
                            <p>{item.submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="assignment-actions">
                        {item.assignment.fileUrl && (
                          <a href={item.assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-sm">
                            <Download size={16} />
                            Download
                          </a>
                        )}
                        <button className="btn-sm primary" onClick={() => openSubmissionModal(item.assignment)}>
                          <Upload size={16} />
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'notes' && (
          <>
            <div className="content-header">
              <h2>My Notes</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={noteFilter}
                  onChange={(e) => setNoteFilter(e.target.value)}
                  style={{
                    padding: '0.8rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    minWidth: '150px'
                  }}
                >
                  <option value="">All Courses</option>
                  {enrollments.map(enrollment => (
                    <option key={enrollment.course._id} value={enrollment.course._id}>
                      {enrollment.course.title}
                    </option>
                  ))}
                </select>
                <button className="btn-create" onClick={() => setShowNoteModal(true)}>
                  <Plus size={20} />
                  New Note
                </button>
              </div>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="empty-state">
                <FileText size={64} />
                <h3>{notes.length === 0 ? 'No notes yet' : 'No notes match your filters'}</h3>
                <p>{notes.length === 0 ? 'Take notes while learning to remember important concepts' : 'Try adjusting your search or filters'}</p>
              </div>
            ) : (
              <div className="notes-grid">
                {filteredNotes.map((note) => (
                  <div key={note._id} className={`note-card ${note.isPinned ? 'pinned' : ''}`}>
                    <div className="note-header">
                      <h3>{note.title}</h3>
                      <div className="note-actions">
                        <button
                          className={`btn-icon ${note.isPinned ? 'pinned' : ''}`}
                          onClick={() => handlePinNote(note._id, note.isPinned)}
                          title={note.isPinned ? 'Unpin' : 'Pin'}
                        >
                          <Pin size={16} />
                        </button>
                        <button className="btn-icon" onClick={() => handleEditNote(note)} title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="btn-icon danger" onClick={() => handleDeleteNote(note._id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="note-meta">
                      <span className="course-badge">{note.course?.title}</span>
                      {note.lesson && <span className="lesson-badge">{note.lesson}</span>}
                    </div>

                    <p className="note-content">{note.content}</p>

                    {note.tags && note.tags.length > 0 && (
                      <div className="note-tags">
                        {note.tags.map((tag, idx) => (
                          <span key={idx} className="tag">
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="note-footer">
                      <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
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
              <h2>My Attendance</h2>
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
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
            </div>

            {filteredAttendance.length === 0 ? (
              <div className="empty-state">
                <Calendar size={64} />
                <h3>{attendance.length === 0 ? 'No attendance records' : 'No records match your filters'}</h3>
                <p>{attendance.length === 0 ? 'Your attendance records will appear here' : 'Try adjusting your search or filters'}</p>
              </div>
            ) : (
              <div className="attendance-list">
                {filteredAttendance.map((record, idx) => (
                  <div key={idx} className="attendance-card">
                    <div className="attendance-header">
                      <h3>{record.course?.title}</h3>
                      <span className={`status-badge ${record.status}`}>
                        {record.status}
                      </span>
                    </div>
                    <div className="attendance-details">
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <BookOpen size={16} />
                        <span>{record.topic}</span>
                      </div>
                    </div>
                    {record.remarks && (
                      <p className="remarks">{record.remarks}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Note Modal */}
      {showNoteModal && (
        <div className="modal-overlay" onClick={() => {
          setShowNoteModal(false);
          setEditingNote(null);
          setNewNote({ title: '', content: '', courseId: '', lesson: '', tags: '' });
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
            <form onSubmit={handleCreateNote}>
              <div className="form-group">
                <label>Course*</label>
                <select
                  value={newNote.courseId}
                  onChange={(e) => setNewNote({ ...newNote, courseId: e.target.value })}
                  required
                >
                  <option value="">Select a course</option>
                  {enrollments.map(enrollment => (
                    <option key={enrollment.course._id} value={enrollment.course._id}>
                      {enrollment.course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lesson/Topic</label>
                <input
                  type="text"
                  value={newNote.lesson}
                  onChange={(e) => setNewNote({ ...newNote, lesson: e.target.value })}
                  placeholder="e.g., Chapter 3 - Variables"
                />
              </div>

              <div className="form-group">
                <label>Content*</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  placeholder="javascript, functions, arrays"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => {
                  setShowNoteModal(false);
                  setEditingNote(null);
                  setNewNote({ title: '', content: '', courseId: '', lesson: '', tags: '' });
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingNote ? 'Update Note' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Assignment Modal */}
      {showSubmissionModal && selectedAssignment && (
        <div className="modal-overlay" onClick={() => {
          setShowSubmissionModal(false);
          setSelectedAssignment(null);
          setSubmission({ text: '', fileUrl: '' });
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Submit Assignment</h2>
            <h3>{selectedAssignment.title}</h3>
            <form onSubmit={handleSubmitAssignment}>
              <div className="form-group">
                <label>Your Answer*</label>
                <textarea
                  value={submission.text}
                  onChange={(e) => setSubmission({ ...submission, text: e.target.value })}
                  rows="6"
                  required
                  placeholder="Write your answer here..."
                />
              </div>

              <div className="form-group">
                <label>File URL (optional)</label>
                <input
                  type="url"
                  value={submission.fileUrl}
                  onChange={(e) => setSubmission({ ...submission, fileUrl: e.target.value })}
                  placeholder="https://... (link to your work)"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => {
                  setShowSubmissionModal(false);
                  setSelectedAssignment(null);
                  setSubmission({ text: '', fileUrl: '' });
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
