import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const teamMembers = ["Alice", "Bob", "Charlie", "Dana"];

function TaskForm({ addTask }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
    priority: "low",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.title && task.description && task.assignee) {
      addTask(task);
      setTask({
        title: "",
        description: "",
        dueDate: "",
        assignee: "",
        priority: "low",
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            placeholder="Task Title"
            required
            className="mb-2"
          />
          <Textarea
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            placeholder="Description"
            required
            className="mb-2"
          />
          <Input
            type="date"
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            className="mb-2"
          />
          <Select
            value={task.assignee}
            onValueChange={(value) => setTask({ ...task, assignee: value })}
            required
            className="mb-2"
          >
            <SelectItem value="">Choose Assignee</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member} value={member}>
                {member}
              </SelectItem>
            ))}
          </Select>
          <Select
            value={task.priority}
            onValueChange={(value) => setTask({ ...task, priority: value })}
            className="mb-2"
          >
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </Select>
          <Button type="submit">Add Task</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function KanbanBoard({ tasks, updateTaskStatus }) {
  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  useEffect(() => {
    const initialColumns = tasks.reduce(
      (acc, task) => {
        acc[task.status].push(task);
        return acc;
      },
      { todo: [], inProgress: [], done: [] }
    );
    setColumns(initialColumns);
  }, [tasks]);

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, status) => {
    let id = e.dataTransfer.getData("text");
    const updatedTask = tasks.find((task) => task.id === id);
    if (updatedTask && updatedTask.status !== status) {
      updateTaskStatus(updatedTask.id, status);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Kanban Board</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row justify-between gap-4">
        {["todo", "inProgress", "done"].map((status) => (
          <div
            key={status}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
            className="flex-1 bg-slate-800 p-2 rounded min-h-[200px]"
          >
            <h2 className="text-lg font-bold mb-2">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h2>
            {columns[status].map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text", task.id)}
                className={cn(
                  "mb-2 p-2 rounded bg-slate-700 border border-slate-600",
                  {
                    "border-green-500": task.priority === "low",
                    "border-yellow-500": task.priority === "medium",
                    "border-red-500": task.priority === "high",
                  }
                )}
              >
                <h3>{task.title}</h3>
                <p>{task.dueDate}</p>
                <p>Assignee: {task.assignee}</p>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TaskSummary({ tasks }) {
  const statusCount = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {["todo", "inProgress", "done"].map((status) => (
          <p key={status}>
            {" "}
            {status.charAt(0).toUpperCase() + status.slice(1)}:{" "}
            {statusCount[status] || 0}
          </p>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={() => window.location.reload()}>Refresh Board</Button>
      </CardFooter>
    </Card>
  );
}

export default function App11() {
  const [tasks, setTasks] = useState([]);

  const addTask = (newTask) => {
    setTasks([
      ...tasks,
      {
        id: `task-${Date.now()}`,
        status: "todo",
        ...newTask,
      },
    ]);
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className="p-4 bg-slate-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Team Collaboration Board</h1>
      <TaskForm addTask={addTask} />
      <KanbanBoard tasks={tasks} updateTaskStatus={updateTaskStatus} />
      <TaskSummary tasks={tasks} />
    </div>
  );
}
