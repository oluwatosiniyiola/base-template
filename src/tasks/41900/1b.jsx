import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  SelectItem,
  Label,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Pagination,
} from "@/components/ui";

const priorities = ["low", "medium", "high"];
const statuses = ["pending", "in-progress", "completed"];

function TaskCard({ task, onEdit, onDelete }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>{task.status}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{task.description}</p>
        <p>Due: {task.due_date}</p>
        <p>Priority: {task.priority}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onEdit(task)}>Edit</Button>
        <Button onClick={() => onDelete(task.id)} variant="destructive">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

function TaskForm({ isOpen, onClose, onSubmit, initialTask = {} }) {
  const [task, setTask] = useState(initialTask);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...task, id: initialTask.id || Date.now() });
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="space-y-0">
            <h2>{initialTask.id ? "Edit Task" : "Add Task"}</h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={task.title || ""}
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={task.description || ""}
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  type="date"
                  id="due_date"
                  value={task.due_date || ""}
                  onChange={(e) =>
                    setTask({ ...task, due_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  id="priority"
                  value={task.priority || "medium"}
                  onChange={(value) => setTask({ ...task, priority: value })}
                >
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={task.status || "pending"}
                  onChange={(value) => setTask({ ...task, status: value })}
                >
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="submit">Save</Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState({ status: "", priority: "" });
  const [sortBy, setSortBy] = useState("due_date");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  useEffect(() => {
    // This would typically fetch tasks from an API or localStorage
    setTasks([
      {
        id: 1,
        title: "Complete Project",
        description: "Finish the React project",
        due_date: "2023-05-01",
        priority: "high",
        status: "in-progress",
      },
      // ... more sample tasks
    ]);
  }, []);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredAndSortedTasks = tasks
    .filter((task) => (filter.status ? task.status === filter.status : true))
    .filter((task) =>
      filter.priority ? task.priority === filter.priority : true
    )
    .sort((a, b) => {
      if (sortBy === "due_date")
        return new Date(a.due_date) - new Date(b.due_date);
      return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
    });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredAndSortedTasks.slice(
    indexOfFirstTask,
    indexOfLastTask
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setEditTask(null);
          }}
        >
          Add Task
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Select
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          value={filter.status}
        >
          <SelectItem value="">All Statuses</SelectItem>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </Select>
        <Select
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          value={filter.priority}
        >
          <SelectItem value="">All Priorities</SelectItem>
          {priorities.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </Select>
        <Select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <SelectItem value="due_date">Sort by Due Date</SelectItem>
          <SelectItem value="priority">Sort by Priority</SelectItem>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => {
              setIsModalOpen(true);
              setEditTask(task);
            }}
            onDelete={deleteTask}
          />
        ))}
      </div>

      <Pagination
        total={filteredAndSortedTasks.length}
        pageSize={tasksPerPage}
        siblings={1}
        currentPage={currentPage}
        onChange={setCurrentPage}
      />

      <TaskForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editTask ? updateTask : addTask}
        initialTask={editTask || {}}
      />
    </div>
  );
}
