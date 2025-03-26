import React, { useState, useEffect } from 'react';
import { useAuth } from './components/AuthProvider';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import TaskForm from "./TaskForm.tsx"; // We'll create this CSS file for styling

const api_url = 'http://localhost:5000';


interface Task {
    id: number;
    title: string;
    description?: string;
    due_date?: string;
    user_id?: number;
    status: 'pending' | 'done';
}

const Dashboard: React.FC = () => {
    const auth = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);


    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchTasks();
        }
    }, [auth.isAuthenticated]);


    if (!auth.isAuthenticated) {
        return <Navigate to="/login"/>;
    }

    const fetchTasks = async () => {
        try {
            const response = await axios.get(api_url + '/tasks', {
                headers: {Authorization: `Bearer ${auth.token}`}
            });

            if (Array.isArray(response.data)) {
                setTasks(response.data);
            } else if (response.data.message === "No tasks found") {
                setTasks([]); // Set to empty array if no tasks
            } else {
                console.error('Unexpected data format:', response.data);
                setTasks([]); // Set to empty array as fallback
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setTasks([]); // Set to empty array on error
        }
    };


    const handleSaveTask = async (updatedTask: Task) => {
        try {
            if (updatedTask.id) {
                // Update existing task
                const response = await axios.put(`http://localhost:5000/tasks/${updatedTask.id}`, updatedTask, {
                    headers: {Authorization: `Bearer ${auth.token}`},
                });
                setTasks(tasks.map(task => (task.id === updatedTask.id ? response.data : task)));
            } else {
                // Create new task
                const response = await axios.post('http://localhost:5000/tasks', {
                    title: updatedTask.title,
                    description: updatedTask.description,
                    due_date: updatedTask.due_date,
                    status: 'pending',
                }, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                });
                setTasks([...tasks, response.data]);
            }
            setEditingTask(null); // Close the form
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`http://localhost:5000/tasks/${id}`, {
                    headers: {Authorization: `Bearer ${auth.token}`},
                });
                setTasks(tasks.filter(task => task.id !== id));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    return (
        <div className="dashboard">
            <h1>Your Tasks</h1>
            <button
                onClick={() => setEditingTask({id: 0, title: '', description: '', status: 'pending', due_date: ''})}>
                Add New Task
            </button>
            {editingTask && (
                <TaskForm task={editingTask} onSave={handleSaveTask} onCancel={() => setEditingTask(null)}/>
            )}
            {tasks.length > 0 ? (
                <ul className="task-list">
                    {tasks.map(task => (
                        <li key={task.id} className="task-item">
                            <div className="task-header">
                                <h3>{task.title}</h3>
                                <span className={`status ${task.status}`}>{task.status}</span>
                            </div>
                            <p>{task.description}</p>
                            {task.due_date && <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>}
                            <div className="task-actions">
                                <button onClick={() => setEditingTask(task)}>Edit</button>
                                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tasks found. Start by adding a new task!</p>
            )}
        </div>
    );

}


export default Dashboard;


