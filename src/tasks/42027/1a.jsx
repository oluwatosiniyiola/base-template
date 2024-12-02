import React, { useState, useMemo } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Task({ task, onToggle, onDelete }) {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
          />
          <span className={`ml-2 ${task.completed ? "line-through" : ""}`}>
            {task.title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between">
        <span className="text-xs">Priority: {task.priority}</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="icon">
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit" onClick={() => onDelete(task.id)}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDate, setNewTaskDate] = useState(new Date());
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const addTask = () => {
    if (newTask) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTask,
          date: newTaskDate,
          priority: newTaskPriority,
          completed: false,
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

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((task) => !task.completed);
    if (filter === "completed") return tasks.filter((task) => task.completed);
    return tasks;
  }, [tasks, filter]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const priorities = { High: 1, Medium: 2, Low: 3 };
      return priorities[a.priority] - priorities[b.priority];
    });
  }, [filteredTasks]);

  return (
    <div
      className={`min-h-screen p-4 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <Button onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        <Card>
          <CardContent>
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add new task"
            />
            <div className="flex flex-col sm:flex-row mt-2 gap-2">
              <Select
                value={newTaskPriority}
                onValueChange={setNewTaskPriority}
              >
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </Select>
              <Button onClick={addTask}>Add Task</Button>
            </div>
          </CardContent>
        </Card>

        <div className="my-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
            className="ml-2"
          >
            Active
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            className="ml-2"
          >
            Completed
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            {sortedTasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  value={newTaskDate}
                  onChange={setNewTaskDate}
                  className="mx-auto"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
