import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const teamMembers = ["Alice", "Bob", "Charlie", "David"];
const statuses = ["To Do", "In Progress", "Done"];
const priorities = ["Low", "Medium", "High"];

const TaskCard = ({
  task,
  onDragStart,
  onStatusChange,
  onPriorityChange,
  onComplete,
}) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, task.id)}
    className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 cursor-move"
  >
    <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
    <p className="text-sm text-gray-400 mb-2">Assignee: {task.assignee}</p>
    <p className="text-sm text-gray-400 mb-2">Due: {task.dueDate}</p>
    <div className="flex justify-between items-center mb-2">
      <Select
        value={task.status}
        onValueChange={(value) => onStatusChange(task.id, value)}
      >
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </Select>
      <Select
        value={task.priority}
        onValueChange={(value) => onPriorityChange(task.id, value)}
      >
        {priorities.map((priority) => (
          <SelectItem key={priority} value={priority}>
            {priority}
          </SelectItem>
        ))}
      </Select>
    </div>
    <Button onClick={() => onComplete(task.id)} variant="outline" size="sm">
      Complete
    </Button>
  </div>
);

const KanbanBoard = ({
  tasks,
  onDragStart,
  onDrop,
  onStatusChange,
  onPriorityChange,
  onComplete,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {statuses.map((status) => (
      <div
        key={status}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDrop(e, status)}
        className="bg-gray-900 p-4 rounded-lg"
      >
        <h3 className="text-xl font-semibold mb-4">{status}</h3>
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              onStatusChange={onStatusChange}
              onPriorityChange={onPriorityChange}
              onComplete={onComplete}
            />
          ))}
      </div>
    ))}
  </div>
);

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
    priority: "Medium",
    status: "To Do",
  });

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.title && newTask.description && newTask.assignee) {
      setTasks((prev) => [...prev, { ...newTask, id: Date.now() }]);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        assignee: "",
        priority: "Medium",
        status: "To Do",
      });
    }
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e, status) => {
    const id = e.dataTransfer.getData("text");
    setTasks((prev) =>
      prev.map((task) =>
        task.id === parseInt(id) ? { ...task, status } : task
      )
    );
  };

  const handleStatusChange = (id, status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const handlePriorityChange = (id, priority) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, priority } : task))
    );
  };

  const handleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: "Done" } : task))
    );
  };

  const taskSummary = statuses.reduce(
    (acc, status) => ({
      ...acc,
      [status]: tasks.filter((task) => task.status === status).length,
    }),
    {}
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Team Collaboration Board</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <Card className="bg-gray-900">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  id="assignee"
                  name="assignee"
                  value={newTask.assignee}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "assignee", value } })
                  }
                  required
                >
                  {teamMembers.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  id="priority"
                  name="priority"
                  value={newTask.priority}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "priority", value } })
                  }
                >
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <Button type="submit">Add Task</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 col-span-2">
          <CardHeader>
            <CardTitle>Kanban Board</CardTitle>
          </CardHeader>
          <CardContent>
            <KanbanBoard
              tasks={tasks}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              onComplete={handleComplete}
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-900">
          <CardHeader>
            <CardTitle>Task Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(taskSummary).map(([status, count]) => (
                <li key={status}>
                  {status}: {count}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => setTasks([...tasks])}
              className="mt-4"
              variant="outline"
            >
              Refresh Board
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
