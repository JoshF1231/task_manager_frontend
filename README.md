# Project overview 

The Task Manager App is a full-stack web application designed to help users organize and manage their tasks efficiently. Built with React and TypeScript on the frontend, Flask (Python) on the backend, and MySQL for data storage, this app offers a comprehensive solution for personal task management.

### Key Features
* User Authentication: Secure signup and login functionality using JWT (JSON Web Tokens).

* Task Management: Full CRUD (Create, Read, Update, Delete) operations for tasks.

* Subtasks: Support for nested subtasks within each main task.

* Data Security: Passwords are securely hashed using bcrypt.

### Technical Stack
* Frontend: React with TypeScript

* Backend: Flask (Python)

* Database: MySQL

* Authentication: JWT

### Core Functionality
* User registration and login

* Create, view, update, and delete tasks

* Add and manage subtasks

# Setup instructions

* Server: Run file server.py from the python project

* MySQL: Import the database using self contained SQL file

* Frontend: Run the project with "npx vite" within the react project folder, browse to http://localhost:5173/

# API Endpoints

This section documents the available API endpoints for the Task Manager application.  All task-related endpoints require a valid JWT token in the `Authorization` header.

### Authentication

*   **`POST /signup`**: Register a new user.
    *   **Body:** `{username, email, password}`
    *   **Response:** `{"message": "User registered successfully"}`
*   **`POST /login`**: Authenticate and get a JWT.
    *   **Body:** `{username, password}`
    *   **Response:** `"<JWT_TOKEN>"`
*   **`GET /user`**: Get current user's information.
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Response:** `{id, username, email, ...}`

### Tasks

*   **`GET /tasks`**: Get all tasks for the logged-in user.
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Response:** `[{id, user_id, title, description, status, due_date}, ...]`
*   **`POST /tasks`**: Create a new task.
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Body:** `{title, description (optional), status (optional), due_date (optional)}`
    *   **Response:** `{id, user_id, title, description, status, due_date}`
*   **`PUT /tasks/<task_id>`**: Update a task.
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Body:** `{title (optional), description (optional), status (optional), due_date (optional)}`
    *   **Response:** `{id, user_id, title, description, status, due_date}`
*   **`DELETE /tasks/<task_id>`**: Delete a task (and its subtasks).
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Response:** `{"message": "Task deleted successfully"}`

### Subtasks

*   **`POST /tasks/<task_id>/subtasks`**: Add a subtask to a task.
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Body:** `{title, status (optional), description (optional), due_date (optional)}`
    *   **Response:** `{id, task_id, title, status, description, due_date}`
*   **`GET /tasks/<task_id>/subtasks`**: Get all subtasks for a task.
    *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    *   **Response:** `[{id, task_id, title, status, description, due_date}, ...]`
*    **`PUT /tasks/<task_id>/subtasks/<subtask_id>`**:Update subtask Status.
     *   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
     *   **Body:** `{status (required)}`
     *   **Response:** `{"message": "Task successfully updated"}`

### Notes:

*   Date format is YYYY-MM-DD.
*   All task-related endpoints require authentication.

