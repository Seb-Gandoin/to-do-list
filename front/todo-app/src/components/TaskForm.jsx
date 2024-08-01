import { useState } from 'react';

function TaskForm({ addTask }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name) {
            addTask({ name, completed: false });
            setName('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add a new task"
            />
            <button type="submit">Ajouter une tâche</button>
        </form>
    );
}

export default TaskForm;