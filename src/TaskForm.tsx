import React, { useState } from 'react';

interface Task {
    id: number;
    title: string;
    description?: string;
    due_date?: string;
    user_id?: number;
    status: 'pending' | 'done';
}

interface TaskFormProps {
    task: Task;
    onSave: (task: Task) => void;
    onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Task>(task);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData); // Call the parent function to save the task
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
            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </form>
    );
};

export default TaskForm;
