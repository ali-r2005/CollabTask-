
# Task Management System

A modern microservices-based task management system with authentication, project management, and task tracking capabilities.

## Table of Contents
- [Overview](#Overview)
- [Architecture](#Architecture)
- [Services](#Services)
  - [Authentication-Service](#Authentication-Service-Port-3001)
  - [Project-Service](#Project-Service-Port-3003)
  - [Task-Service](#Task-Service-Port-3004)
- [Technologies Used](#Technologies-Used)
- [Setup Instructions](#Setup-Instructions)
  - [Prerequisites](#Prerequisites)
  - [Installation](#Installation)
- [API Documentation](#API-Documentation)
- [Authentication Flow](#Authentication-Flow)
- [Middleware](#Middleware)
- [Postman Collections](#Postman-Collections)

## Overview

This project is a complete task management solution built using a microservices architecture. It consists of three main services:

1. **Authentication Service** - Handles user registration, login, and user management
2. **Project Service** - Manages projects, their lifecycle, and categorization
3. **Task Service** - Handles task creation, assignment, status updates, and attachments

Each service operates independently with its own database connections while communicating with each other through REST APIs.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Auth Service   │◄────►  Project Service│◄────►   Task Service  │
│    (Port 3001)  │     │    (Port 3003)  │     │    (Port 3004)  │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
    ┌─────────────────────────────────────────────────────────┐
    │                        MongoDB                          │
    └─────────────────────────────────────────────────────────┘
```

## Services

### Authentication Service (Port 3001)

Handles all user-related operations including:
- User registration and login
- JWT-based authentication
- User management (CRUD operations)
- Role-based access control (admin/user)
- Account blocking functionality

### Project Service (Port 3003)

Manages all project-related operations:
- Project creation and management
- Project categorization
- Project status tracking
- Project search and filtering

### Task Service (Port 3004)

Handles task management functionality:
- Task creation and assignment
- Task status tracking
- Task prioritization
- File attachments
- Task commenting
- Deadline management and reminders

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **File Handling**: Multer
- **HTTP Client**: Axios for inter-service communication
- **Environment Variables**: dotenv for configuration

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-management-system.git
   cd task-management-system
   ```

2. Set up environment variables:
   Create a `.env` file in each service directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=service_port_number
   JWT_SECRET=your_jwt_secret_key
   ```

3. Install dependencies for each service:
   ```bash
   # Auth Service
   cd auth-service
   npm install
   
   # Project Service
   cd ../project-service
   npm install
   
   # Task Service
   cd ../task-service
   npm install
   ```

4. Start each service:
   ```bash
   # In separate terminal windows
   
   # Auth Service
   cd auth-service
   npm start
   
   # Project Service
   cd project-service
   npm start
   
   # Task Service
   cd task-service
   npm start
   ```

## API Documentation

### Authentication Service

#### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login user | No |
| GET | /auth/users | Get all users | Yes (Token) |
| GET | /auth/user/:id | Get user by ID | Yes (Admin) |
| PUT | /auth/user/:id | Update user | Yes (Admin) |
| DELETE | /auth/user/:id | Delete user | Yes (Admin) |
| PUT | /auth/block/:id | Block/unblock user | Yes (Admin) |

### Project Service

#### Project Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | /projects | Get all projects with optional filters | Yes (Token) |
| POST | /projects | Create new project | Yes (Token) |
| PUT | /projects/:id | Update project | Yes (Token/Admin) |
| DELETE | /projects/:id | Delete project | Yes (Token) |
| POST | /projects/:id/categories | Add category to project | Yes (Token/Admin) |

### Task Service

#### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | /tasks | Get all tasks with optional filters | Yes (Token) |
| GET | /tasks/:id | Get task by ID | Yes (Token) |
| POST | /tasks | Create new task | Yes (Token) |
| PUT | /tasks/:id | Update task | Yes (Token/Admin) |
| DELETE | /tasks/:id | Delete task | Yes (Token/Admin) |
| POST | /tasks/:id/comments | Add comment to task | Yes (Token) |
| POST | /tasks/:id/attachments | Upload attachment | Yes (Token) |
| GET | /tasks/reminders | Get tasks with upcoming deadlines | Yes (Token) |

## Authentication Flow

The system uses JWT-based authentication:

1. User registers or logs in through the Auth Service
2. Auth Service provides a JWT token
3. Client includes this token in the Authorization header for subsequent requests
4. Other services verify the token through middleware

## Middleware

The system includes several middleware functions:
- `authenticateToken`: Validates JWT token
- `userAdmin`: Ensures the user has admin privileges

## Models

### User Model
- name: String
- email: String (unique)
- password: String (hashed)
- role: String (admin/user)
- isBlocked: Boolean

### Project Model
- name: String
- description: String
- startDate: Date
- endDate: Date
- status: String
- categories: Array of Strings
- createdBy: Object (user reference)

### Task Model
- title: String
- description: String
- priority: String
- deadline: Date
- status: String
- assignedTo: Object (user reference)
- projectId: ID (project reference)
- comments: Array of Objects
- attachments: Array of Objects

## Postman Collections

To help you test the APIs, you can import the following Postman collections:

### Auth Service Collection

```json
{
  "info": {
    "name": "Authentication Service",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3001/auth/register",
          "host": "localhost:3001",
          "path": [
            "auth",
            "register"
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"test\",\n  \"email\": \"test@example.com\",\n  \"password\": \"123456\"\n}"
        },
        "description": "Register a new user. No token required.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3001/auth/login",
          "host": "localhost:3001",
          "path": [
            "auth",
            "login"
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"123456\"\n}"
        },
        "description": "Login to get a JWT token. Copy the token from the response to the `{{token}}` variable.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Get User by ID",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          }
        ],
        "url": {
          "raw": "http://localhost:3001/auth/user/1",
          "host": "localhost:3001",
          "path": [
            "auth",
            "user",
            "1"
          ]
        },
        "description": "Fetch user details by ID. Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Get All Users",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          }
        ],
        "url": {
          "raw": "http://localhost:3001/auth/users",
          "host": "localhost:3001",
          "path": [
            "auth",
            "users"
          ]
        },
        "description": "Fetch all users. Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Block/Unblock User",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          }
        ],
        "url": {
          "raw": "http://localhost:3001/auth/block/1",
          "host": "localhost:3001",
          "path": [
            "auth",
            "block",
            "1"
          ]
        },
        "description": "Toggle block status (admin only). Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Update User",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3001/auth/user/1",
          "host": "localhost:3001",
          "path": [
            "auth",
            "user",
            "1"
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"updated\",\n  \"email\": \"updated@example.com\",\n  \"role\": \"admin\"\n}"
        },
        "description": "Update user details (admin only). Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Delete User",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          }
        ],
        "url": {
          "raw": "http://localhost:3001/auth/user/1",
          "host": "localhost:3001",
          "path": [
            "auth",
            "user",
            "1"
          ]
        },
        "description": "Delete a user (admin only). Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    }
  ]
}
```

### Project Service Collection

```json
{
  "info": {
    "name": "Project Service",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Project",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3003/projects",
          "host": "localhost:3003",
          "path": [
            "projects"
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Website Redesign\",\n  \"description\": \"Redesign company website\",\n  \"startDate\": \"2025-03-21\",\n  \"endDate\": \"2025-04-30\",\n  \"status\": \"active\",\n  \"categories\": [\n    \"Design\"\n  ]\n}"
        },
        "description": "Create a new project. Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Get All Projects",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          }
        ],
        "url": {
          "raw": "http://localhost:3003/projects?name=Website&status=active",
          "host": "localhost:3003",
          "path": [
            "projects?name=Website&status=active"
          ]
        },
        "description": "Fetch all projects with optional filters. Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Get Project by ID",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          }
        ],
        "url": {
          "raw": "http://localhost:3003/projects/1",
          "host": "localhost:3003",
          "path": [
            "projects",
            "1"
          ]
        },
        "description": "Fetch a specific project by ID. Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Update Project",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3003/projects/1",
          "host": "localhost:3003",
          "path": [
            "projects",
            "1"
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"completed\",\n  \"description\": \"Redesign completed\"\n}"
        },
        "description": "Update an existing project. Requires token (creator or admin).\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Delete Project",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          }
        ],
        "url": {
          "raw": "http://localhost:3003/projects/1",
          "host": "localhost:3003",
          "path": [
            "projects",
            "1"
          ]
        },
        "description": "Delete a project. Requires token (creator or admin).\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Add Category",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3003/projects/1/categories",
          "host": "localhost:3003",
          "path": [
            "projects",
            "1",
            "categories"
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"category\": \"Development\"\n}"
        },
        "description": "Add a category to a project. Requires token (creator or admin).\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    }
  ]
}
```

### Task Service Collection

```json
{
  "info": {
    "name": "Task Service",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Task",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3004/tasks",
          "host": "localhost:3004",
          "path": [
            "tasks"
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Design UI\",\n  \"description\": \"Create wireframes\",\n  \"priority\": \"high\",\n  \"deadline\": \"2025-03-25\",\n  \"assignedTo\": \"1\",\n  \"projectId\": \"1\"\n}"
        },
        "description": "Create a new task. Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Get All Tasks",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          }
        ],
        "url": {
          "raw": "http://localhost:3004/tasks?projectId=1&status=to-do",
          "host": "localhost:3004",
          "path": [
            "tasks?projectId=1&status=to-do"
          ]
        },
        "description": "Fetch all tasks with optional filters (Kanban support). Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Get Task by ID",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          }
        ],
        "url": {
          "raw": "http://localhost:3004/tasks/1",
          "host": "localhost:3004",
          "path": [
            "tasks",
            "1"
          ]
        },
        "description": "Fetch a specific task by ID. Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Update Task",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3004/tasks/1",
          "host": "localhost:3004",
          "path": [
            "tasks",
            "1"
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"in-progress\",\n  \"description\": \"Wireframes in progress\"\n}"
        },
        "description": "Update an existing task (e.g., status for Kanban). Requires token (assignee or admin).\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Delete Task",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          }
        ],
        "url": {
          "raw": "http://localhost:3004/tasks/1",
          "host": "localhost:3004",
          "path": [
            "tasks",
            "1"
          ]
        },
        "description": "Delete a task. Requires token (assignee or admin).\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Add Comment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3004/tasks/1/comments",
          "host": "localhost:3004",
          "path": [
            "tasks",
            "1",
            "comments"
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"text\": \"Looks good so far\"\n}"
        },
        "description": "Add a comment to a task. Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Add Attachment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3004/tasks/1/attachments",
          "host": "localhost:3004",
          "path": [
            "tasks",
            "1",
            "attachments"
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"file\": \"Select a file in Postman under Body > form-data with key \\\"file\\\"\"\n}"
        },
        "description": "Add an attachment to a task. Requires token (assignee or admin). Use form-data with key \"file\" to upload.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    },
    {
      "name": "Get Task Reminders",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQyNTc2Nzg4fQ.3w2rSoRTDhFFCxSxQI8LrxqNBYnYkqYXilIQW48pZy0",
            "description": "JWT token for authentication"
          }
        ],
        "url": {
          "raw": "http://localhost:3004/tasks/reminders",
          "host": "localhost:3004",
          "path": [
            "tasks",
            "reminders"
          ]
        },
        "description": "Fetch tasks with deadlines within the next day (not done). Requires token.\n\n**Note**: Use a valid JWT token in the `{{token}}` variable. The server uses the secret key `like_that` to verify tokens."
      },
      "response": []
    }
  ]
}
```

## How to Import Postman Collections

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Save each JSON collection above to separate files (auth-collection.json, project-collection.json, task-collection.json)
3. In Postman, click on "Import" button
4. Upload the JSON files or paste the JSON content directly
5. After successful import, the collections will appear in your Postman workspace
6. Before using, make sure to update the variables (auth_token, user_id, project_id, task_id) with your actual values
