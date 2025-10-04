# Tech Tapper Frontend

A modern React application built with Vite, Tailwind CSS, and React Router.

## 🚀 Features

- **Standalone Operation**: Works without backend connection
- **Mock Data**: Pre-loaded with sample users
- **User Management**: Create, read, update, and delete users
- **Modern UI**: Built with Tailwind CSS
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Instant UI updates with mock data

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Mock API** - Simulated backend responses

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components
│   │   └── Navbar.jsx      # Navigation component
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Welcome page
│   │   ├── UsersList.jsx   # Users listing
│   │   ├── UserForm.jsx    # Create user
│   │   └── UserEdit.jsx    # Edit user
│   ├── lib/                # API and utilities
│   │   └── api/            # Mock API client
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Features

### Pages
- **Home** - Welcome page with navigation cards
- **Users List** - Display all users with CRUD operations
- **User Form** - Create new users (name, email, password, role)
- **User Edit** - Update existing users

### Components
- **Navbar** - Responsive navigation
- **Button** - Reusable button with variants
- **Input** - Form input with validation styling
- **Card** - Content containers
- **Spinner** - Loading indicators
- **Error** - Error display components

### Mock Data
The application comes with pre-loaded sample users:
- John Doe (Customer)
- Jane Smith (Manager)
- Mike Johnson (Customer)

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Responsive design** for all screen sizes
- **Modern UI** with clean, professional appearance
- **Consistent spacing** and typography
- **Interactive elements** with hover and focus states

## 🔧 Configuration

### Development Server
- Port: 3000 (configurable in `vite.config.js`)
- Hot reload enabled
- Fast refresh for React components

### Build Configuration
- Optimized production build
- Code splitting
- Asset optimization

## 📝 Usage

### Adding Users
1. Navigate to "Add User" from the navbar
2. Fill in the form:
   - Name (required)
   - Email (required)
   - Password (required)
   - Role (Customer or Manager)
3. Click "Create User"

### Managing Users
1. View all users on the "Users" page
2. Edit users by clicking the "Edit" button
3. Delete users by clicking the "Delete" button
4. Confirm deletion in the popup

### Navigation
- Use the navbar to switch between pages
- Active page is highlighted
- Responsive design works on mobile

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change port in `vite.config.js`
   - Or kill the process using the port

2. **Dependencies not installing**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

3. **Build errors**
   - Check for syntax errors in components
   - Ensure all imports are correct
   - Verify Tailwind CSS configuration

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




