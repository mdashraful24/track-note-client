import { Draggable, Droppable } from "@hello-pangea/dnd";
import axios from "axios";
import { Trash } from "lucide-react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";

// Task Column Component
const TaskColumn = ({ title, tasks, droppableId, openModal, refetch }) => {
  const handleDelete = async (id) => {
    const res = await axios.delete(`http://localhost:5000/deleteTask/${id}`);
    if (res.data.deletedCount > 0) {
      refetch(); // Fetch the updated task list
      toast.success("Deleted Successfully");
    }
  };

  return (
    <div className="border-2 border-black p-3 rounded-xl shadow">
      <div className="flex justify-between items-center bg-blue-100 border border-blue-400 p-2 rounded-lg drop-shadow">
        <h2 className="text-lg lg:text-xl font-semibold">{title}</h2>
        <button
          onClick={openModal}
          className="group flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors relative overflow-hidden"
        >
          {/* subtle background shimmer */}
          <span
            className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none"
          />

          <FiPlus size={18} />
          {/* <span className="font-medium relative z-10">Add Note</span> */}
        </button>

      </div>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4 mt-4"
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-3 border border-gray-400 rounded-lg shadow-md"
                  >
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-gray-600">{task.description}</p>
                    <div className="flex justify-end">
                      <button
                        className="mt-2 px-2 py-1 bg-red-600 text-white rounded"
                        onClick={() => handleDelete(task._id)}
                        title="Delete"
                      >
                        <Trash size={18} />
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
