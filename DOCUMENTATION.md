# Project File Repository - System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Requirements Implementation](#requirements-implementation)
3. [API Endpoints Required](#api-endpoints-required)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [File Operations](#file-operations)
7. [Project Management](#project-management)
8. [Milestone System](#milestone-system)
9. [Review System](#review-system)
10. [Frontend Components Structure](#frontend-components-structure)

## System Overview

The Project File Repository is a web-based platform designed for software project teams and their academic supervisors to share and manage project files efficiently. It implements a role-based system with two main user types: Students and Supervisors.

### Key Features
- File upload/download functionality
- Project milestone tracking
- Supervisor review system
- File organization by milestone or folder
- File history tracking
- Role-based access control

## Requirements Implementation

### Core Features

1. **File Upload/Download**
   - Implementation: `FileUpload.jsx` component with drag-and-drop interface
   - Progress tracking for uploads
   - Support for multiple file types (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, images)
   - Maximum file size: 10MB

2. **File Description**
   - Each file can have a short description
   - Description field available during upload
   - Editable after upload

3. **File Organization**
   - Files can be organized by milestone
   - Files can be organized by folder (future implementation)
   - Filter and search functionality

4. **Supervisor Review System**
   - Supervisors can add comments to files
   - Rating system (1-5 stars)
   - Review history tracking

5. **Upload History**
   - Complete file history tracking
   - Timestamp for each upload
   - User who uploaded each file

### Target Users
- **Students**: Can upload files, view projects, and access resources
- **Supervisors**: Can review files, manage projects, and provide feedback

## API Endpoints Required

### Authentication Endpoints
```
POST /api/auth/login
Request: { email, password }
Response: { token, user: { id, name, email, role } }

POST /api/auth/register
Request: { name, email, password, role, studentId? }
Response: { token, user }

GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { user }

POST /api/auth/change-password
Request: { currentPassword, newPassword }
Response: { success: true }
```

### Project Endpoints
```
GET /api/projects
Response: [{ id, projectName, shortDescription, status, startDate, endDate, team, milestones }]

GET /api/projects/:id
Response: { project }

POST /api/projects
Request: { projectName, shortDescription, startDate, endDate }
Response: { project }

PUT /api/projects/:id
Request: { projectName, shortDescription, status }
Response: { project }

DELETE /api/projects/:id
Response: { success: true }
```

### File Endpoints
```
POST /api/files/upload
Request: FormData { file, description, milestoneId? }
Response: { file }

GET /api/files
Query: ?projectId=<id>&milestoneId=<id>
Response: [{ id, fileName, fileSize, uploadDate, uploadedBy, description }]

GET /api/files/:id
Response: { file }

GET /api/files/:id/download
Response: File blob

DELETE /api/files/:id
Response: { success: true }

GET /api/files/:id/history
Response: [{ version, uploadDate, uploadedBy, changes }]
```

### Milestone Endpoints
```
POST /api/projects/:projectId/milestones
Request: { milestoneName, description, dueDate }
Response: { milestone }

PUT /api/projects/:projectId/milestones/:id
Request: { milestoneName, description, dueDate, status }
Response: { milestone }

DELETE /api/projects/:projectId/milestones/:id
Response: { success: true }
```

### Review Endpoints
```
POST /api/reviews
Request: { fileId, feedback, rating }
Response: { review }

GET /api/files/:id/reviews
Response: [{ review }]

PUT /api/reviews/:id
Request: { feedback, rating }
Response: { review }

DELETE /api/reviews/:id
Response: { success: true }
```

## Database Schema

### User Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'SUPERVISOR') NOT NULL,
    student_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Project Table
```sql
CREATE TABLE projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(255) NOT NULL,
    short_description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('ACTIVE', 'COMPLETED', 'PENDING') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### File Table
```sql
CREATE TABLE files (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    description TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by BIGINT REFERENCES users(id),
    milestone_id BIGINT REFERENCES milestones(id),
    project_id BIGINT REFERENCES projects(id)
);
```

### Milestone Table
```sql
CREATE TABLE milestones (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    milestone_name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    due_date DATE,
    completion_date DATE,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE') DEFAULT 'NOT_STARTED',
    project_id BIGINT REFERENCES projects(id)
);
```

### Review Table
```sql
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    feedback TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    supervisor_id BIGINT REFERENCES users(id),
    file_id BIGINT REFERENCES files(id)
);
```

## Authentication Flow

1. User enters credentials on login page
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. All subsequent requests include token in Authorization header
6. Protected routes check token validity

## File Operations

### Upload Process
1. User selects files through drag-and-drop or file picker
2. File validation (type, size)
3. Optional description entry
4. Upload progress tracking
5. File stored on server with unique path
6. Database entry created with metadata

### Download Process
1. User clicks download button
2. GET request to `/api/files/:id/download`
3. Server streams file with appropriate headers
4. Browser handles file download

## Project Management

### Project Creation
1. Supervisor creates new project
2. Sets basic information (name, description, dates)
3. Project status automatically set to ACTIVE
4. Empty milestones array initialized

### Project Assignment
1. Students assigned to projects
2. Team members linked through junction table
3. Access rights automatically configured

## Milestone System

### Milestone Creation
1. Milestones added to existing projects
2. Due dates and descriptions set
3. Status tracking (NOT_STARTED, IN_PROGRESS, COMPLETED, OVERDUE)
4. Files can be associated with specific milestones

### Progress Tracking
1. Automatic progress calculation based on completed tasks
2. Visual progress bars in UI
3. Overdue milestones highlighted

## Review System

### Review Process
1. Supervisors access file through project interface
2. Add feedback text and star rating (1-5)
3. Reviews stored with timestamp and supervisor ID
4. Students can view all reviews on their files

## Frontend Components Structure

### Layout Components
- `Navbar.jsx`: Top navigation with user menu, theme toggle, language switcher
- `Sidebar.jsx`: Side navigation with main routes
- `Footer.jsx`: Copyright and useful links

### Feature Components
- `FileUpload.jsx`: Drag-and-drop file upload with progress
- `FileList.jsx`: Sortable, filterable file listing
- `FileCard.jsx`: Individual file display
- `MilestoneCard.jsx`: Milestone information and progress
- `MilestoneList.jsx`: Grid of milestones with filtering
- `ReviewForm.jsx`: Star rating and feedback form
- `ReviewList.jsx`: Display of reviews with ratings

### Page Components
- `Dashboard.jsx`: Overview with stats and recent activity
- `Projects.jsx`: Project listing with filters
- `ProjectDetails.jsx`: Comprehensive project view with tabs
- `Profile.jsx`: User settings and preferences
- `Login.jsx`: Authentication interface

## Security Considerations

1. JWT-based authentication
2. Role-based access control
3. File type validation
4. Size restrictions
5. Sanitization of file names
6. CORS configuration
7. Input validation on all forms

## Performance Optimizations

1. Pagination for file lists
2. Lazy loading for images
3. Caching of static assets
4. Optimistic UI updates
5. Debounced search
6. Progress indicators for all async operations

## Internationalization

1. Arabic and English language support
2. RTL layout for Arabic
3. All text content translatable
4. Date/time localization
5. Number formatting based on locale

## Dark Mode Implementation

1. CSS variables for theming
2. System preference detection
3. User preference persistence
4. Smooth transitions between themes

## Future Enhancements

1. Real-time collaboration features
2. File versioning system
3. Advanced search with filters
4. Email notifications
5. Analytics dashboard
6. Bulk file operations
7. Integration with cloud storage
8. Mobile app development
