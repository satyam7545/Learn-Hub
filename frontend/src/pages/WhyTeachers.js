import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Users, Globe, Award, BarChart, BookOpen, TrendingUp, Clock, Video, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import './WhyTeachers.css';

const WhyTeachers = () => {
  const benefits = [
    {
      icon: <DollarSign size={32} />,
      title: 'Earn Revenue',
      description: 'Monetize your expertise with competitive earnings. Set your own pricing and earn on every enrollment.'
    },
    {
      icon: <Globe size={32} />,
      title: 'Global Reach',
      description: 'Connect with millions of students worldwide and expand your impact beyond geographical boundaries.'
    },
    {
      icon: <Users size={32} />,
      title: 'Build Your Brand',
      description: 'Establish yourself as an industry expert and grow your professional reputation globally.'
    },
    {
      icon: <BarChart size={32} />,
      title: 'Track Analytics',
      description: 'Access comprehensive insights about student engagement, course performance, and revenue metrics.'
    },
    {
      icon: <BookOpen size={32} />,
      title: 'Creative Freedom',
      description: 'Design courses your way with complete control over content, structure, and teaching methodology.'
    },
    {
      icon: <Award size={32} />,
      title: 'Recognition',
      description: 'Build credibility with ratings, reviews, and certifications from satisfied students.'
    }
  ];

  const features = [
    {
      icon: <Video size={24} />,
      title: 'Easy Course Creation',
      description: 'Intuitive tools to upload videos, create quizzes, and structure your curriculum'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Marketing Support',
      description: 'We promote your courses to our growing community of learners'
    },
    {
      icon: <DollarSign size={24} />,
      title: 'Flexible Pricing',
      description: 'Set your own prices and offer promotions to maximize enrollment'
    },
    {
      icon: <Clock size={24} />,
      title: 'Lifetime Hosting',
      description: 'Your courses stay online permanently with unlimited bandwidth'
    }
  ];

  const stats = [
    { number: '$50K+', label: 'Avg. Annual Earnings' },
    { number: '500+', label: 'Active Instructors' },
    { number: '10K+', label: 'Students Reached' },
    { number: '4.8/5', label: 'Instructor Rating' }
  ];

  const steps = [
    {
      number: '1',
      title: 'Sign Up Free',
      description: 'Create your instructor account in minutes'
    },
    {
      number: '2',
      title: 'Create Your Course',
      description: 'Upload videos, add materials, and design curriculum'
    },
    {
      number: '3',
      title: 'Publish & Earn',
      description: 'Go live and start earning from student enrollments'
    }
  ];

  return (
    <div className="why-teachers-page">
      {/* Hero Section */}
      <section className="teachers-hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
        </div>
        <div className="teachers-hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>For Educators</span>
          </div>
          <h1 className="teachers-title">
            Share Your Knowledge<br />
            <span className="gradient-text">Inspire the World</span>
          </h1>
          <p className="teachers-subtitle">
            Join 500+ expert instructors earning revenue while making a global impact. 
            Turn your expertise into engaging courses and reach thousands of eager learners.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Start Teaching Today
              <ArrowRight size={20} />
            </Link>
            <Link to="/courses" className="btn-secondary">
              View Sample Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="teachers-stats">
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
          <span className="section-badge">WHY TEACH WITH US</span>
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <p className="section-description">
            We provide all the tools and support you need to create and sell successful courses
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

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <div className="features-text">
            <span className="section-badge">PLATFORM FEATURES</span>
            <h2 className="section-title">Powerful Tools for Instructors</h2>
            <p className="features-intro">
              Our platform is designed with instructors in mind, providing everything you need 
              to create, manage, and monetize your courses effectively.
            </p>
            <ul className="features-list">
              {features.map((feature, index) => (
                <li key={index}>
                  <div className="feature-icon-small">{feature.icon}</div>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="features-visual">
            <div className="features-card">
              <div className="card-icon">
                <BookOpen size={48} />
              </div>
              <h3>Start Creating Today</h3>
              <p>Join our community of successful instructors and begin your teaching journey</p>
              <ul className="checklist">
                <li><CheckCircle size={18} /> No upfront costs</li>
                <li><CheckCircle size={18} /> Flexible schedule</li>
                <li><CheckCircle size={18} /> Full support team</li>
                <li><CheckCircle size={18} /> Instant payouts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <span className="section-badge">HOW IT WORKS</span>
          <h2 className="section-title">Start Teaching in 3 Simple Steps</h2>
          <p className="section-description">
            From account creation to earning revenue - it's easier than you think
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="teachers-cta">
        <div className="cta-content">
          <Sparkles className="cta-icon" size={48} />
          <h2>Ready to Start Your Teaching Journey?</h2>
          <p>Join thousands of instructors who are already making an impact and earning revenue on LearnHub</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-cta">
              Become an Instructor
              <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="btn-cta-secondary">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyTeachers;
