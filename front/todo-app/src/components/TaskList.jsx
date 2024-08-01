

import { useRef } from 'react';
import { motion, Reorder } from 'framer-motion';

function TaskList({ tasks, updateTask, deleteTask, updateTaskOrder }) {
    const containerRef = useRef(null);

    return (
        <Reorder.Group
            axis="y"
            values={tasks}
            onReorder={updateTaskOrder}
            className="task-list"
            ref={containerRef}
        >
            {tasks.map((task) => (
                <Reorder.Item
                    key={task.id}
                    value={task}
                    className="task-item"
                >
                    <motion.div
                        drag="y"
                        dragConstraints={containerRef}
                        className="task-content"
                    >
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => updateTask(task.id, { ...task, completed: !task.completed })}
                        />
                        {task.name}
                        <button onClick={() => deleteTask(task.id)}>Supprimer</button>
                    </motion.div>
                </Reorder.Item>
            ))}
        </Reorder.Group>
    );
}

export default TaskList;
