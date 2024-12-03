import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Label,
} from "@/components/ui/card";

const priorities = ["Low", "Medium", "High"];

function Task({ task, onUpdate, onDelete, onMove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        {isEditing ? (
          <Input
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            className="mb-2"
          />
        ) : (
          <CardTitle>{task.title}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <textarea
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
            className="w-full h-24 mb-2"
          />
        ) : (
          <CardDescription>{task.description}</CardDescription>
        )}
        <div className="flex justify-between items-center">
          <Select
            value={editedTask.priority}
            onChange={(value) =>
              setEditedTask({ ...editedTask, priority: value })
            }
            disabled={!isEditing}
          >
            {priorities.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </Select>
          <Input
            type="date"
            value={editedTask.dueDate}
            onChange={(e) =>
              setEditedTask({ ...editedTask, dueDate: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={() => setIsEditing(false)} variant="destructive">
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
            <Button onClick={() => onDelete(task.id)} variant="destructive">
              Delete
            </Button>
          </>
        )}
        <Button onClick={() => onMove(task.id)}>Move</Button>
      </CardFooter>
    </Card>
  );
}

function KanbanBoard({ tasks, status, onUpdate, onDelete, onMove }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">{status}</h2>
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMove={(id) => onMove(id, status)}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("none");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const addTask = (newTask) => {
    setTasks([...tasks, { id: Date.now(), ...newTask, status: "To Do" }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const moveTask = (id, fromStatus) => {
    const toStatus =
      fromStatus === "To Do"
        ? "In Progress"
        : fromStatus === "In Progress"
        ? "Completed"
        : "To Do";
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: toStatus } : t)));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "none") return true;
    if (filter === "dueDate") return true; // Here you might want to implement actual sorting or filtering logic
    if (filter === "priority") return true; // Same here, implement sorting by priority
    return true;
  });

  return (
    <div className={`min-h-screen p-4 bg-background ${darkMode ? "dark" : ""}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <Switch checked={darkMode} onCheckedChange={setDarkMode}>
            <Label>Dark Mode</Label>
          </Switch>
        </div>
        <div className="flex space-x-4">
          <Button onClick={() => setFilter("none")}>All</Button>
          <Button onClick={() => setFilter("dueDate")}>By Due Date</Button>
          <Button onClick={() => setFilter("priority")}>By Priority</Button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mt-4">
          {["To Do", "In Progress", "Completed"].map((status) => (
            <div key={status} className="sm:w-1/3">
              <KanbanBoard
                tasks={filteredTasks.filter((t) => t.status === status)}
                status={status}
                onUpdate={updateTask}
                onDelete={deleteTask}
                onMove={moveTask}
              />
            </div>
          ))}
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTask({
                  title: e.target.title.value,
                  description: e.target.description.value,
                  dueDate: e.target.dueDate.value,
                  priority: e.target.priority.value,
                });
                e.target.reset();
              }}
            >
              <Input
                name="title"
                placeholder="Title"
                className="mb-2"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full h-24 mb-2"
                required
              ></textarea>
              <div className="flex justify-between mb-2">
                <Select name="priority">
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </Select>
                <Input type="date" name="dueDate" required />
              </div>
              <Button type="submit">Add Task</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
