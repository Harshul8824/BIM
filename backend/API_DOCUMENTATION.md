# Tech Tapper API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
Currently no authentication is implemented. All endpoints are publicly accessible.

## API Endpoints

### Users

#### Get All Users
```http
GET /users
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "client": "client_id",
      "manager": "manager_id"
    }
  ]
}
```

#### Get User by ID
```http
GET /users/:id
```

#### Create User
```http
POST /users
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer",
  "client": "client_id",
  "manager": "manager_id"
}
```

#### Update User
```http
PUT /users/:id
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123",
  "role": "manager",
  "client": "client_id",
  "manager": "manager_id"
}
```

#### Delete User
```http
DELETE /users/:id
```

### Projects

#### Get All Projects
```http
GET /projects
```

**Response:**
```json
{
  "status": "success",
  "length": 1,
  "data": [
    {
      "_id": "project_id",
      "title": "Project Title",
      "description": "Project Description",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T00:00:00.000Z",
      "status": "pending",
      "client": "client_id",
      "manager": "manager_id",
      "cost": 10000,
      "plannedLabour": 100,
      "plannedMaterial": {}
    }
  ]
}
```

#### Get Project by ID
```http
GET /projects/:id
```

#### Create Project
```http
POST /projects
```

**Request Body:**
```json
{
  "title": "Project Title",
  "description": "Project Description",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "status": "pending",
  "client": "client_id",
  "manager": "manager_id",
  "cost": 10000,
  "plannedLabour": 100,
  "plannedMaterial": {}
}
```

#### Update Project
```http
PUT /projects/:id
```

#### Delete Project
```http
DELETE /projects/:id
```

### Progress

#### Get All Progress
```http
GET /progress
```

**Response:**
```json
{
  "status": "success",
  "length": 1,
  "data": [
    {
      "_id": "progress_id",
      "project": {
        "_id": "project_id",
        "title": "Project Title"
      },
      "client": {
        "_id": "client_id",
        "name": "Client Name"
      },
      "manager": {
        "_id": "manager_id",
        "name": "Manager Name"
      },
      "description": "Progress description",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-05T00:00:00.000Z",
      "FivedayCost": 5000,
      "laboursWorked": 5,
      "actualMaterialUsedToday": "Material details",
      "workCompletedToday": 25,
      "totalWorkCompleted": 25,
      "externalDelay": 0,
      "internalDelay": 0,
      "matericalCostIndays": 1000
    }
  ]
}
```

#### Get Progress by ID
```http
GET /progress/:id
```

#### Get Progress by Project
```http
GET /progress/project/:projectId
```

#### Create Progress
```http
POST /progress
```

**Request Body:**
```json
{
  "project": "project_id",
  "client": "client_id",
  "manager": "manager_id",
  "description": "Progress description",
  "startDate": "2024-01-01",
  "endDate": "2024-01-05",
  "FivedayCost": 5000,
  "laboursWorked": 5,
  "actualMaterialUsedToday": "Material details",
  "workCompletedToday": 25,
  "totalWorkCompleted": 25,
  "externalDelay": 0,
  "internalDelay": 0,
  "matericalCostIndays": 1000
}
```

#### Update Progress
```http
PUT /progress/:id
```

#### Delete Progress
```http
DELETE /progress/:id
```

## Error Responses

### Validation Error
```json
{
  "status": "fail",
  "message": "Validation Error",
  "errors": ["Field is required"]
}
```

### Duplicate Key Error
```json
{
  "status": "fail",
  "message": "email already exists"
}
```

### Invalid ID Format
```json
{
  "status": "fail",
  "message": "Invalid ID format"
}
```

### Not Found
```json
{
  "status": "fail",
  "message": "Can't find /api/v1/invalid-route on this server!"
}
```

### Server Error
```json
{
  "status": "error",
  "message": "Something went wrong!"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (for delete operations)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ["customer", "manager"], default: "customer"),
  clients: [ObjectId] (ref: "User"),
  manager: ObjectId (ref: "User")
}
```

### Project Model
```javascript
{
  title: String (required),
  description: String (required),
  startDate: Date (default: Date.now),
  endDate: Date,
  status: String (enum: ["pending", "in progress", "completed"], default: "pending"),
  client: ObjectId (required, ref: "User"),
  manager: ObjectId (required, ref: "User"),
  cost: Number (required),
  plannedLabour: Number (required),
  plannedMaterial: Object
}
```

### Progress Model
```javascript
{
  project: ObjectId (required, ref: "Project"),
  client: ObjectId (required, ref: "User"),
  manager: ObjectId (required, ref: "User"),
  description: String (required),
  startDate: Date (required),
  endDate: Date (required),
  FivedayCost: Number (required),
  laboursWorked: Number (required),
  actualMaterialUsedToday: String (required),
  workCompletedToday: Number (required),
  totalWorkCompleted: Number,
  externalDelay: Number (required),
  internalDelay: Number (required),
  matericalCostIndays: Number (required)
}
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

3. **Test the API**
   ```bash
   # Test users endpoint
   curl http://localhost:5000/api/v1/users
   
   # Test projects endpoint
   curl http://localhost:5000/api/v1/projects
   
   # Test progress endpoint
   curl http://localhost:5000/api/v1/progress
   ```

## Database Connection

The application connects to MongoDB at `mongodb://127.0.0.1:27017/BMI`. Make sure MongoDB is running locally or update the connection string in `server.js` for MongoDB Atlas.
