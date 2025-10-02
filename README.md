# Tech Tapper - Full Stack Application

A modern full-stack application built with Express.js, MongoDB, and React with Tailwind CSS.

## 🚀 Features

- **User Management**: Create, read, update, and delete users
- **Role-based System**: Support for customers and managers
- **Modern UI**: Built with React and Tailwind CSS
- **Responsive Design**: Works on desktop and mobile
- **API Integration**: RESTful API with Express.js
- **Database**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Morgan** - HTTP request logger
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 📁 Project Structure

```
Tech_Tapper/
├── Controllers/          # API controllers
│   ├── UserController.js
│   └── projectController.js
├── Model/               # Database models
│   ├── userModel.js
│   ├── ProjectModel.js
│   └── progressModel.js
├── Routes/              # API routes
│   ├── userRoutes.js
│   └── ProjectRoutes.js
├── Utils/               # Utility functions
│   └── catchAsync.js
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # API client
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── app.js               # Express app configuration
├── server.js            # Server entry point
├── config.env           # Environment variables
└── package.json         # Backend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Tech_Tapper
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   - Update `config.env` with your MongoDB connection string
   - The default configuration uses local MongoDB: `mongodb://127.0.0.1:27017/BMI`

### Running the Application

1. **Start the backend server**
   ```bash
   npm start
   # or
   node server.js
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Build the frontend for production**
   ```bash
   cd frontend
   npm run build
   ```

## 📚 API Endpoints

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Projects
- `GET /api/v1/projects` - Get all projects
- `GET /api/v1/projects/:id` - Get project by ID
- `POST /api/v1/projects` - Create new project
- `DELETE /api/v1/projects/:id` - Delete project

## 🎨 Frontend Features

### Pages
- **Home** - Welcome page with navigation
- **Users List** - Display all users with CRUD operations
- **User Form** - Create new users
- **User Edit** - Update existing users

### Components
- **Navbar** - Navigation component
- **Button** - Reusable button component
- **Input** - Form input component
- **Card** - Content card component
- **Spinner** - Loading indicator
- **Error** - Error display component

## 🔧 Configuration

### Backend Configuration
- Port: 5000 (configurable via `PORT` environment variable)
- Database: MongoDB (local or Atlas)
- CORS: Enabled for frontend communication

### Frontend Configuration
- Port: 3000 (configurable in `vite.config.js`)
- API Proxy: Configured to proxy `/api` requests to backend
- Environment: Uses `VITE_API_URL` for API base URL

## 🐛 Troubleshooting

### Common Issues

1. **PowerShell Execution Policy Error**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **MongoDB Connection Issues**
   - Ensure MongoDB is running locally
   - Check connection string in `config.env`
   - For MongoDB Atlas, update connection string

3. **Port Already in Use**
   - Backend: Change `PORT` in `config.env`
   - Frontend: Update port in `vite.config.js`

## 📝 Development

### Adding New Features
1. Create new routes in `Routes/` directory
2. Add corresponding controllers in `Controllers/` directory
3. Create frontend components in `frontend/src/components/`
4. Add new pages in `frontend/src/pages/`

### Code Style
- ESLint configuration included for frontend
- Consistent naming conventions
- Component-based architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.