import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Toaster, toast } from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import Login from "./components/Login";

function App() {
  const [tasks, setTasks] = useState({
    todo: [],
    "in-progress": [],
    done: [],
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const start = tasks[source.droppableId];
    const finish = tasks[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(start);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      setTasks({
        ...tasks,
        [source.droppableId]: newTasks,
      });
    } else {
      const startTasks = Array.from(start);
      const finishTasks = Array.from(finish);
      const [removed] = startTasks.splice(source.index, 1);
      finishTasks.splice(destination.index, 0, removed);

      setTasks({
        ...tasks,
        [source.droppableId]: startTasks,
        [destination.droppableId]: finishTasks,
      });
    }
  };

  const addTask = (columnId) => {
    const newTask = {
      id: Date.now().toString(),
      title: "New Task",
      description: "Click to edit",
      timestamp: new Date().toISOString(),
    };

    setTasks({
      ...tasks,
      [columnId]: [...tasks[columnId], newTask],
    });
    toast.success("Task added!");
  };

  return (
    <div className="min-h-screen p-8">
      <Toaster position="top-right" />

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-secondary">Task Management</h1>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Todo Column */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">To Do</h2>
              <button
                onClick={() => addTask("todo")}
                className="btn btn-primary"
              >
                <FiPlus className="inline-block mr-1" />
                Add Task
              </button>
            </div>
            <Droppable droppableId="todo">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="task-column"
                >
                  {tasks.todo.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="task-card"
                        >
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {task.description}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* In Progress Column */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">In Progress</h2>
              <button
                onClick={() => addTask("in-progress")}
                className="btn btn-primary"
              >
                <FiPlus className="inline-block mr-1" />
                Add Task
              </button>
            </div>
            <Droppable droppableId="in-progress">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="task-column"
                >
                  {tasks["in-progress"].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="task-card"
                        >
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {task.description}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Done Column */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Done</h2>
              <button
                onClick={() => addTask("done")}
                className="btn btn-primary"
              >
                <FiPlus className="inline-block mr-1" />
                Add Task
              </button>
            </div>
            <Droppable droppableId="done">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="task-column"
                >
                  {tasks.done.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="task-card"
                        >
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {task.description}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
      <div>
        <Login></Login>
      </div>
    </div>
  );
}

export default App;
