import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Heart, Lightbulb, Globe, Award, TrendingUp, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import './About.css';

const About = () => {
  const values = [
    {
      icon: <Globe size={28} />,
      title: 'Accessibility',
      description: 'Making quality education available to everyone, everywhere'
    },
    {
      icon: <Award size={28} />,
      title: 'Excellence',
      description: 'Maintaining the highest standards in course content and teaching'
    },
    {
      icon: <Lightbulb size={28} />,
      title: 'Innovation',
      description: 'Continuously improving the learning experience with technology'
    },
    {
      icon: <Heart size={28} />,
      title: 'Community',
      description: 'Building strong connections between learners and educators'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'LearnHub Founded',
      description: 'Started with a vision to transform online education'
    },
    {
      year: '2021',
      title: '1,000 Courses',
      description: 'Reached our first major milestone in course offerings'
    },
    {
      year: '2022',
      title: '10K Students',
      description: 'Built a thriving community of learners worldwide'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded to 150+ countries across the globe'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Students' },
    { number: '500+', label: 'Expert Instructors' },
    { number: '150+', label: 'Countries' },
    { number: '1,000+', label: 'Courses' }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-badge">ABOUT US</span>
          <h1 className="about-title">
            Transforming Education for the <span className="gradient-text">Digital Age</span>
          </h1>
          <p className="about-subtitle">
            LearnHub is a global online learning platform empowering millions of learners 
            to achieve their goals through expert-led courses and innovative technology.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision">
        <div className="mission-vision-container">
          <div className="mission-vision-card">
            <div className="mv-icon">
              <Target size={40} />
            </div>
            <h2>Our Mission</h2>
            <p>
              To democratize education by providing accessible, high-quality learning experiences 
              to everyone, everywhere. We believe knowledge should have no boundaries and every 
              individual deserves the opportunity to unlock their full potential through learning.
            </p>
          </div>

          <div className="mission-vision-card mv-card-highlight">
            <div className="mv-icon">
              <TrendingUp size={40} />
            </div>
            <h2>Our Vision</h2>
            <p>
              A world where learning is continuous, engaging, and tailored to individual needs. 
              Through innovative technology and expert instruction, we create a global community 
              of lifelong learners equipped to thrive in an ever-changing world.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="section-header">
          <span className="section-badge">OUR VALUES</span>
          <h2 className="section-title">What Drives Us Forward</h2>
          <p className="section-description">
            Our core values guide every decision we make and shape the experience we create
          </p>
        </div>
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">{value.icon}</div>
              <h3 className="value-title">{value.title}</h3>
              <p className="value-description">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="section-header">
          <span className="section-badge">OUR JOURNEY</span>
          <h2 className="section-title">Milestones That Matter</h2>
          <p className="section-description">
            From humble beginnings to global impact - see how we've grown
          </p>
        </div>
        <div className="timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">
                <CheckCircle size={24} />
              </div>
              <div className="timeline-content">
                <span className="timeline-year">{milestone.year}</span>
                <h3 className="timeline-title">{milestone.title}</h3>
                <p className="timeline-description">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section">
        <div className="community-content">
          <div className="community-text">
            <Users className="community-icon" size={48} />
            <h2>Join Our Global Community</h2>
            <p>
              LearnHub brings together passionate learners and expert educators from around 
              the globe. Our platform facilitates meaningful connections, collaborative learning, 
              and knowledge sharing in a supportive and vibrant environment.
            </p>
            <ul className="community-features">
              <li>
                <CheckCircle size={20} />
                <span>Connect with learners worldwide</span>
              </li>
              <li>
                <CheckCircle size={20} />
                <span>Learn from industry experts</span>
              </li>
              <li>
                <CheckCircle size={20} />
                <span>Share knowledge and experiences</span>
              </li>
              <li>
                <CheckCircle size={20} />
                <span>Collaborate on projects</span>
              </li>
            </ul>
          </div>
          <div className="community-visual">
            <div className="community-card">
              <BookOpen size={60} />
              <h3>Start Learning Today</h3>
              <p>Discover courses that match your goals and interests</p>
              <Link to="/courses" className="btn-community">
                Explore Courses <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of learners transforming their careers with LearnHub</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-cta-primary">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link to="/courses" className="btn-cta-secondary">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
