const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to MySQL');
});

app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks ORDER BY `order`', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const { name, completed } = req.body;
    db.query('INSERT INTO tasks (name, completed, `order`) VALUES (?, ?, ?)', [name, completed, 0], (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, name, completed, order: 0 });
    });
});

// app.put('/tasks/:id', (req, res) => {
//     const { id } = req.params;
//     const { name, completed } = req.body;
//     db.query('UPDATE tasks SET name = ?, completed = ? WHERE id = ?', [name, completed, id], (err) => {
//         if (err) throw err;
//         res.sendStatus(200);
//     });
// });

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

app.put('/tasks/order', (req, res) => {
    const tasks = req.body;

    db.beginTransaction(err => {
        if (err) throw err;

        const updateTasks = tasks.map(task =>
            new Promise((resolve, reject) => {
                db.query('UPDATE tasks SET `order` = ? WHERE id = ?', [task.order, task.id], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            })
        );

        Promise.all(updateTasks)
            .then(() => {
                db.commit(err => {
                    if (err) {
                        db.rollback(() => {
                            throw err;
                        });
                    }
                    res.sendStatus(200);
                });
            })
            .catch(err => {
                db.rollback(() => {
                    throw err;
                });
            });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
