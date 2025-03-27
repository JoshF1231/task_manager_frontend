import React, { useState, useEffect } from 'react';
import { useAuth } from './components/AuthProvider';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import TaskForm from "./TaskForm.tsx";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api_url = 'http://localhost:5000';

interface Subtask {
    id: number;
    title?: string;
    description?: string;
    status: 'pending' | 'done';
    due_date?: string;
    task_id: number;
}


interface Task {
    id: number;
    title: string;
    description?: string;
    due_date?: string;
    user_id?: number;
    status: 'pending' | 'done';
    subtasks: Subtask[];
}

const Dashboard: React.FC = () => {
    const auth = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>("");



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
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            if (Array.isArray(response.data)) {
                // Ensure each task has an empty subtasks array if not provided by the API
                const tasksWithSubtasks = response.data.map((task: Task) => ({
                    ...task,
                    subtasks: task.subtasks || [], // Initialize subtasks as an empty array
                }));
                setTasks(tasksWithSubtasks);
            } else if (response.data.message === "No tasks found") {
                setTasks([]); // Set to empty array if no tasks
            } else {
                console.error("Unexpected data format:", response.data);
                setTasks([]); // Set to empty array as fallback
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
            toast.error("Failed to fetch tasks");
        }
    };



    const handleSaveTask = async (updatedTask: Task) => {
        try {
            if (updatedTask.id) {
                // Update existing task
                const response = await axios.put(`http://localhost:5000/tasks/${updatedTask.id}`, updatedTask, {
                    headers: {Authorization: `Bearer ${auth.token}`},
                });
                //setTasks(tasks.map(task => (task.id === updatedTask.id ? response.data : task)));
                setTasks(prevTasks => {
                    return prevTasks.map(task => {
                        if (task.id === updatedTask.id) {
                            // Find the existing task in the previous state
                            const existingTask = prevTasks.find(t => t.id === updatedTask.id);

                            // Merge the updated task data from the response with the existing subtasks
                            return { ...response.data, subtasks: existingTask ? existingTask.subtasks : [] };
                        } else {
                            return task;  // Return other tasks unchanged
                        }
                    });
                });
                toast.success('Task saved successfully');
            } else {
                // Create new task
                const response = await axios.post('http://localhost:5000/tasks', updatedTask, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                });
                console.log(updatedTask.due_date);
                setTasks([...tasks, response.data]);
                toast.success('Task created successfully');
            }
            setEditingTask(null); // Close the form
        } catch (error) {
            console.error('Error saving task:', error);
            toast.error('Failed to create task:');
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`http://localhost:5000/tasks/${id}`, {
                    headers: {Authorization: `Bearer ${auth.token}`},
                });
                setTasks(tasks.filter(task => task.id !== id));
                toast.success('Task deleted successfully');
            } catch (error) {
                console.error('Error deleting task:', error);
                toast.error('Failed to delete task:');
            }
        }
    };



    const toggleTaskExpansion = async (taskId: number) => {
        if (expandedTasks.includes(taskId)) {
            setExpandedTasks(expandedTasks.filter((id) => id !== taskId));
        } else {
            const subtasks = await fetchSubtasks(taskId);
            setTasks(prevTasks => {
                const updatedTasks = prevTasks.map(task =>
                    task.id === taskId ? { ...task, subtasks: subtasks } : task
                );
                return updatedTasks;
            });
            setExpandedTasks(prev => [...prev, taskId]);
        }
    };


    const fetchSubtasks = async (taskId: number) => {
        try {
            const response = await axios.get(`${api_url}/tasks/${taskId}/subtasks`, {
                headers: {Authorization: `Bearer ${auth.token}`}
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching subtasks for task ${taskId}:`, error);
            toast.error(`Failed to fetch subtasks for task ${taskId}`);
            return [];
        }
    };

    const handleAddSubtask = async (taskId: number, title: string) => {
        try {
            const subtaskData = {
                title: title,
                description: '',
                status: 'pending',
                due_date: null
            };

            const response = await axios.post(`${api_url}/tasks/${taskId}/subtasks`, subtaskData, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            const newSubtask = response.data;

            setTasks(prevTasks => prevTasks.map(task =>
                task.id === taskId
                    ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] }
                    : task
            ));

            setNewSubtaskTitle("");
            toast.success('Subtask added successfully');
        } catch (error) {
            console.error('Error adding subtask:', error);
            toast.error('Failed to add subtask');
        }
    };

    const handleUpdateSubtaskStatus = async (taskId: number, subtaskId: number, newStatus: 'pending' | 'done') => {
        try {
            await axios.put(`${api_url}/tasks/${taskId}/subtasks/${subtaskId}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            setTasks(tasks.map(task => {
                if (task.id === taskId) {
                    const updatedSubtasks = task.subtasks.map(subtask =>
                        subtask.id === subtaskId ? { ...subtask, status: newStatus } : subtask
                    );
                    return { ...task, subtasks: updatedSubtasks };
                }
                return task;
            }));
            toast.success('Subtask status updated successfully');
        } catch (error) {
            console.error('Error updating subtask status:', error);
            toast.error('Failed to update subtask status');
        }
    };


    return (
        <div className="dashboard">
            <h1>Your Tasks</h1>
            <button
                onClick={() =>
                    setEditingTask({
                        id: 0,
                        title: "",
                        description: "",
                        status: "pending",
                        due_date: "",
                        subtasks: [], // Initialize subtasks as an empty array for new tasks
                    })
                }
            >
                Add New Task
            </button>

            {editingTask && (
                <TaskForm task={editingTask} onSave={handleSaveTask} onCancel={() => setEditingTask(null)}/>
            )}
            {tasks.length > 0 ? (
                <ul className="task-list">
                    {tasks.map(task => (
                        <li key={task.id} className="task-item">
                            <div className="task-header" onClick={() => toggleTaskExpansion(task.id)}>
                                <h3>{task.title}</h3>
                                <span className={`status ${task.status}`}>{task.status}</span>
                            </div>
                            {expandedTasks.includes(task.id) && (
                                <div className="task-details">
                                    <p>{task.description}</p>
                                    {task.due_date && <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>}
                                    <h4>Subtasks:</h4>
                                    <ul className="subtask-list">
                                        {task.subtasks && task.subtasks.map(subtask => (
                                            <li key={subtask.id} className="subtask-item">
                                                <span>{subtask.title}</span>
                                                <select
                                                    value={subtask.status}
                                                    onChange={(e) => handleUpdateSubtaskStatus(task.id, subtask.id, e.target.value as 'pending' | 'done')}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="done">Done</option>
                                                </select>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="add-subtask">
                                        <input
                                            type="text"
                                            placeholder="New subtask title"
                                            value={newSubtaskTitle}
                                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                            style={{
                                                width: '90%',
                                                padding: '10px',
                                                marginBottom: '10px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                            }}
                                        />
                                        <button
                                            onClick={() => handleAddSubtask(task.id, newSubtaskTitle)}
                                            style={{
                                                backgroundColor: 'rgba(188,188,188,0.18)',
                                                color: 'white',
                                                padding: '8px 12px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                            }}
                                        >
                                            Add Subtask
                                        </button>
                                    </div>
                                    <div className="task-actions">
                                        <button onClick={() => setEditingTask(task)}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tasks found. Start by adding a new task!</p>
            )}
            <ToastContainer/>
        </div>
    );
}

export default Dashboard;


