import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ status: "", search: "" });
  const [newTask, setNewTask] = useState({
    name: "",
    dueDate: "",
    priority: "",
    description: "",
  });

  const handleAddTask = () => {
    if (!newTask.name || !newTask.dueDate || !newTask.priority) return;
    setTasks([
      ...tasks,
      {
        ...newTask,
        status: "To Do",
        id: Date.now(),
      },
    ]);
    setNewTask({ name: "", dueDate: "", priority: "", description: "" });
  };

  const handleStatusChange = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      filter.search === "" ||
      task.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      task.priority.toLowerCase().includes(filter.search.toLowerCase());
    const matchesStatus = filter.status === "" || task.status === filter.status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by name or priority"
              className="border rounded p-2 w-full"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
            <select
              className="border rounded p-2 w-full"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Task Name"
              className="border rounded p-2 w-full"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
            <input
              type="date"
              className="border rounded p-2 w-full"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
            <select
              className="border rounded p-2 w-full"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <textarea
              placeholder="Description"
              className="border rounded p-2 w-full"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle>{task.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Due Date:</strong> {task.dueDate}
              </p>
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
              <p>
                <strong>Status:</strong> {task.status}
              </p>
              <div className="flex gap-2 mt-2">
                {["To Do", "In Progress", "Completed"].map(
                  (status) =>
                    status !== task.status && (
                      <button
                        key={status}
                        className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                        onClick={() => handleStatusChange(task.id, status)}
                      >
                        Mark as {status}
                      </button>
                    )
                )}
                <button
                  className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default App;
