# Social Media App

A full-stack social media application built with Express.js, MongoDB, and React with Vite.

## Features

- **User Authentication**: Register, login, and secure session management
- **Create Posts**: Share text and image posts with the community
- **Edit/Delete Posts**: Manage your own posts
- **User Profiles**: View user profiles and their posts
- **Responsive Design**: Mobile-friendly interface
- **File Upload**: Upload images with posts

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Routing
- **CSS** - Styling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- npm or yarn package manager

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd Social-Media-App-Y3S1
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend-app
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Project Structure

```
Social-Media-App-Y3S1/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── uploads/           # Uploaded files
│   ├── package.json
│   └── server.js
├── frontend-app/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/           # API calls
│   │   ├── components/    # React components
│   │   ├── context/       # Context API
│   │   ├── pages/         # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Posts

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a specific post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account or login with existing credentials
3. Create, edit, and delete posts
4. View other users' profiles and posts
5. Upload images with your posts

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email your-email@example.com or open an issue in the repository.

## Authors

- Your Name - Initial work

---

**Built as a Year 3 Semester 1 project**
