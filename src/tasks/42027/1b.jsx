import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const priorities = ["High", "Medium", "Low"];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          date: selectedDate,
          priority,
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div
      className={`min-h-screen p-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New task"
                className="flex-grow"
              />
              <Select value={priority} onValueChange={setPriority}>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
              <Button onClick={addTask}>Add Task</Button>
            </div>

            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
              >
                All
              </Button>
              <Button
                onClick={() => setFilter("active")}
                variant={filter === "active" ? "default" : "outline"}
              >
                Active
              </Button>
              <Button
                onClick={() => setFilter("completed")}
                variant={filter === "completed" ? "default" : "outline"}
              >
                Completed
              </Button>
            </div>

            <ul className="space-y-2">
              {sortedTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <span className={task.completed ? "line-through" : ""}>
                      {task.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{task.priority}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this task?</p>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            onClick={() => deleteTask(task.id)}
                            variant="destructive"
                          >
                            Delete
                          </Button>
                          <Button variant="outline">Cancel</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">
                Tasks for {selectedDate.toDateString()}
              </h2>
              <ul className="space-y-2">
                {sortedTasks
                  .filter(
                    (task) =>
                      task.date.getDate() === selectedDate.getDate() &&
                      task.date.getMonth() === selectedDate.getMonth() &&
                      task.date.getFullYear() === selectedDate.getFullYear()
                  )
                  .map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{task.text}</span>
                      <span className="text-sm">{task.priority}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
