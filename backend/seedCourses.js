const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config();

const sampleCourses = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Master modern web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and deploy them to production. Perfect for beginners looking to start a career in web development.',
    category: 'Programming',
    level: 'Beginner',
    price: 89.99,
    duration: 40,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    learningOutcomes: [
      'Build responsive websites with HTML5 and CSS3',
      'Master JavaScript ES6+ features',
      'Create dynamic web apps with React',
      'Build REST APIs with Node.js and Express',
      'Work with MongoDB databases',
      'Deploy applications to the cloud'
    ],
    requirements: [
      'Basic computer skills',
      'No programming experience required',
      'A computer with internet connection'
    ],
    status: 'published',
    isActive: true,
    rating: 4.8,
    totalReviews: 1250
  },
  {
    title: 'Advanced Python Programming & Data Science',
    description: 'Take your Python skills to the next level. Learn advanced concepts, data structures, algorithms, and dive deep into data science with pandas, NumPy, and machine learning with scikit-learn.',
    category: 'Programming',
    level: 'Advanced',
    price: 129.99,
    duration: 50,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    learningOutcomes: [
      'Master advanced Python programming concepts',
      'Work with data using pandas and NumPy',
      'Build machine learning models',
      'Implement advanced algorithms',
      'Create data visualizations',
      'Handle big data efficiently'
    ],
    requirements: [
      'Basic Python knowledge required',
      'Understanding of programming fundamentals',
      'Familiarity with basic mathematics'
    ],
    status: 'published',
    isActive: true,
    rating: 4.9,
    totalReviews: 890
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'Learn the complete process of designing beautiful and user-friendly interfaces. Master Figma, design principles, user research, prototyping, and create a stunning portfolio.',
    category: 'Design',
    level: 'Intermediate',
    price: 79.99,
    duration: 30,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    learningOutcomes: [
      'Design beautiful user interfaces',
      'Master Figma design tool',
      'Conduct user research and testing',
      'Create interactive prototypes',
      'Build a professional portfolio',
      'Understand design systems'
    ],
    requirements: [
      'No design experience needed',
      'Creative mindset',
      'Access to Figma (free version works)'
    ],
    status: 'published',
    isActive: true,
    rating: 4.7,
    totalReviews: 670
  },
  {
    title: 'Digital Marketing & SEO Complete Guide',
    description: 'Master digital marketing from scratch. Learn SEO, social media marketing, content marketing, email marketing, Google Ads, and analytics to grow any business online.',
    category: 'Marketing',
    level: 'Beginner',
    price: 69.99,
    duration: 25,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    learningOutcomes: [
      'Master SEO techniques',
      'Run effective social media campaigns',
      'Create content marketing strategies',
      'Use Google Analytics and Ads',
      'Build email marketing funnels',
      'Measure and optimize ROI'
    ],
    requirements: [
      'No marketing experience needed',
      'Basic internet knowledge',
      'Willingness to learn and practice'
    ],
    status: 'published',
    isActive: true,
    rating: 4.6,
    totalReviews: 1420
  },
  {
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications for iOS and Android using React Native. Learn to create beautiful, performant apps and publish them to app stores.',
    category: 'Programming',
    level: 'Intermediate',
    price: 99.99,
    duration: 35,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    learningOutcomes: [
      'Build native mobile apps with React Native',
      'Master mobile UI/UX patterns',
      'Integrate with device features',
      'Handle data and state management',
      'Publish apps to App Store and Play Store',
      'Optimize app performance'
    ],
    requirements: [
      'Basic JavaScript and React knowledge',
      'Understanding of mobile app concepts',
      'A computer for development'
    ],
    status: 'published',
    isActive: true,
    rating: 4.8,
    totalReviews: 540
  },
  {
    title: 'Business Strategy & Entrepreneurship',
    description: 'Learn how to build and grow a successful business. Master business planning, financial management, marketing strategies, leadership, and scaling operations.',
    category: 'Business',
    level: 'Intermediate',
    price: 89.99,
    duration: 28,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    learningOutcomes: [
      'Create comprehensive business plans',
      'Understand financial management',
      'Develop effective strategies',
      'Master leadership skills',
      'Scale business operations',
      'Navigate competitive markets'
    ],
    requirements: [
      'Basic business understanding helpful',
      'Entrepreneurial mindset',
      'Commitment to learning'
    ],
    status: 'published',
    isActive: true,
    rating: 4.7,
    totalReviews: 780
  }
];

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Find an admin or teacher user to assign as instructor
    let instructor = await User.findOne({ role: 'teacher' });
    
    if (!instructor) {
      instructor = await User.findOne({ role: 'admin' });
    }

    if (!instructor) {
      console.log('No teacher or admin user found. Creating a sample teacher...');
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('teacher123', salt);
      
      instructor = await User.create({
        name: 'John Smith',
        email: 'teacher@learnhub.com',
        password: hashedPassword,
        role: 'teacher',
        isActive: true,
        bio: 'Experienced educator passionate about helping students succeed.'
      });
      console.log('Sample teacher created:', instructor.email);
    }

    // Clear existing sample courses (optional)
    await Course.deleteMany({ title: { $in: sampleCourses.map(c => c.title) } });
    console.log('Cleared existing sample courses...');

    // Add instructor to each course
    const coursesWithInstructor = sampleCourses.map(course => ({
      ...course,
      instructor: instructor._id
    }));

    // Insert sample courses
    const createdCourses = await Course.insertMany(coursesWithInstructor);
    console.log(`${createdCourses.length} sample courses created successfully!`);

    createdCourses.forEach(course => {
      console.log(`- ${course.title} (${course.category} - ${course.level})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
