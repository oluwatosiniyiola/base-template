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
  Textarea,
  Select,
  SelectItem,
  Label,
} from "@/components/ui/card";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
  });

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      alert("Title and due date are required.");
      return;
    }
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({ title: "", description: "", dueDate: "", priority: "low" });
  };

  const markAsCompleted = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: true } : t)));
  };

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const generateCalendar = () => {
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const totalDays = daysInMonth(
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
    let calendar = [];
    let dayCounter = 1;

    for (let row = 0; row < 6; row++) {
      let week = [];
      for (let day = 0; day < 7; day++) {
        if ((row === 0 && day < firstDay) || dayCounter > totalDays) {
          week.push(<td key={day}></td>);
        } else {
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            dayCounter
          );
          const hasTask = tasks.some(
            (task) =>
              new Date(task.dueDate).toDateString() === date.toDateString()
          );
          week.push(
            <td
              key={day}
              className={`p-2 cursor-pointer ${
                hasTask ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => setSelectedDate(date)}
            >
              {dayCounter++}
            </td>
          );
        }
      }
      calendar.push(<tr key={row}>{week}</tr>);
      if (dayCounter > totalDays) break;
    }

    return calendar;
  };

  const overdueTasks = tasks.filter(
    (task) => new Date(task.dueDate) < new Date() && !task.completed
  );

  return (
    <div className="dark bg-slate-900 min-h-screen p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Task Scheduler
      </h1>

      {/* Add Task Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add Task</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task Title"
            className="mb-2"
          />
          <Textarea
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Description"
            className="mb-2"
          />
          <Input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            className="mb-2"
          />
          <Select
            value={newTask.priority}
            onValueChange={(value) =>
              setNewTask({ ...newTask, priority: value })
            }
          >
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={addTask}>Add Task</Button>
        </CardFooter>
      </Card>

      {/* Calendar Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-center">
            <thead>
              <tr>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>{generateCalendar()}</tbody>
          </table>
          {selectedDate && (
            <div className="mt-4 p-2 bg-white text-black rounded">
              <h3 className="font-bold">{selectedDate.toDateString()}</h3>
              {tasks
                .filter(
                  (task) =>
                    new Date(task.dueDate).toDateString() ===
                    selectedDate.toDateString()
                )
                .map((task) => (
                  <div key={task.id} className="border-t pt-2 mt-2">
                    <p>
                      {task.title} - {task.priority}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overdue Tasks Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overdue Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {overdueTasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center mb-2"
            >
              <span>{task.title}</span>
              <Button onClick={() => markAsCompleted(task.id)}>
                Mark as Completed
              </Button>
            </div>
          ))}
          {overdueTasks.length === 0 && <p>No overdue tasks.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
