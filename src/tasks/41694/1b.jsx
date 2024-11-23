import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate) {
      alert("Please fill in all fields");
      return;
    }
    addTask({ title, description, dueDate, priority, completed: false });
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          {priorityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <Button type="submit">Add Task</Button>
    </form>
  );
}

function Calendar({ tasks, setTasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getTasksForDate = (date) => {
    return tasks.filter(
      (task) => new Date(task.dueDate).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={handlePrevMonth}>&lt;</Button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <Button onClick={handleNextMonth}>&gt;</Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
        {days.map((day) => {
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          );
          const tasksForDate = getTasksForDate(date);
          return (
            <Popover key={day}>
              <PopoverTrigger asChild>
                <Button
                  className={`w-full h-12 ${
                    tasksForDate.length > 0 ? "bg-blue-500" : ""
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  {day}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <h3 className="font-bold mb-2">
                  Tasks for {date.toDateString()}:
                </h3>
                {tasksForDate.length > 0 ? (
                  <ul>
                    {tasksForDate.map((task) => (
                      <li key={task.title}>
                        {task.title} - {task.priority}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tasks for this date.</p>
                )}
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
}

function OverdueTasks({ tasks, setTasks }) {
  const overdueTasks = tasks.filter(
    (task) => new Date(task.dueDate) < new Date() && !task.completed
  );

  const handleMarkCompleted = (taskToComplete) => {
    setTasks(
      tasks.map((task) =>
        task === taskToComplete ? { ...task, completed: true } : task
      )
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Overdue Tasks</h3>
      {overdueTasks.length > 0 ? (
        <ul className="space-y-2">
          {overdueTasks.map((task) => (
            <li key={task.title} className="flex justify-between items-center">
              <span>
                {task.title} - Due: {task.dueDate}
              </span>
              <Button onClick={() => handleMarkCompleted(task)}>
                Mark Completed
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No overdue tasks.</p>
      )}
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Scheduler</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Add Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm addTask={addTask} />
          </CardContent>
        </Card>
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar tasks={tasks} setTasks={setTasks} />
          </CardContent>
        </Card>
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <OverdueTasks tasks={tasks} setTasks={setTasks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
