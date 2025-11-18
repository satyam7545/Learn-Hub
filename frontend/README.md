# LearnHub Frontend

React-based frontend application for LearnHub - Educational Platform

## Features

- Modern, responsive UI with dark theme
- React Router for navigation
- Context API for state management
- JWT-based authentication
- Role-based dashboards (Student, Teacher, Admin)
- Course browsing and enrollment
- Progress tracking
- Real-time updates

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`
Launches the test runner in interactive watch mode.

## Project Structure

```
src/
├── components/
│   ├── Navbar.js           # Main navigation bar
│   ├── Navbar.css
│   └── PrivateRoute.js     # Protected route wrapper
├── context/
│   └── AuthContext.js      # Authentication context & provider
├── pages/
│   ├── Home.js             # Landing page
│   ├── Home.css
│   ├── About.js            # About page
│   ├── About.css
│   ├── WhyTeachers.js      # Teachers benefits page
│   ├── WhyTeachers.css
│   ├── WhyStudents.js      # Students benefits page
│   ├── WhyStudents.css
│   ├── Login.js            # Login page
│   ├── Register.js         # Registration page
│   ├── Auth.css            # Shared auth styles
│   ├── CoursesPage.js      # Courses listing
│   ├── CoursesPage.css
│   ├── CourseDetail.js     # Course details
│   ├── CourseDetail.css
│   ├── StudentDashboard.js # Student dashboard
│   ├── StudentDashboard.css
│   ├── TeacherDashboard.js # Teacher dashboard
│   ├── TeacherDashboard.css
│   ├── AdminDashboard.js   # Admin dashboard
│   └── AdminDashboard.css
├── utils/
│   └── api.js              # Axios API client
├── App.js                  # Main app component with routes
├── index.js                # App entry point
└── index.css               # Global styles & theme variables
```

## Routing

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Home | Public |
| `/about` | About | Public |
| `/why-teachers` | WhyTeachers | Public |
| `/why-students` | WhyStudents | Public |
| `/courses` | CoursesPage | Public |
| `/courses/:id` | CourseDetail | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/student/dashboard` | StudentDashboard | Student only |
| `/teacher/dashboard` | TeacherDashboard | Teacher only |
| `/admin/dashboard` | AdminDashboard | Admin only |

## Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is sent with each API request via Axios interceptor
4. AuthContext provides user state throughout the app
5. PrivateRoute protects role-specific routes

## State Management

### AuthContext
Provides authentication state and methods:
- `user` - Current user object
- `loading` - Loading state
- `isAuthenticated` - Authentication status
- `login(email, password)` - Login method
- `register(name, email, password, role)` - Registration method
- `logout()` - Logout method

Usage:
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  // ...
}
```

## Styling

The app uses CSS modules with a dark theme. Theme variables are defined in `index.css`:

```css
:root {
  --bg-primary: #0a0e27;
  --bg-secondary: #151932;
  --bg-tertiary: #1e2340;
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  --accent-primary: #6366f1;
  --accent-secondary: #8b5cf6;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

## API Integration

API client is configured in `utils/api.js`:
```javascript
import api from '../utils/api';

// Example usage
const response = await api.get('/courses');
const course = await api.post('/courses', courseData);
```

## Components

### Navbar
Main navigation component with:
- Logo and branding
- Navigation links
- Authentication status
- Responsive mobile menu

### PrivateRoute
Protected route component that:
- Checks authentication status
- Verifies user role
- Redirects unauthorized users
- Shows loading state

## Pages Overview

### Public Pages
- **Home**: Landing page with features and CTAs
- **About**: Platform information and mission
- **WhyTeachers**: Benefits for teachers
- **WhyStudents**: Benefits for students
- **Courses**: Browse and search courses
- **CourseDetail**: Detailed course information

### Student Dashboard
- View enrolled courses
- Track learning progress
- Continue learning
- Browse new courses

### Teacher Dashboard
- Create and manage courses
- View student enrollment
- Track course performance
- Edit course content

### Admin Dashboard
- Platform statistics
- User management
- Course approval/rejection
- System monitoring

## Responsive Design

The app is fully responsive with breakpoints:
- Desktop: > 768px
- Tablet: 768px - 1024px
- Mobile: < 768px

## Icons

Icons are provided by [Lucide React](https://lucide.dev/):
```javascript
import { BookOpen, Users, Star } from 'lucide-react';
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting with React.lazy (can be implemented)
- Image optimization
- CSS minification
- Production build optimization

## Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `build` folder.

### Deploy to Netlify
1. Build the project
2. Deploy the `build` folder
3. Set environment variables in Netlify dashboard
4. Configure redirects for React Router

### Deploy to Vercel
1. Import project from Git
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Add environment variables

## Troubleshooting

### API Connection Issues
- Check REACT_APP_API_URL in `.env`
- Ensure backend server is running
- Verify CORS configuration

### Authentication Issues
- Clear localStorage
- Check JWT token expiration
- Verify API endpoints

### Styling Issues
- Clear browser cache
- Check CSS import order
- Verify CSS variable names

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC
