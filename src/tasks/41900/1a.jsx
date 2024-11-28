import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";

// Sample initial tasks
const initialTasks = [
  {
    id: 1,
    title: "Complete project",
    description: "Finish the React project",
    due_date: "2023-07-30",
    priority: "high",
    status: "in-progress",
  },
  {
    id: 2,
    title: "Buy groceries",
    description: "Get milk, eggs, and bread",
    due_date: "2023-07-25",
    priority: "low",
    status: "pending",
  },
  // Add more sample tasks here...
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ priority: "", status: "" });
  const [sortBy, setSortBy] = useState("due_date");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "",
    status: "",
  });
  const [editingTask, setEditingTask] = useState(null);

  const tasksPerPage = 10;

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(
      (task) =>
        (!filters.priority || task.priority === filters.priority) &&
        (!filters.status || task.status === filters.status)
    )
    .sort((a, b) => {
      if (sortBy === "due_date") {
        return new Date(a.due_date) - new Date(b.due_date);
      } else {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });

  // Paginate tasks
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleAddTask = () => {
    setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
    setNewTask({
      title: "",
      description: "",
      due_date: "",
      priority: "",
      status: "",
    });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = () => {
    setTasks(tasks.map((t) => (t.id === editingTask.id ? editingTask : t)));
    setEditingTask(null);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const TaskCard = ({ task }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{task.description}</p>
        <p>Due: {task.due_date}</p>
        <p>Priority: {task.priority}</p>
        <p>Status: {task.status}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleEditTask(task)} className="mr-2">
          Edit
        </Button>
        <Button onClick={() => handleDeleteTask(task.id)} variant="destructive">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Management App</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <Select
          onValueChange={(value) => setFilters({ ...filters, priority: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="due_date">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="due_date" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) =>
                    setNewTask({ ...newTask, due_date: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, priority: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, status: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <Pagination
        className="mt-4"
        count={Math.ceil(filteredTasks.length / tasksPerPage)}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
      />

      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-due_date" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="edit-due_date"
                  type="date"
                  value={editingTask.due_date}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, due_date: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-priority" className="text-right">
                  Priority
                </Label>
                <Select
                  value={editingTask.priority}
                  onValueChange={(value) =>
                    setEditingTask({ ...editingTask, priority: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingTask.status}
                  onValueChange={(value) =>
                    setEditingTask({ ...editingTask, status: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleUpdateTask}>Update Task</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
