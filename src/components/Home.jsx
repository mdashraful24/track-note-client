import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, } from "@hello-pangea/dnd";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import Navbar from "./Navbar";
import Login from "./Login";
import TaskColumn from "./TaskColumn";
import useAuth from "./useAuth";
import Loading from "./Loading";

const Home = () => {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = { todo: [], "in-progress": [], done: [] }, refetch, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!user?.email) {
        toast.error("User email is not available.");
        return { todo: [], "in-progress": [], done: [] };
      }

      const email = user.email;
      const res = await axios.get(`https://track-note-ecru.vercel.app/getTasks?email=${email}`);
      // http://localhost:5000
      const fetchedTasks = res.data;
      return {
        todo: fetchedTasks.filter((task) => task.category === "todo"),
        "in-progress": fetchedTasks.filter((task) => task.category === "in-progress"),
        done: fetchedTasks.filter((task) => task.category === "done"),
      };
    },
    enabled: !!user?.email,
  });



  // Mutation for adding a new task
  const addTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const taskWithUserEmail = {
        ...newTask,
        email: user.email,
      };
      const res = await axios.post(
        "https://track-note-ecru.vercel.app/addTask",
        taskWithUserEmail
      );
      return res.data.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task added successfully!");
      closeModal();
    },
    onError: () => toast.error("Failed to add task"),
  });

  // Mutation for updating task category
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, category }) => {
      await axios.patch(`https://track-note-ecru.vercel.app/updateTask/${taskId}`, {
        category,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refetch tasks after updating
      toast.success("Task moved successfully!");
      refetch();
    },
    onError: () => toast.error("Failed to move task"),
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const startColumn = source.droppableId;
    const endColumn = destination.droppableId;

    const movedTask = tasks[startColumn][source.index];

    // Optimistically update UI before API call
    queryClient.setQueryData(["tasks"], (oldData) => {
      const newTasks = { ...oldData };

      // Remove task from the original position
      const updatedStartColumn = [...newTasks[startColumn]];
      updatedStartColumn.splice(source.index, 1);

      // Insert task in the new position
      const updatedEndColumn = [...newTasks[endColumn]];
      updatedEndColumn.splice(destination.index, 0, movedTask);

      newTasks[startColumn] = updatedStartColumn;
      newTasks[endColumn] = updatedEndColumn;

      return newTasks;
    });

    // If moved within the same column, update the order
    if (startColumn === endColumn) {
      const updatedTaskOrder = tasks[startColumn].map((task, index) => ({
        _id: task._id,
        order: index, // Assign new order
      }));

      axios
        .patch("https://track-note-ecru.vercel.app/updateTaskOrder", {
          tasks: updatedTaskOrder, // Send updated task orders
        })
        .catch(() => {
          toast.error("Failed to reorder tasks");
          queryClient.invalidateQueries(["tasks"]);
        });
    } else {
      // If moved across columns, update category and order
      updateTaskMutation.mutate(
        { taskId: movedTask._id, category: endColumn, order: destination.index },
        {
          onError: () => {
            toast.error("Failed to move task");
            queryClient.invalidateQueries(["tasks"]);
          },
        }
      );
    }
  };


  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "todo",
  });

  const openModal = () => {
    setNewTask({
      title: "",
      description: "",
      category: "todo",
    });
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // Handle Input Change
  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Add New Task
  const handleAddTask = () => {
    if (!newTask.title || !newTask.description) {
      toast.error("Please fill in all fields");
      return;
    }
    addTaskMutation.mutate(newTask);
  };

  if (isLoading || loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="min-h-screen container mx-auto p-4 lg:p-8">
      <Toaster position="top-right" />
      <Navbar />
      <h1 className="text-3xl text-center font-bold pt-4 pb-6">Take & Manage Your Notes</h1>

      {user && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-10">
            <TaskColumn
              title="To Do"
              tasks={tasks.todo}
              droppableId="todo"
              openModal={openModal}
              refetch={refetch}
            />
            <TaskColumn
              title="In Progress"
              tasks={tasks["in-progress"]}
              droppableId="in-progress"
              openModal={openModal}
              refetch={refetch}
            />
            <TaskColumn
              title="Done"
              tasks={tasks.done}
              droppableId="done"
              openModal={openModal}
              refetch={refetch}
            />
          </div>
        </DragDropContext>
      )}

      <Login />

      {/* Add Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-start md:items-center md:justify-center bg-black bg-opacity-50 px-4 pt-20 md:pt-0">
          <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">Add Note</h2>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              placeholder="Task Name"
              className="w-full p-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 placeholder:text-black mb-5"
            />
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              placeholder="Short Description"
              className="w-full p-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 placeholder:text-black mb-5"
            />
            <select
              name="category"
              value={newTask.category}
              onChange={handleInputChange}
              className="w-full p-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 placeholder:text-black mb-5"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div className="flex justify-between gap-3 font-medium mt-5">
              <button
                onClick={closeModal}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

