import React, { useState } from 'react';
import './TaskForm.css';  // Add this line

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

interface TaskFormProps {
    task: Task;
    onSave: (task: Task) => void;
    onCancel: () => void;
}


const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Task>({
        ...task,
        due_date: formatDateForInput(task.due_date)
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };



    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <textarea
                name="description"
                placeholder="Description"
                value={formData.description || ''}
                onChange={handleChange}
            />
            <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
            </select>
            <input
                type="date"
                name="due_date"
                value={formData.due_date || ''}
                onChange={handleChange}
            />



            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default TaskForm;
