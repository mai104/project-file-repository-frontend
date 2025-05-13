# API Integration Documentation

## Overview

This document describes the integration of the frontend application with the API endpoints specified in the `api_endpoints.docx` file. The integration involves connecting the API endpoints with the Redux state management system and React components.

## API Services

### API Base Configuration (`api.js`)
- Configures Axios instance with base URL and default headers
- Adds request interceptor for JWT token injection
- Adds response interceptor for authentication error handling

### Authentication Service (`authService.js`)
- Handles user registration, login, and logout
- Manages JWT token storage
- Provides helper methods for authentication status and role checking

### File Service (`fileService.js`)
- Manages file upload, download, and CRUD operations
- Handles file history and search
- Manages folder-specific file operations

### Comment Service (`commentService.js`)
- Handles comment creation, updating, and deletion
- Provides methods for retrieving file comments
- Supports supervisor and student comment filtering

### Folder Service (`folderService.js`)
- Manages folder creation, updating, and deletion
- Handles repository folders and subfolders
- Supports milestone folders as special folders

### Repository Service (`repositoryService.js`)
- Handles repository CRUD operations
- Manages repository ownership and access
- Provides search functionality

### Project Service (`projectService.js`)
- Maps project operations to repository and folder services
- Provides backward compatibility for existing project-based components
- Translates milestone operations to folder operations

## Redux Integration

The following Redux slices have been created or updated to work with the API services:

- `authSlice.js` - Authentication and user management
- `fileSlice.js` - File operations and state
- `commentSlice.js` - Comment management
- `folderSlice.js` - Folder and milestone management
- `repositorySlice.js` - Repository operations
- `projectSlice.js` - Project operations (maps to repositories)

## Next Steps

1. **Testing**
   - Test each API endpoint integration with Postman
   - Verify Redux state updates correctly with API responses
   - Test error handling and edge cases

2. **Component Updates**
   - Update UI components to use the new API structure
   - Ensure file upload components work with the new API
   - Update navigation to reflect the repository/folder structure

3. **Authentication Flow**
   - Verify registration and login work with the backend
   - Test role-based access control
   - Implement proper token refresh mechanism

4. **Migration Strategy**
   - Update existing components gradually to use the new services
   - Maintain backward compatibility where needed
   - Consider creating adapter components for complex transitions

5. **Documentation**
   - Update user documentation to reflect new capabilities
   - Document new API usage patterns for developers
   - Create examples for common operations

## API URLs

Backend API is configured to run at the URL specified in `.env`:

```
REACT_APP_API_BASE_URL=http://localhost:8080
```

## Mock Data

Mock data services have been removed in favor of real API integration. If offline development is needed, consider implementing a more robust mock server solution like MSW (Mock Service Worker).
