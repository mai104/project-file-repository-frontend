# API Documentation for Backend Development

## Authentication APIs

### 1. User Login
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "string",
  "password": "string"
}

Response (200 OK):
{
  "token": "string",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "STUDENT|SUPERVISOR",
    "studentId": "string|null"
  }
}

Error Response (401 Unauthorized):
{
  "message": "Invalid email or password"
}
```

### 2. User Registration
```http
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "STUDENT|SUPERVISOR",
  "studentId": "string|null" // Required if role is STUDENT
}

Response (201 Created):
{
  "token": "string",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "STUDENT|SUPERVISOR",
    "studentId": "string|null"
  }
}

Error Response (400 Bad Request):
{
  "message": "Email already exists"
}
```

### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response (200 OK):
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "STUDENT|SUPERVISOR",
  "studentId": "string|null"
}
```

## Project APIs

### 1. List All Projects
```http
GET /api/projects
Authorization: Bearer <token>

Response (200 OK):
[
  {
    "id": "number",
    "projectName": "string",
    "shortDescription": "string",
    "status": "ACTIVE|COMPLETED|PENDING",
    "startDate": "date",
    "endDate": "date",
    "team": {
      "members": ["number[]"]
    },
    "milestones": ["object[]"]
  }
]
```

### 2. Get Project Details
```http
GET /api/projects/:id
Authorization: Bearer <token>

Response (200 OK):
{
  "id": "number",
  "projectName": "string",
  "shortDescription": "string",
  "status": "ACTIVE|COMPLETED|PENDING",
  "startDate": "date",
  "endDate": "date",
  "supervisor": {
    "id": "number",
    "name": "string",
    "email": "string"
  },
  "team": {
    "members": ["object[]"]
  },
  "milestones": ["object[]"],
  "files": ["object[]"]
}
```

### 3. Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "projectName": "string",
  "shortDescription": "string",
  "startDate": "date",
  "endDate": "date"
}

Response (201 Created):
{
  "id": "number",
  "projectName": "string",
  "shortDescription": "string",
  "status": "ACTIVE",
  "startDate": "date",
  "endDate": "date"
}
```

## File APIs

### 1. Upload File
```http
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Request Body:
{
  "file": "File",
  "description": "string",
  "milestoneId": "number|null",
  "projectId": "number"
}

Response (201 Created):
{
  "id": "number",
  "fileName": "string",
  "fileSize": "number",
  "fileType": "string",
  "description": "string",
  "uploadDate": "datetime",
  "uploadedBy": {
    "id": "number",
    "name": "string"
  },
  "milestoneId": "number|null",
  "projectId": "number"
}
```

### 2. List Files
```http
GET /api/files?projectId=<id>&milestoneId=<id>
Authorization: Bearer <token>

Response (200 OK):
[
  {
    "id": "number",
    "fileName": "string",
    "fileSize": "number",
    "fileType": "string",
    "description": "string",
    "uploadDate": "datetime",
    "uploadedBy": {
      "id": "number",
      "name": "string"
    },
    "milestoneId": "number|null",
    "projectId": "number"
  }
]
```

### 3. Download File
```http
GET /api/files/:id/download
Authorization: Bearer <token>

Response (200 OK):
Binary file data with appropriate headers:
Content-Type: <file-mime-type>
Content-Disposition: attachment; filename="<filename>"
```

## Milestone APIs

### 1. Create Milestone
```http
POST /api/projects/:projectId/milestones
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "milestoneName": "string",
  "description": "string",
  "dueDate": "date"
}

Response (201 Created):
{
  "id": "number",
  "milestoneName": "string",
  "description": "string",
  "dueDate": "date",
  "status": "NOT_STARTED",
  "projectId": "number"
}
```

### 2. Update Milestone
```http
PUT /api/projects/:projectId/milestones/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "milestoneName": "string",
  "description": "string",
  "dueDate": "date",
  "status": "NOT_STARTED|IN_PROGRESS|COMPLETED|OVERDUE"
}

Response (200 OK):
{
  "id": "number",
  "milestoneName": "string",
  "description": "string",
  "dueDate": "date",
  "status": "string",
  "projectId": "number"
}
```

## Review APIs

### 1. Add Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "fileId": "number",
  "feedback": "string",
  "rating": "number" // 1-5
}

Response (201 Created):
{
  "id": "number",
  "feedback": "string",
  "rating": "number",
  "createdAt": "datetime",
  "supervisor": {
    "id": "number",
    "name": "string"
  },
  "fileId": "number"
}
```

### 2. Get File Reviews
```http
GET /api/files/:id/reviews
Authorization: Bearer <token>

Response (200 OK):
[
  {
    "id": "number",
    "feedback": "string",
    "rating": "number",
    "createdAt": "datetime",
    "supervisor": {
      "id": "number",
      "name": "string"
    }
  }
]
```

## Error Handling

All endpoints should return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error response format:
```json
{
  "message": "string",
  "errors": {} // Optional validation errors
}
```

## Authentication Requirements

All endpoints except login and register require Bearer token authentication:
```
Authorization: Bearer <jwt_token>
```

JWT token payload should include:
```json
{
  "userId": "number",
  "role": "STUDENT|SUPERVISOR",
  "email": "string"
}
```

## File Upload Configuration

Server should be configured to:
- Accept multipart/form-data
- Maximum file size: 10MB
- Supported file types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, images
- Store files in secure location with unique names
- Generate unique file paths to prevent overwrites

## CORS Configuration

Enable CORS for:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Database Indexes

Recommended indexes for performance:
- users.email (unique)
- files.project_id
- files.milestone_id
- files.uploaded_by
- milestones.project_id
- reviews.file_id
- reviews.supervisor_id

## Security Considerations

1. Password hashing using bcrypt
2. JWT token expiration (recommended: 24 hours)
3. File upload validation (type, size)
4. SQL injection prevention
5. Input sanitization
6. File access authorization checks
