import { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const addTask = (task) => {
        fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(newTask => setTasks([...tasks, newTask]))
        .catch(error => console.error('Error:', error));
    };

    const updateTask = (id, updatedTask) => {
        fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
        })
        .then(() => {
            setTasks(tasks.map(task => (task.id === id ? { ...task, ...updatedTask } : task)));
        })
        .catch(error => console.error('Error:', error));
    };

    const deleteTask = (id) => {
        fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
            .then(() => {
                setTasks(tasks.filter(task => task.id !== id));
            })
            .catch(error => console.error('Error:', error));
    };

    const updateTaskOrder = (reorderedTasks) => {
        console.log('Reordered Tasks:', reorderedTasks); // Debugging
        setTasks(reorderedTasks);

        fetch('http://localhost:5000/tasks/order', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reorderedTasks.map((task, index) => ({ ...task, order: index })))
        })
        .then(response => response.json())
        .then(data => console.log('Server Response:', data)) // Debugging
        .catch(error => console.error('Error:', error));
    };

    return (
        <div className="App">
            <h1>To-Do List</h1>
            <TaskForm addTask={addTask} />
            <TaskList tasks={tasks} updateTask={updateTask} deleteTask={deleteTask} updateTaskOrder={updateTaskOrder} />
        </div>
    );
}

export default App;