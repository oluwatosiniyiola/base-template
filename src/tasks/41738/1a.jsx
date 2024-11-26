import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const priorityLevels = ["Low", "Medium", "High"];
const statusOptions = ["To Do", "In Progress", "Completed"];

const TaskCard = ({ task, onStatusChange, onDelete }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{task.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
      <p className="text-sm text-gray-600">Priority: {task.priority}</p>
      <div className="flex items-center justify-between mt-2">
        <Select
          value={task.status}
          onValueChange={(value) => onStatusChange(task.id, value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
      </div>
    </CardContent>
  </Card>
);

const AddTaskDialog = ({ onAddTask }) => {
  const [newTask, setNewTask] = useState({
    name: "",
    dueDate: "",
    priority: "Medium",
    description: "",
    status: "To Do",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({ ...newTask, id: Date.now() });
    setNewTask({
      name: "",
      dueDate: "",
      priority: "Medium",
      description: "",
      status: "To Do",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-4">Add New Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              value={newTask.priority}
              onValueChange={(value) =>
                setNewTask({ ...newTask, priority: value })
              }
            >
              {priorityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
          </div>
          <Button type="submit">Add Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const changeTaskStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (task.name.toLowerCase().includes(search.toLowerCase()) ||
        task.priority.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || task.status === statusFilter)
  );

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Task Management App</h1>
      <div className="mb-4 space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3"
        />
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="w-full sm:w-1/3"
        >
          <option value="All">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
      </div>
      <AddTaskDialog onAddTask={addTask} />
      <div>
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={changeTaskStatus}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}
