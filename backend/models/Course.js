const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 2000
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Programming',
      'Design',
      'Business',
      'Marketing',
      'Photography',
      'Music',
      'Health & Fitness',
      'Personal Development',
      'Other'
    ]
  },
  level: {
    type: String,
    required: [true, 'Please add a level'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  thumbnail: {
    type: String,
    default: 'default-course.jpg'
  },
  price: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // in hours
    default: 0
  },
  videos: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    videoUrl: {
      type: String,
      required: true
    },
    duration: Number, // in minutes
    order: Number,
    isPreview: {
      type: Boolean,
      default: false
    }
  }],
  requirements: [String],
  learningOutcomes: [String],
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'rejected'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', courseSchema);
