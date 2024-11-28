import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Task Management App
export default function App() {
  // State for tasks
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ priority: "", status: "" });
  const [sortKey, setSortKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "low",
    status: "pending",
  });

  const ITEMS_PER_PAGE = 10;

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for adding/updating tasks
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id ? { ...form, id: task.id } : task
        )
      );
    } else {
      setTasks((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    closeDialog();
  };

  // Open dialog with or without a task for editing
  const openDialog = (task = null) => {
    setEditingTask(task);
    setForm(
      task || {
        title: "",
        description: "",
        due_date: "",
        priority: "low",
        status: "pending",
      }
    );
    setDialogOpen(true);
  };

  // Close dialog
  const closeDialog = () => {
    setEditingTask(null);
    setForm({
      title: "",
      description: "",
      due_date: "",
      priority: "low",
      status: "pending",
    });
    setDialogOpen(false);
  };

  // Handle task deletion
  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) =>
      filters.priority ? task.priority === filters.priority : true
    )
    .filter((task) => (filters.status ? task.status === filters.status : true))
    .sort((a, b) => {
      if (sortKey === "due_date") {
        return new Date(a.due_date) - new Date(b.due_date);
      } else if (sortKey === "priority") {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  // Paginate tasks
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 space-y-4">
      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex gap-2">
          <select
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            <option value="">Filter by Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Filter by Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <select onChange={(e) => setSortKey(e.target.value)}>
          <option value="">Sort by</option>
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
        </select>
        <Button onClick={() => openDialog()}>Add Task</Button>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedTasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <p>Due Date: {task.due_date}</p>
                <p>Priority: {task.priority}</p>
                <p>Status: {task.status}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => openDialog(task)}>Edit</Button>
              <Button onClick={() => handleDelete(task.id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        {Array.from(
          { length: Math.ceil(filteredTasks.length / ITEMS_PER_PAGE) },
          (_, i) => (
            <Button key={i + 1} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </Button>
          )
        )}
      </div>

      {/* Dialog for adding/updating tasks */}
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Edit your task details"
                : "Fill in the task details"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <input
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                type="date"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
