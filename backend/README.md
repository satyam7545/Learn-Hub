# LearnHub Backend API

Backend server for LearnHub - Educational Platform

## Features

- RESTful API architecture
- JWT-based authentication
- Role-based authorization (Student, Teacher, Admin)
- MongoDB database with Mongoose ODM
- Express.js web framework
- Password encryption with bcryptjs
- Input validation
- Error handling middleware

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learnhub
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "teacher"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Course Endpoints

#### Get All Courses
```http
GET /api/courses?category=Programming&level=Beginner&search=react
```

#### Get Single Course
```http
GET /api/courses/:id
```

#### Create Course (Teacher Only)
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "React Fundamentals",
  "description": "Learn React from scratch",
  "category": "Programming",
  "level": "Beginner",
  "price": 49.99,
  "duration": 10,
  "learningOutcomes": ["Build React apps", "Understand components"],
  "requirements": ["Basic JavaScript knowledge"]
}
```

### Enrollment Endpoints

#### Enroll in Course (Student Only)
```http
POST /api/enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id_here"
}
```

#### Get My Courses (Student Only)
```http
GET /api/enrollments/my-courses
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get Platform Stats
```http
GET /api/admin/stats
Authorization: Bearer <admin_token>
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Approve/Reject Course
```http
PUT /api/admin/courses/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "published" // or "rejected"
}
```

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student|teacher|admin),
  avatar: String,
  bio: String,
  isActive: Boolean,
  createdAt: Date
}
```

### Course Model
```javascript
{
  title: String,
  description: String,
  instructor: ObjectId (ref: User),
  category: String,
  level: String,
  thumbnail: String,
  price: Number,
  duration: Number,
  videos: [{
    title: String,
    description: String,
    videoUrl: String,
    duration: Number,
    order: Number,
    isPreview: Boolean
  }],
  requirements: [String],
  learningOutcomes: [String],
  enrollmentCount: Number,
  rating: Number,
  reviewCount: Number,
  status: String (draft|pending|published|rejected),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollment Model
```javascript
{
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  progress: Number,
  completedVideos: [ObjectId],
  lastAccessedVideo: ObjectId,
  enrolledAt: Date,
  completedAt: Date,
  certificateIssued: Boolean
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/learnhub |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| NODE_ENV | Environment mode | development |

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - CORS middleware
- dotenv - Environment variables
- express-validator - Input validation
- morgan - HTTP request logger

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error responses follow this format:
```json
{
  "message": "Error message here",
  "stack": "Stack trace (only in development)"
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control
- Input validation and sanitization
- CORS enabled for cross-origin requests

## Development

For development, use:
```bash
npm run dev
```

This will start the server with nodemon for auto-reloading on file changes.

## Testing

To test the API, you can use:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Frontend application

## License

ISC
