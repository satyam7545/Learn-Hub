import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, Clock, Users, Star } from 'lucide-react';
import './CoursesPage.css';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const categories = [
    'All',
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Photography',
    'Music',
    'Health & Fitness',
    'Personal Development'
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel && selectedLevel !== 'All') params.level = selectedLevel;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/courses', { params });
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedLevel, searchTerm]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="courses-page">
      <section className="courses-header">
        <h1>Explore Our Courses</h1>
        <p>Discover thousands of courses to enhance your skills</p>
      </section>

      <section className="courses-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <Filter size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat === 'All' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">Level</option>
              {levels.map((level) => (
                <option key={level} value={level === 'All' ? '' : level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="courses-grid-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <p>No courses found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="courses-count">
              <p>{courses.length} courses found</p>
            </div>
            <div className="courses-grid">
              {courses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="course-card"
                >
                  <div className="course-thumbnail">
                    <div className="course-level">{course.level}</div>
                    <div className="course-category">{course.category}</div>
                  </div>
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-instructor">
                      By {course.instructor?.name || 'Unknown'}
                    </div>
                    <div className="course-meta">
                      <span>
                        <Clock size={16} />
                        {course.duration}h
                      </span>
                      <span>
                        <Users size={16} />
                        {course.enrollmentCount} students
                      </span>
                      <span>
                        <Star size={16} />
                        {course.rating.toFixed(1)}
                      </span>
                    </div>
                    {course.price === 0 ? (
                      <div className="course-price free">Free</div>
                    ) : (
                      <div className="course-price">${course.price}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default CoursesPage;
