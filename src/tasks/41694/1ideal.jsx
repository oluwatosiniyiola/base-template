import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    generateCalendar();
  }, []);

  const generateCalendar = () => {
    const current = new Date();
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const newCalendar = [];
    let week = [];
    for (let i = 0; i < firstDay; i++) week.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      if (week.length === 7) {
        newCalendar.push(week);
        week = [];
      }
      week.push(new Date(year, month, day));
    }

    if (week.length) newCalendar.push(week);
    setCalendar(newCalendar);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = () => {
    if (newTask.title.trim() && newTask.description.trim() && newTask.dueDate) {
      setTasks([...tasks, { ...newTask, completed: false }]);
      setNewTask({ title: "", description: "", dueDate: "", priority: "Low" });
    }
  };

  const handleMarkCompleted = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = true;
    setTasks(updatedTasks);
  };

  const getTasksForDate = (date) => {
    return tasks.filter(
      (task) => new Date(task.dueDate).toDateString() === date.toDateString()
    );
  };

  const getOverdueTasks = () => {
    const today = new Date();
    return tasks.filter(
      (task) => new Date(task.dueDate) < today && !task.completed
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6">Task Scheduler</h1>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Add Task Card */}
        <Card>
          <CardHeader>
            <CardTitle>Add Task</CardTitle>
            <CardDescription>
              Fill in the details to add a new task.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <Select
              name="priority"
              value={newTask.priority}
              onValueChange={(value) =>
                setNewTask({ ...newTask, priority: value })
              }
            >
              <SelectTrigger className="w-full bg-gray-700 text-white p-2 rounded">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                {["Low", "Medium", "High"].map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter>
            <button
              onClick={handleAddTask}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Task
            </button>
          </CardFooter>
        </Card>

        {/* Calendar Card */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              Click a date to view associated tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center text-white">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2">
              {calendar.map((week, weekIndex) =>
                week.map((date, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`p-2 rounded ${
                      date
                        ? "cursor-pointer hover:bg-gray-700"
                        : "bg-gray-800 text-gray-600"
                    } ${
                      date &&
                      getTasksForDate(date).length > 0 &&
                      "bg-blue-500 text-white"
                    }`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date ? date.getDate() : ""}
                  </div>
                ))
              )}
            </div>
            {selectedDate && (
              <div className="mt-4 p-4 bg-gray-800 rounded">
                <h3 className="font-bold mb-2 text-white">
                  Tasks for {selectedDate.toDateString()}:
                </h3>
                <ul>
                  {getTasksForDate(selectedDate).map((task, index) => (
                    <li key={index} className="text-white">
                      {task.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Tasks Card */}
        <Card>
          <CardHeader>
            <CardTitle>Overdue Tasks</CardTitle>
            <CardDescription>
              Tasks that have missed their deadlines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {getOverdueTasks().map((task, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center mb-2 text-black" // Text color black for overdue tasks
                >
                  <span>{task.title}</span>
                  <button
                    onClick={() => handleMarkCompleted(index)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Mark Completed
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
