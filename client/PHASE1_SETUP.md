# GradeOps Client - Phase 1 Complete ✅

## What's Been Set Up

### 1. **Zustand Stores** (State Management)
- `authStore.js` - User session, JWT, role management
- `examStore.js` - Exam list, current exam context
- `gradeStore.js` - Grades queue, current grade, approval workflow

Location: `src/store/`

### 2. **API Wrapper Layer** (All backend calls)
- `client.js` - Axios instance with JWT interceptor
- `auth.js` - Login, register, logout, getCurrentUser
- `exams.js` - CRUD operations on exams
- `grades.js` - Queue, approve, override grades
- `rubrics.js` - CRUD operations on rubrics

Location: `src/api/`

### 3. **Hooks** (Reusable logic)
- `useWebSocket.js` - Real-time WebSocket connection with reconnect
- `useToast.js` - Toast notifications (success, error, loading)
- `useDarkMode.js` - Dark mode toggle with localStorage persistence

Location: `src/hooks/`

### 4. **Route Guards** (Role-based access control)
- `ProtectedRoute` - Requires authentication
- `InstructorRoute` - Only for instructors
- `TARoute` - Only for TAs

Location: `src/components/RouteGuard.jsx`

### 5. **React Router Setup**
- All routes configured in `App.jsx`
- Instructor routes: `/dashboard`, `/upload`, `/rubric/:examId`, `/export/:examId`
- TA routes: `/review`
- Public routes: `/login`, `/unauthorized`

### 6. **Dark Mode**
- Tailwind dark mode enabled (class strategy)
- Persisted to localStorage
- Can be toggled via `useDarkMode()` hook

### 7. **Environment Configuration**
- `.env.example` - Template for configuration
- `.env` - Local development configuration
- API URL and WebSocket URL configurable

---

## How to Use

### Run the client:
```bash
cd client
npm install  # Only first time
npm run dev
```

Client will run on `http://localhost:5173`

### Using Stores:
```javascript
import { useAuthStore, useExamStore, useGradeStore } from 'src/store'

// In a component:
const { user, token, logout } = useAuthStore()
const { exams, currentExam } = useExamStore()
```

### Using API:
```javascript
import { authAPI, examsAPI, gradesAPI } from 'src/api'

// Example:
const user = await authAPI.login(email, password)
const exams = await examsAPI.listExams()
const grades = await gradesAPI.getQueue(examId)
```

### Using Hooks:
```javascript
import { useToast, useDarkMode, useWebSocket } from 'src/hooks'

// Toast notifications:
const toast = useToast()
toast.success('Grade approved!')

// Dark mode:
const { isDark, toggle } = useDarkMode()

// WebSocket:
useWebSocket((message) => {
  console.log('Real-time update:', message)
})
```

---

## Architecture Summary

```
Client
├── stores/          # Zustand state (auth, exams, grades)
├── api/             # Axios wrappers for backend endpoints
├── hooks/           # Custom React hooks
├── components/      # React components
│   └── RouteGuard.jsx
├── pages/           # Page components (to be built in Phase 2-4)
├── App.jsx          # Main router setup
└── main.jsx         # Entry point
```

---

## Next Steps (Phase 2+)

### Phase 2: Authentication & Navigation
- Login page with Supabase Auth
- Left sidebar navigation
- User profile / logout

### Phase 3: Instructor Features
- Dashboard (exams list + stats)
- Upload page (single + batch)
- Rubric wizard
- Export page

### Phase 4: TA Features
- Dashboard with queue stats
- Card-based grading queue
- Image viewer with zoom/pan
- Grade approval/override interface

---

## Key Features Included

- ✅ JWT authentication with interceptors
- ✅ Role-based route guards (instructor/ta)
- ✅ Real-time WebSocket with auto-reconnect
- ✅ Toast notifications
- ✅ Dark mode support
- ✅ Persistent auth state
- ✅ Axios error handling (auto-logout on 401)
- ✅ Clean API abstraction layer

All dependencies already installed in `package.json`!
