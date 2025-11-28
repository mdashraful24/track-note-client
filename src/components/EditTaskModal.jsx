import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import toast from "react-hot-toast";

const EditTaskModal = ({ isOpen, onClose, task, refetch }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "todo"
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || "",
                description: task.description || "",
                category: task.category || "todo"
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error("Title and description are required");
            return;
        }

        try {
            const res = await axios.put(`http://localhost:5000/updateTask/${task._id}`, formData);

            if (res.status === 200) {
                toast.success("Task updated successfully");
                refetch();
                onClose();
            }
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Failed to update task");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center z-50 px-4 pt-20 md:pt-0">
            <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-xl">
                <h2 className="text-xl font-bold mb-4">Edit Task</h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 placeholder:text-black mb-3"
                            placeholder="Enter task title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 placeholder:text-black mb-3"
                            placeholder="Enter task description"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 placeholder:text-black mb-3"
                        >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    <div className="flex justify-between gap-3 font-medium mt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditTaskModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    task: PropTypes.object,
    refetch: PropTypes.func.isRequired,
};

export default EditTaskModal;
