import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("none");
  const [editingTask, setEditingTask] = useState(null);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: formValues.title,
      description: formValues.description,
      dueDate: formValues.dueDate,
      priority: formValues.priority,
      status: "To Do",
    };
    setTasks([...tasks, newTask]);
    resetForm();
  };

  const editTask = (task) => {
    setEditingTask(task.id);
    setFormValues({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
    });
  };

  const updateTask = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editingTask ? { ...task, ...formValues } : task
      )
    );
    setEditingTask(null);
    resetForm();
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "none") return true;
    return task.priority === filter;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (filter === "due") return new Date(a.dueDate) - new Date(b.dueDate);
    return 0;
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormValues({
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
    });
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="container mx-auto py-6">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl">Task Management</h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 border rounded-lg bg-gray-200 dark:bg-gray-800"
          >
            Toggle Dark Mode
          </button>
        </header>

        <div className="mb-4">
          <select onChange={handleFilterChange} className="border p-2 rounded">
            <option value="none">No Filter</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
            <option value="due">Sort by Due Date</option>
          </select>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleFormChange}
              placeholder="Title"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleFormChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              name="dueDate"
              value={formValues.dueDate}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
            />
            <select
              name="priority"
              value={formValues.priority}
              onChange={handleFormChange}
              className="w-full p-2 border rounded"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <div className="flex space-x-4">
              <button
                onClick={editingTask ? updateTask : addTask}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {editingTask ? "Update Task" : "Add Task"}
              </button>
              {editingTask && (
                <button
                  onClick={() => {
                    setEditingTask(null);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["To Do", "In Progress", "Completed"].map((status) => (
            <div
              key={status}
              className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <h2 className="text-xl font-semibold">{status}</h2>
              {sortedTasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <Card key={task.id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{task.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{task.description}</CardDescription>
                      <div className="text-sm text-gray-500">
                        Due: {task.dueDate} | Priority: {task.priority}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <button
                        onClick={() =>
                          updateTaskStatus(task.id, getNextStatus(status))
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Move to {getNextStatus(status)}
                      </button>
                      <button
                        onClick={() => editTask(task)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function getNextStatus(status) {
    switch (status) {
      case "To Do":
        return "In Progress";
      case "In Progress":
        return "Completed";
      default:
        return "To Do";
    }
  }

  function updateTaskStatus(id, newStatus) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  }
};

export default TaskBoard;
