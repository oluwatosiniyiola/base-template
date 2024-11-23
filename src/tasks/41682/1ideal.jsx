import React, { useState } from "react";

const teamMembers = ["Alice", "Bob", "Charlie"];
const priorities = ["Low", "Medium", "High"];
const statuses = ["To Do", "In Progress", "Done"];

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
    priority: "Low",
    status: "To Do",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = () => {
    if (
      newTask.title &&
      newTask.description &&
      newTask.dueDate &&
      newTask.assignee
    ) {
      setTasks([...tasks, { ...newTask }]);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        assignee: "",
        priority: "Low",
        status: "To Do",
      });
    }
  };

  const handleDragStart = (e, taskIndex) => {
    e.dataTransfer.setData("taskIndex", taskIndex);
  };

  const handleDrop = (e, newStatus) => {
    const taskIndex = e.dataTransfer.getData("taskIndex");
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].status = newStatus;
    setTasks(updatedTasks);
  };

  const countTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status).length;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6">
        Team Collaboration Board
      </h1>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Add Task Card */}
        <div className="bg-gray-800 rounded p-4">
          <h2 className="text-lg font-bold mb-2">Add New Task</h2>
          <p className="text-sm text-gray-400 mb-4">
            Fill in the details to create a task.
          </p>
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              placeholder="Task Title"
              className="w-full p-2 bg-gray-700 text-white rounded"
              required
            />
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              placeholder="Task Description"
              className="w-full p-2 bg-gray-700 text-white rounded"
              required
            ></textarea>
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              required
            />
            <select
              name="assignee"
              value={newTask.assignee}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              required
            >
              <option value="">Select Assignee</option>
              {teamMembers.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
            <select
              name="priority"
              value={newTask.priority}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-4 rounded"
          >
            Add Task
          </button>
        </div>

        {/* Kanban Board */}
        <div className="bg-gray-800 rounded sm:col-span-2 p-4">
          <h2 className="text-lg font-bold mb-2">Kanban Board</h2>
          <p className="text-sm text-gray-400 mb-4">
            Manage and track your tasks.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {statuses.map((status) => (
              <div
                key={status}
                className="p-4 bg-gray-700 rounded"
                onDrop={(e) => handleDrop(e, status)}
                onDragOver={(e) => e.preventDefault()}
              >
                <h3 className="text-lg font-bold mb-2">{status}</h3>
                <div className="space-y-2">
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        className="p-2 bg-gray-600 rounded"
                      >
                        <h4 className="font-semibold">{task.title}</h4>
                        <p className="text-sm">Priority: {task.priority}</p>
                        <p className="text-sm">Due: {task.dueDate}</p>
                        <p className="text-sm">Assignee: {task.assignee}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gray-800 rounded p-4">
          <h2 className="text-lg font-bold mb-2">Task Summary</h2>
          <p className="text-sm text-gray-400 mb-4">
            Overview of task distribution.
          </p>
          <ul className="space-y-2">
            {statuses.map((status) => (
              <li key={status}>
                {countTasksByStatus(status)} {status}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setTasks([...tasks])}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 mt-4 rounded"
          >
            Refresh Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
