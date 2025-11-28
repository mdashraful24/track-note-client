import { Draggable, Droppable } from "@hello-pangea/dnd";
import axios from "axios";
import { Trash, Edit } from "lucide-react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import EditTaskModal from "./EditTaskModal";

// Task Column Component
const TaskColumn = ({ title, tasks, droppableId, openModal, refetch }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleDelete = async (id) => {
    const res = await axios.delete(`http://localhost:5000/deleteTask/${id}`);
    if (res.data.deletedCount > 0) {
      refetch(); // Fetch the updated task list
      toast.success("Deleted Successfully");
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <>
      <div className="border-2 border-black p-3 rounded-xl shadow">
        <div className="flex justify-between items-center bg-blue-100 border border-blue-400 p-2 rounded-lg drop-shadow">
          <h2 className="text-lg lg:text-xl font-semibold">{title}</h2>
          <button
            onClick={openModal}
            className="group flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors relative overflow-hidden"
            title="Add Note"
          >
            <span
              className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none"
            />
            <FiPlus size={16} />
          </button>
        </div>
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-3 border border-gray-400 rounded-lg shadow-md bg-white mt-4"
                    >
                      <h3 className="font-medium text-lg">{task.title}</h3>
                      <p className="text-gray-600">{task.description}</p>
                      <div className="flex justify-end gap-4 mt-3">
                        <button
                          className="group flex items-center gap-2 p-1.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors relative overflow-hidden"
                          onClick={() => handleEdit(task)}
                          title="Edit"
                        >
                          <span
                            className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none"
                          />
                          <Edit size={16} />
                        </button>
                        <button
                          className="group flex items-center gap-2 p-1.5 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 active:bg-red-800 transition-colors relative overflow-hidden"
                          onClick={() => handleDelete(task._id)}
                          title="Delete"
                        >
                          <span
                            className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none"
                          />
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        task={selectedTask}
        refetch={refetch}
      />
    </>
  );
};

TaskColumn.propTypes = {
  title: PropTypes.string.isRequired,
  tasks: PropTypes.array.isRequired,
  droppableId: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default TaskColumn;
