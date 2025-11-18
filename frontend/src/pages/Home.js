import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, Play, Star, ArrowRight, CheckCircle, Sparkles, Target, Clock } from 'lucide-react';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <BookOpen size={32} />,
      title: 'Diverse Course Library',
      description: 'Access 1,000+ courses across technology, business, design, and more'
    },
    {
      icon: <Users size={32} />,
      title: 'Expert Instructors',
      description: 'Learn from industry leaders with real-world experience'
    },
    {
      icon: <Award size={32} />,
      title: 'Verified Certificates',
      description: 'Earn recognized certificates to boost your professional profile'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Progress Tracking',
      description: 'Monitor your growth with advanced analytics and insights'
    },
    {
      icon: <Clock size={32} />,
      title: 'Learn at Your Pace',
      description: 'Flexible schedules that fit your lifestyle and commitments'
    },
    {
      icon: <Target size={32} />,
      title: 'Career-Focused',
      description: 'Skills that matter in today\'s competitive job market'
    }
  ];

  const benefits = [
    'Lifetime access to course materials',
    'Interactive learning with quizzes',
    'Community support and discussions',
    'Mobile learning on the go',
    'Regular content updates',
    'Money-back guarantee'
  ];

  const stats = [
    { number: '10,000+', label: 'Active Students' },
    { number: '500+', label: 'Expert Instructors' },
    { number: '1,000+', label: 'Quality Courses' },
    { number: '95%', label: 'Success Rate' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Web Developer',
      text: 'LearnHub transformed my career. The courses are practical and taught by industry experts.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Data Scientist',
      text: 'The best online learning platform I\'ve used. The quality of content is outstanding.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      text: 'Highly recommend! The instructors are knowledgeable and the community is supportive.',
      rating: 5
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Start Learning Today</span>
            </div>
            <h1 className="hero-title">
              Transform Your Future with
              <span className="gradient-text"> World-Class Education</span>
            </h1>
            <p className="hero-description">
              Join thousands of learners advancing their careers with expert-led courses.
              Learn new skills, earn certificates, and unlock your full potential with LearnHub.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link to="/courses" className="btn-secondary">
                <Play size={20} />
                Browse Courses
              </Link>
            </div>
            <div className="hero-stats-mini">
              <div className="mini-stat">
                <CheckCircle size={18} />
                <span>No credit card required</span>
              </div>
              <div className="mini-stat">
                <CheckCircle size={18} />
                <span>7-day free trial</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <div className="card-icon">
                <BookOpen size={32} />
              </div>
              <div className="card-info">
                <span className="card-number">1,000+</span>
                <span className="card-label">Courses</span>
              </div>
            </div>
            <div className="hero-card hero-card-2">
              <div className="card-icon">
                <Users size={32} />
              </div>
              <div className="card-info">
                <span className="card-number">10K+</span>
                <span className="card-label">Students</span>
              </div>
            </div>
            <div className="hero-card hero-card-3">
              <div className="card-icon">
                <Award size={32} />
              </div>
              <div className="card-info">
                <span className="card-number">95%</span>
                <span className="card-label">Success</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <span className="section-badge">FEATURES</span>
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <p className="section-description">
            Powerful features designed to enhance your learning experience
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <div className="benefits-text">
            <span className="section-badge">WHY LEARNHUB</span>
            <h2 className="section-title">Learn With Confidence</h2>
            <p className="benefits-intro">
              We provide everything you need for a successful learning journey
            </p>
            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li key={index}>
                  <CheckCircle size={20} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn-text">
              Learn more about us <ArrowRight size={18} />
            </Link>
          </div>
          <div className="benefits-visual">
            <div className="benefits-card">
              <div className="benefits-icon">
                <Star size={48} />
              </div>
              <h3>Premium Quality</h3>
              <p>All courses are carefully curated and regularly updated by experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-header">
          <span className="section-badge">TESTIMONIALS</span>
          <h2 className="section-title">What Our Students Say</h2>
          <p className="section-description">
            Join thousands of satisfied learners who achieved their goals
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
                <div className="author-info">
                  <p className="author-name">{testimonial.name}</p>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <Sparkles className="cta-icon" size={48} />
          <h2 className="cta-title">Ready to Start Your Learning Journey?</h2>
          <p className="cta-description">
            Join LearnHub today and get access to 1,000+ courses. Start your 7-day free trial now.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-cta">
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <Link to="/courses" className="btn-cta-secondary">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Teacher/Student CTA */}
      <section className="dual-cta">
        <div className="dual-cta-card">
          <div className="dual-cta-icon">
            <Users size={40} />
          </div>
          <h3>Teach on LearnHub</h3>
          <p>Share your expertise with learners worldwide and earn while teaching</p>
          <Link to="/why-teachers" className="btn-outline">
            Become an Instructor <ArrowRight size={18} />
          </Link>
        </div>
        <div className="dual-cta-card dual-cta-card-highlight">
          <div className="dual-cta-icon">
            <BookOpen size={40} />
          </div>
          <h3>Learn on LearnHub</h3>
          <p>Discover courses that match your goals and start learning today</p>
          <Link to="/why-students" className="btn-outline">
            Start Learning <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
