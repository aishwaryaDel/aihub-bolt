# Role-Based Access Control Implementation

## Overview
The application now implements role-based access control with two user roles:
- **admin**: Full access to create and update use cases
- **viewer**: Read-only access to view use cases

## Features Implemented

### 1. Authentication Context (`src/contexts/AuthContext.tsx`)
- Manages user session state
- Stores user information and JWT token
- Provides helper functions:
  - `isAdmin()`: Returns true if user role is 'admin'
  - `isViewer()`: Returns true if user role is 'viewer'
  - `isAuthenticated()`: Returns true if user is logged in
  - `login(token, user)`: Stores authentication data
  - `logout()`: Clears authentication data

### 2. Role-Based UI Rendering

#### Admin Users
- Can see "New Use Case" button in the header
- Can create new use cases via the NewUseCaseModal
- Future: Can edit/update existing use cases

#### Viewer Users
- "New Use Case" button is hidden
- Can only view existing use cases
- Cannot create or modify use cases

### 3. Logout Functionality
- "Back to Home" button now triggers logout
- Clears user session and returns to landing page
- Secure session management

## Authentication Flow

1. User clicks "Start your AI Journey" on landing page
2. Login modal appears
3. User enters credentials (email + password)
4. Password is encrypted with bcrypt on frontend
5. Backend validates credentials and returns JWT token + user data
6. Frontend stores token and user info in AuthContext
7. User is redirected to overview page

## Logout Flow

1. User clicks "Back to Home" button
2. AuthContext.logout() is called
3. User session is cleared
4. User is redirected to landing page

## Usage Example

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div>
      {isAdmin() && (
        <button>Admin Only Action</button>
      )}
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Database Schema
The users table includes a `role` column that stores the user's role:
- Values: 'admin' or 'viewer'
- Used by backend to return role in login response
- Frontend uses this role for access control

## Security Notes
- Passwords are hashed with bcrypt before transmission
- JWT tokens are used for session management
- Role is validated on backend and returned with user data
- Frontend enforces UI-level access control
- Backend should also enforce role-based permissions on API endpoints
