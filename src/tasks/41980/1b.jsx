import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const priorityColors = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

const TaskCard = ({ task, onEdit, onDelete, onMove }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{task.title}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full text-white ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{task.description}</p>
        <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </Button>
        </div>
        <div className="mt-2 flex justify-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onMove(task.id, "To Do")}
          >
            To Do
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onMove(task.id, "In Progress")}
          >
            In Progress
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onMove(task.id, "Completed")}
          >
            Completed
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskForm = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [priority, setPriority] = useState(task?.priority || "Medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: task?.id,
      title,
      description,
      dueDate,
      priority,
      status: task?.status || "To Do",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <Select value={priority} onValueChange={setPriority}>
        <Select.Trigger>
          <Select.Value placeholder="Select priority" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="High">High</Select.Item>
          <Select.Item value="Medium">Medium</Select.Item>
          <Select.Item value="Low">Low</Select.Item>
        </Select.Content>
      </Select>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

const Column = ({ title, tasks, onEdit, onDelete, onMove }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("none");
  const [darkMode, setDarkMode] = useState(false);

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now() }]);
    setShowForm(false);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const filteredTasks = tasks.sort((a, b) => {
    if (filter === "priority") {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    } else if (filter === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "dark" : ""}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Task Management System</h1>
          <div className="flex items-center space-x-4">
            <Select value={filter} onValueChange={setFilter}>
              <Select.Trigger>
                <Select.Value placeholder="Filter tasks" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="none">No filter</Select.Item>
                <Select.Item value="priority">By Priority</Select.Item>
                <Select.Item value="dueDate">By Due Date</Select.Item>
              </Select.Content>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
          </div>
        </div>

        {showForm || editingTask ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingTask ? "Edit Task" : "Add New Task"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskForm
                task={editingTask}
                onSave={editingTask ? updateTask : addTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <Button onClick={() => setShowForm(true)} className="mb-8">
            Add New Task
          </Button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Column
            title="To Do"
            tasks={filteredTasks.filter((t) => t.status === "To Do")}
            onEdit={setEditingTask}
            onDelete={deleteTask}
            onMove={moveTask}
          />
          <Column
            title="In Progress"
            tasks={filteredTasks.filter((t) => t.status === "In Progress")}
            onEdit={setEditingTask}
            onDelete={deleteTask}
            onMove={moveTask}
          />
          <Column
            title="Completed"
            tasks={filteredTasks.filter((t) => t.status === "Completed")}
            onEdit={setEditingTask}
            onDelete={deleteTask}
            onMove={moveTask}
          />
        </div>
      </div>
    </div>
  );
}
