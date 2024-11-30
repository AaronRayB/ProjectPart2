const express = require('express');
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const User = require('./models/user'); // Ensure the User model is configured properly
const connectDB = require('./config/db');
const taskRoutes = require('./router/taskRoutes');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session and Passport Middleware Setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret', // Use environment variable for the session secret
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration (Ensure User model is compatible with passport-local-mongoose)
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Pass `user` to all views
  next();
});

// Middleware to Protect Routes (Make sure the `isLoggedIn` function is placed here)
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated
  }
  req.flash('error', 'You need to be logged in to access that page'); // Add flash message
  res.redirect('/login'); // Redirect to login if not authenticated
}

// Protected Routes for Tasks
app.get('/tasks/update/:id', isLoggedIn, (req, res) => {
  const taskId = req.params.id;
  res.render('update', { taskId }); // Render update form with task ID
});

app.post('/tasks/delete/:id', isLoggedIn, (req, res) => {
  const taskId = req.params.id;
  // Perform task deletion 
  res.redirect('/tasks'); // Redirect after deletion
});

app.get('/tasks/:id/edit', isLoggedIn, (req, res) => {
  const taskId = req.params.id;
  // Fetch task from database 
  res.render('edit', { task: { id: taskId, name: 'Sample Task' } });
});

// Routes
app.use('/', taskRoutes);

// Login Route
app.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') }); // Pass flash messages to the view
});

// Login POST Handler
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true, // Enable flash messages on failure
}));

// Register Route
app.get('/register', (req, res) => {
  res.render('register', { message: req.flash('error') }); // Pass flash messages to the view
});

// Register POST Handler
app.post('/register', async (req, res) => {
  const { username, password, email, displayName } = req.body;

  try {
    const newUser = new User({ username, email, displayName });
    await User.register(newUser, password); // Automatically hashes the password
    res.redirect('/login'); // Redirect to login on success
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error registering user');
    res.redirect('/register'); // Redirect with error message
  }
});

// Logout Route
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login'); // Redirect to login page after logout
  });
});

// Home Route
app.get('/', (req, res) => {
  res.render('index', { tasks: [], user: req.user }); // Pass user and dummy tasks array
});

// Handle Undefined Routes
app.use((req, res, next) => {
  next(createError(404)); // Pass 404 to error handler
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
