const express = require('express');  // Add this line to import express
const router = express.Router();
const taskController = require('../routes/task');  // Import taskController (task.js)
const Task = require('../models/Task');  // Assuming Task model exists for interacting with your database
const isLoggedIn = require('../app').isLoggedIn;


// Route to display the task list
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();  // Fetch all tasks from the database
        res.render('index', { tasks });  // Pass tasks to the index.ejs view
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Server error');
    }
});


// Route to display Add Task page
router.get('/add', taskController.displayAddPage);


// Route to handle Add Task form submission
router.post('/add', taskController.createTask);


// Route to display Edit Task page
router.get('/edit/:id', taskController.displayEditPage);


// Route to handle task update
router.post('/edit/:id', taskController.processEditPage);


// Route to delete a task
router.get('/delete/:id', taskController.performDelete);


module.exports = router;  // Don't forget to export the router
