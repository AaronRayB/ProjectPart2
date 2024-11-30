const Task = require('../models/Task');  // Import Task model

// Display Add Page (GET)
const displayAddPage = (req, res) => {
    res.render('add');  // Render the view for adding a task (ensure you have an 'add.ejs' file)
};

// Create Task (POST)
const createTask = (req, res) => {
    const { title, description, dueDate, priority, notes } = req.body;

    // Create a new task using the Task model
    const newTask = new Task({
        title,
        description,
        dueDate,
        priority,
        notes,
    });

    // Save the task to the database
    newTask.save()
        .then(() => res.redirect('/'))  // Redirect to home page after saving
        .catch((err) => res.status(500).send('Error saving task'));
};

// Display Edit Page (GET)
const displayEditPage = (req, res) => {
    const { id } = req.params;
    Task.findById(id)
        .then((task) => {
            if (task) {
                res.render('edit', { task });  // Render the 'edit' page with the task data
            } else {
                res.status(404).send('Task not found');
            }
        })
        .catch((err) => res.status(500).send('Error fetching task'));
};

// Process Edit Task (PUT)
const processEditPage = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, status, notes, dueDate } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,  // Use the task ID from the URL parameter
            { title, description, priority, status, notes, dueDate },  // Update these fields
            { new: true }  // Ensure the updated task is returned
        );

        // After successful update, redirect to the task list page
        res.redirect('/');
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send('Error updating task');
    }
};

// Perform Delete (GET)
const performDelete = (req, res) => {
    const { id } = req.params;
    Task.findByIdAndDelete(id)
        .then(() => res.redirect('/'))  // Redirect to home page after deleting
        .catch((err) => res.status(500).send('Error deleting task'));
};


// Export all controller functions
module.exports = {
    displayAddPage,
    createTask,
    displayEditPage,
    processEditPage,
    performDelete,
};
