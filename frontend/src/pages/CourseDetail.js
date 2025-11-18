import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Clock, Users, Star, Award, BookOpen, CheckCircle, PlayCircle } from 'lucide-react';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const fetchCourseDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data.course);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkEnrollment = useCallback(async () => {
    try {
      const response = await api.get(`/enrollments/course/${id}`);
      if (response.data.enrollment) {
        setIsEnrolled(true);
      }
    } catch (error) {
      // Not enrolled
      setIsEnrolled(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseDetail();
    if (user && user.role === 'student') {
      checkEnrollment();
    }
  }, [id, user, fetchCourseDetail, checkEnrollment]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      alert('Only students can enroll in courses');
      return;
    }

    try {
      setEnrolling(true);
      await api.post('/enrollments', { courseId: id });
      setIsEnrolled(true);
      alert('Successfully enrolled in the course!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="error-container">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <section className="course-hero">
        <div className="course-hero-content">
          <div className="course-badge">{course.category}</div>
          <h1>{course.title}</h1>
          <p className="course-subtitle">{course.description}</p>
          
          <div className="course-stats">
            <span>
              <Star size={20} />
              {course.rating.toFixed(1)} ({course.reviewCount} reviews)
            </span>
            <span>
              <Users size={20} />
              {course.enrollmentCount} students
            </span>
            <span>
              <Clock size={20} />
              {course.duration} hours
            </span>
            <span>
              <Award size={20} />
              {course.level}
            </span>
          </div>

          <div className="course-instructor-info">
            <p>Created by <strong>{course.instructor?.name}</strong></p>
          </div>

          <div className="course-actions">
            {isEnrolled ? (
              <button className="btn-enrolled" disabled>
                <CheckCircle size={20} />
                Enrolled
              </button>
            ) : (
              <button className="btn-enroll" onClick={handleEnroll} disabled={enrolling}>
                {enrolling ? 'Enrolling...' : course.price === 0 ? 'Enroll Free' : `Enroll for $${course.price}`}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="course-content">
        <div className="course-section">
          <h2>
            <BookOpen size={24} />
            What You'll Learn
          </h2>
          <ul className="learning-outcomes">
            {course.learningOutcomes?.map((outcome, index) => (
              <li key={index}>
                <CheckCircle size={18} />
                {outcome}
              </li>
            ))}
          </ul>
        </div>

        <div className="course-section">
          <h2>
            <PlayCircle size={24} />
            Course Content
          </h2>
          <div className="course-videos">
            {course.videos?.map((video, index) => (
              <div key={video._id || index} className="video-item">
                <div className="video-info">
                  <PlayCircle size={18} />
                  <span className="video-title">{video.title}</span>
                  {video.isPreview && <span className="preview-badge">Preview</span>}
                </div>
                <span className="video-duration">{video.duration} min</span>
              </div>
            ))}
          </div>
        </div>

        {course.requirements && course.requirements.length > 0 && (
          <div className="course-section">
            <h2>Requirements</h2>
            <ul className="requirements-list">
              {course.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="course-section">
          <h2>About the Instructor</h2>
          <div className="instructor-card">
            <h3>{course.instructor?.name}</h3>
            {course.instructor?.bio && <p>{course.instructor.bio}</p>}
            <p className="instructor-email">{course.instructor?.email}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
