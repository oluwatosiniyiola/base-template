import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskDate, setTaskDate] = useState(null);

  const addTask = () => {
    if (taskText) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: taskText,
          completed: false,
          priority,
          date: taskDate,
        },
      ]);
      setTaskText("");
      setPriority("Medium");
      setTaskDate(null);
    }
  };

  const toggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = () => {
    setTasks(tasks.filter((task) => task.id !== taskToDelete));
    setTaskToDelete(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleDateChange = (e) => {
    setTaskDate(e.target.value);
  };

  const handleCalendarDateSelect = (date) => {
    setSelectedDate(date);
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(2024, 11, 0).getDate(); // December has 31 days
    let calendarDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `2024-12-${i < 10 ? "0" + i : i}`;
      calendarDays.push(
        <button
          key={dateString}
          onClick={() => handleCalendarDateSelect(dateString)}
          className={`p-2 rounded-md ${
            selectedDate === dateString
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return <div className="grid grid-cols-7 gap-2">{calendarDays}</div>;
  };

  return (
    <div
      className={isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}
    >
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Task Manager</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            Toggle Dark Mode
          </button>
        </div>

        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Add a task"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-1/2"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="date"
            value={taskDate}
            onChange={handleDateChange}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <Button
            onClick={addTask}
            className="px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Task
          </Button>
        </div>

        <div className="mb-4 flex space-x-4">
          <Button onClick={() => setFilter("all")} className="px-4 py-2">
            All
          </Button>
          <Button onClick={() => setFilter("active")} className="px-4 py-2">
            Active
          </Button>
          <Button onClick={() => setFilter("completed")} className="px-4 py-2">
            Completed
          </Button>
        </div>

        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <Card key={task.id} className="flex justify-between items-center">
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleCompletion(task.id)}
                  />
                  <span
                    className={
                      task.completed ? "line-through text-gray-500" : ""
                    }
                  >
                    {task.text}
                  </span>
                  <span className="text-sm text-gray-400">{task.priority}</span>
                  {task.date && (
                    <span className="text-sm text-gray-500">{task.date}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger>
                    <Button
                      onClick={() => setTaskToDelete(task.id)}
                      className="text-red-500"
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Task</DialogTitle>
                    </DialogHeader>
                    <CardContent>
                      <p>Are you sure you want to delete this task?</p>
                    </CardContent>
                    <DialogFooter>
                      <Button onClick={() => setTaskToDelete(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={deleteTask}
                        className="bg-red-500 text-white"
                      >
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
          <div className="mb-4">{renderCalendar()}</div>
          {selectedDate && (
            <div className="mt-4 p-4 border border-gray-300 rounded-md">
              <h3 className="text-xl">Tasks for {selectedDate}:</h3>
              <ul className="space-y-2">
                {tasks
                  .filter((task) => task.date === selectedDate)
                  .map((task) => (
                    <li
                      key={task.id}
                      className="flex justify-between items-center"
                    >
                      <span>{task.text}</span>
                      <span className="text-sm text-gray-500">
                        {task.priority}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
