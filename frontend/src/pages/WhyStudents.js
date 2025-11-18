import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, Users, Clock, Video, CheckCircle, Target, Globe, ArrowRight, Sparkles, Star } from 'lucide-react';
import './WhyStudents.css';

const WhyStudents = () => {
  const benefits = [
    {
      icon: <BookOpen size={32} />,
      title: 'Learn Anything',
      description: 'Access 1,000+ courses covering technology, business, design, and more from beginner to advanced levels.'
    },
    {
      icon: <Clock size={32} />,
      title: 'Learn at Your Pace',
      description: 'Study on your own schedule with lifetime access to course materials. Learn anywhere, anytime.'
    },
    {
      icon: <Users size={32} />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with real-world experience and passion for teaching.'
    },
    {
      icon: <Award size={32} />,
      title: 'Earn Certificates',
      description: 'Receive verifiable certificates upon completion to showcase your achievements to employers.'
    },
    {
      icon: <Video size={32} />,
      title: 'High-Quality Content',
      description: 'Enjoy professionally produced videos, interactive quizzes, and comprehensive learning materials.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Track Your Progress',
      description: 'Monitor your learning journey with detailed analytics, milestones, and achievement badges.'
    }
  ];

  const categories = [
    { name: 'Web Development', courses: '250+' },
    { name: 'Data Science', courses: '180+' },
    { name: 'Business', courses: '150+' },
    { name: 'Design', courses: '120+' },
    { name: 'Marketing', courses: '100+' },
    { name: 'Photography', courses: '80+' }
  ];

  const stats = [
    { number: '1,000+', label: 'Courses Available' },
    { number: '10K+', label: 'Active Students' },
    { number: '500+', label: 'Expert Instructors' },
    { number: '95%', label: 'Success Rate' }
  ];

  const testimonials = [
    {
      name: 'Alex Johnson',
      course: 'Web Development Bootcamp',
      text: 'LearnHub helped me transition into tech. The courses are practical and the instructors are amazing!',
      rating: 5
    },
    {
      name: 'Maria Garcia',
      course: 'Digital Marketing Mastery',
      text: 'I landed my dream job after completing these courses. Highly recommend to anyone!',
      rating: 5
    },
    {
      name: 'David Kim',
      course: 'Data Science Program',
      text: 'The best investment in my career. The content quality is exceptional.',
      rating: 5
    }
  ];

  return (
    <div className="why-students-page">
      {/* Hero Section */}
      <section className="students-hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
        </div>
        <div className="students-hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>For Learners</span>
          </div>
          <h1 className="students-title">
            Master New Skills<br />
            <span className="gradient-text">Transform Your Future</span>
          </h1>
          <p className="students-subtitle">
            Join 10,000+ students learning from expert-led courses. Build in-demand skills, 
            earn certificates, and achieve your career goals with flexible online learning.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Start Learning Free
              <ArrowRight size={20} />
            </Link>
            <Link to="/courses" className="btn-secondary">
              Browse Courses
            </Link>
          </div>
          <div className="hero-trust">
            <CheckCircle size={18} />
            <span>7-day free trial • No credit card required</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="students-stats">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-header">
          <span className="section-badge">WHY LEARN WITH US</span>
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <p className="section-description">
            We provide comprehensive learning tools and support to help you achieve your goals
          </p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <span className="section-badge">EXPLORE TOPICS</span>
          <h2 className="section-title">Popular Course Categories</h2>
          <p className="section-description">
            Discover courses across diverse subjects taught by industry experts
          </p>
        </div>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link key={index} to="/courses" className="category-card">
              <div className="category-icon">
                <Target size={28} />
              </div>
              <h3>{category.name}</h3>
              <p>{category.courses} courses</p>
              <ArrowRight className="category-arrow" size={20} />
            </Link>
          ))}
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="learning-path">
        <div className="learning-path-content">
          <div className="learning-path-text">
            <Globe className="path-icon" size={48} />
            <h2>Your Learning Journey Starts Here</h2>
            <p>
              Whether you're looking to switch careers, advance in your current role, or learn 
              something new, LearnHub provides structured learning paths to guide your success.
            </p>
            <ul className="path-features">
              <li>
                <CheckCircle size={20} />
                <span>Personalized recommendations based on your goals</span>
              </li>
              <li>
                <CheckCircle size={20} />
                <span>Step-by-step curriculum from basics to advanced</span>
              </li>
              <li>
                <CheckCircle size={20} />
                <span>Practice projects and real-world applications</span>
              </li>
              <li>
                <CheckCircle size={20} />
                <span>Community support and peer collaboration</span>
              </li>
            </ul>
            <Link to="/register" className="btn-path">
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
          <div className="learning-path-visual">
            <div className="path-card">
              <div className="path-card-icon">
                <Star size={60} />
              </div>
              <h3>Premium Learning Experience</h3>
              <div className="path-benefits">
                <div className="path-benefit">
                  <CheckCircle size={18} />
                  <span>Lifetime access</span>
                </div>
                <div className="path-benefit">
                  <CheckCircle size={18} />
                  <span>Mobile learning</span>
                </div>
                <div className="path-benefit">
                  <CheckCircle size={18} />
                  <span>Certificate of completion</span>
                </div>
                <div className="path-benefit">
                  <CheckCircle size={18} />
                  <span>Expert support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="section-badge">STUDENT SUCCESS</span>
          <h2 className="section-title">What Our Students Say</h2>
          <p className="section-description">
            Real stories from learners who transformed their careers
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="author-name">{testimonial.name}</p>
                  <p className="author-course">{testimonial.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="students-cta">
        <div className="cta-content">
          <Sparkles className="cta-icon" size={48} />
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students already transforming their careers with LearnHub</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-cta">
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <Link to="/courses" className="btn-cta-secondary">
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyStudents;
