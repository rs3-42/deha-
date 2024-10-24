const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'deha',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const poolPromise = pool.promise();

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Register user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ error: 'Username or password missing.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await poolPromise.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.redirect('/accueil.html');
    } catch (error) {
        res.status(500).send({ error: 'Error registering user.' });
    }
});

// Fetch all users
app.get('/users', async (req, res) => {
    try {
        const [users] = await poolPromise.query('SELECT id, username FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching users.' });
    }
});

// Fetch tasks for a specific user
app.get('/users/:id/tasks', async (req, res) => {
    const userId = req.params.id;
    try {
        const [tasks] = await poolPromise.query('SELECT id, task FROM tasks WHERE user_id = ?', [userId]);
        res.json(tasks);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching tasks.' });
    }
});

// Add a task to a user
app.post('/users/:id/tasks', async (req, res) => {
    const userId = req.params.id;
    const { task } = req.body;
    if (!task) {
        return res.status(400).send({ error: 'Task description is required.' });
    }
    try {
        await poolPromise.query('INSERT INTO tasks (user_id, task) VALUES (?, ?)', [userId, task]);
        res.status(201).send({ message: 'Task added successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Error adding task.' });
    }
});

// Delete a task
app.delete('/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    try {
        await poolPromise.query('DELETE FROM tasks WHERE id = ?', [taskId]);
        res.status(200).send({ message: 'Task deleted successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Error deleting task.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
