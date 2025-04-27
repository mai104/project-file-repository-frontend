# Frontend Structure Documentation

## Project Structure Overview

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── i18n/              # Internationalization files
├── pages/             # Page components
├── services/          # API service layer
├── store/             # Redux store and slices
├── App.js             # Main application component
├── index.js           # Entry point
└── index.css          # Global styles
```

## Component Descriptions

### Layout Components

#### 1. Navbar.jsx
- Purpose: Top navigation bar
- Features:
  - User profile dropdown
  - Theme toggle (dark/light)
  - Language switcher (Arabic/English)
  - Notification bell with unread count
  - Mobile responsive menu

#### 2. Sidebar.jsx
- Purpose: Side navigation menu
- Features:
  - Role-based menu items
  - Active route highlighting
  - Collapsible on mobile
  - Admin-only sections for supervisors

#### 3. Footer.jsx
- Purpose: Page footer
- Contains copyright and links

### Authentication Components

#### 1. LoginForm.jsx
- Purpose: User login interface
- Features:
  - Email and password fields
  - Form validation
  - Remember me functionality
  - Loading states
  - Error handling

#### 2. RegisterForm.jsx
- Purpose: New user registration
- Features:
  - Role selection (Student/Supervisor)
  - Conditional student ID field
  - Password confirmation
  - Form validation

#### 3. PrivateRoute.jsx
- Purpose: Route protection
- Features:
  - Authentication check
  - Role-based access control
  - Redirect to login when unauthorized

### File Management Components

#### 1. FileUpload.jsx
- Purpose: File upload interface
- Features:
  - Drag and drop support
  - Multiple file selection
  - File type and size validation
  - Upload progress tracking
  - Description field for each file

#### 2. FileList.jsx
- Purpose: Display list of files
- Features:
  - Search and filter functionality
  - Sort by name, size, date
  - Download and delete actions
  - File metadata display

#### 3. FileCard.jsx
- Purpose: Individual file display
- Features:
  - File icon based on type
  - Size and date information
  - Download button
  - User information

### Project Components

#### 1. ProjectForm.jsx
- Purpose: Create/edit project
- Features:
  - Form validation
  - Date pickers
  - Rich text description

### Milestone Components

#### 1. MilestoneCard.jsx
- Purpose: Display milestone information
- Features:
  - Status indicator
  - Progress bar
  - Due date display
  - File count

#### 2. MilestoneList.jsx
- Purpose: List all milestones
- Features:
  - Filter by status
  - Search functionality
  - Create milestone button

#### 3. MilestoneModal.jsx
- Purpose: Create/edit milestone
- Features:
  - Form validation
  - Status selection
  - Date picker

### Review Components

#### 1. ReviewForm.jsx
- Purpose: Submit reviews
- Features:
  - Star rating system (1-5)
  - Feedback textarea
  - Form validation

#### 2. ReviewList.jsx
- Purpose: Display reviews
- Features:
  - Average rating calculation
  - Review history
  - Supervisor information

## State Management

### Redux Slices

#### 1. authSlice.js
- State: user, token, isLoading, error
- Actions: login, register, logout, getCurrentUser

#### 2. fileSlice.js
- State: files, currentFile, isLoading, error, uploadProgress
- Actions: uploadFile, fetchFiles, deleteFile

#### 3. projectSlice.js
- State: projects, currentProject, isLoading, error, filter
- Actions: fetchProjects, createProject, updateProject, deleteProject

#### 4. notificationSlice.js
- State: notifications, unreadCount, isLoading, error
- Actions: fetchNotifications, markAsRead, clearAll

### Context Providers

#### 1. ThemeContext.js
- Purpose: Manage dark/light theme
- Features:
  - System preference detection
  - User preference persistence
  - Theme toggle function

#### 2. LanguageContext.js
- Purpose: Manage language and RTL
- Features:
  - Language switcher
  - RTL layout support
  - Font switching
  - Translation integration

## Service Layer

### 1. api.js
- Purpose: Axios instance configuration
- Features:
  - Base URL setup
  - Authentication interceptor
  - Error handling
  - Development mode support

### 2. authService.js
- Purpose: Authentication-related API calls
- Features:
  - Login/logout
  - Registration
  - Token management
  - Mock data for development

### 3. fileService.js
- Purpose: File-related API calls
- Features:
  - File upload with progress
  - File download
  - File listing and search
  - Mock data for development

### 4. projectService.js
- Purpose: Project-related API calls
- Features:
  - CRUD operations
  - Milestone management
  - Team management
  - Mock data for development

### 5. notificationService.js
- Purpose: Notification-related API calls
- Features:
  - Fetch notifications
  - Mark as read
  - Clear all
  - Mock data for development

## Styling System

### 1. Tailwind Configuration
- Custom color palette
- Dark mode support
- Arabic font support
- Custom animations
- Form styling plugins

### 2. Global Styles (index.css)
- Base styles
- Component classes
- Custom utilities
- RTL support
- Dark mode transitions

## Internationalization

### 1. Translation Files
- en.json: English translations
- ar.json: Arabic translations

### 2. i18n Configuration
- Language detection
- Fallback language
- Translation loading

## Router Structure

```
/                   # Dashboard (protected)
/login             # Login page
/register          # Registration page
/projects          # Projects list (protected)
/projects/:id      # Project details (protected)
/files             # Files page (protected)
/profile           # User profile (protected)
/settings          # User settings (protected)
```

## Development Features

### 1. Mock Data System
- Simulated API responses
- Configurable delays
- Error simulation
- Data persistence in localStorage

### 2. Development Tools
- React DevTools integration
- Redux DevTools support
- Error boundary components
- Loading state placeholders

## Performance Optimizations

### 1. Code Splitting
- Lazy loading for routes
- Dynamic imports for heavy components

### 2. State Management
- Memoized selectors
- Optimistic updates
- Debounced API calls

### 3. UI Optimizations
- Virtualized lists for large datasets
- Skeleton loading states
- Image lazy loading
