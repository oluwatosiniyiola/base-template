import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["To Do", "In Progress", "Completed"];

function TaskCard({ task, onDelete, onStatusChange }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{task.name}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Due: {task.dueDate} | Priority: {task.priority}
          </div>
        </CardHeader>
        <CardContent>{task.description}</CardContent>
        <CardFooter className="flex justify-between">
          <Select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
          >
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </Select>
          <Button onClick={() => setOpen(true)} variant="destructive">
            Delete
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task.id);
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    dueDate: "",
    priority: PRIORITIES[0],
    description: "",
    status: STATUSES[0],
  });
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // This would typically fetch from an API, but for this example, we'll initialize with some data
    setTasks([
      {
        id: 1,
        name: "Learn React",
        dueDate: "2023-05-10",
        priority: "High",
        description: "Finish the React course",
        status: "In Progress",
      },
      {
        id: 2,
        name: "Grocery Shopping",
        dueDate: "2023-05-15",
        priority: "Medium",
        description: "Buy fruits and vegetables",
        status: "To Do",
      },
    ]);
  }, []);

  const addTask = () => {
    if (newTask.name) {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
      setNewTask({
        name: "",
        dueDate: "",
        priority: PRIORITIES[0],
        description: "",
        status: STATUSES[0],
      });
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const changeStatus = (id, status) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "All" || task.status === filterStatus) &&
      (task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.priority.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Select onValueChange={setFilterStatus}>
          <SelectItem value="All">All Tasks</SelectItem>
          {STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Input
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              placeholder="Task Name"
            />
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
            <Select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
            >
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </Select>
            <Input
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Description"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={addTask}>Add Task</Button>
          </CardFooter>
        </Card>

        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onStatusChange={changeStatus}
          />
        ))}
      </div>
    </div>
  );
}
