import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [viewMode, setViewMode] = useState("agenda");
  const [newSession, setNewSession] = useState({
    subject: "",
    topic: "",
    duration: "",
    time: "",
    reminder: false,
  });
  const [filter, setFilter] = useState({
    subject: "",
    minDuration: "",
    maxDuration: "",
    date: "",
  });
  const [completedSessions, setCompletedSessions] = useState([]);

  // Add a new study session
  const handleAddSession = () => {
    if (
      !newSession.subject ||
      !newSession.topic ||
      !newSession.duration ||
      !newSession.time
    ) {
      alert("All fields are required!");
      return;
    }
    setSessions([...sessions, { ...newSession, completed: false, notes: "" }]);
    setNewSession({
      subject: "",
      topic: "",
      duration: "",
      time: "",
      reminder: false,
    });
  };

  // Mark a session as completed
  const markAsCompleted = (index, notes) => {
    const updatedSessions = [...sessions];
    const completed = updatedSessions.splice(index, 1)[0];
    completed.completed = true;
    completed.notes = notes;
    setSessions(updatedSessions);
    setCompletedSessions([...completedSessions, completed]);
  };

  // Toggle reminder
  const toggleReminder = (index) => {
    const updatedSessions = [...sessions];
    updatedSessions[index].reminder = !updatedSessions[index].reminder;
    setSessions(updatedSessions);
  };

  // Mock notification reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      sessions.forEach((session) => {
        const sessionTime = new Date(session.time);
        const timeDiff = sessionTime - now;

        if (session.reminder && timeDiff > 0 && timeDiff <= 300000) {
          alert(
            `Reminder: Your session on "${session.subject}" starts in 5 minutes!`
          );
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [sessions]);

  // Filters
  const filteredSessions = sessions.filter((session) => {
    const matchesSubject =
      !filter.subject ||
      session.subject.toLowerCase().includes(filter.subject.toLowerCase());
    const matchesMinDuration =
      !filter.minDuration ||
      Number(session.duration) >= Number(filter.minDuration);
    const matchesMaxDuration =
      !filter.maxDuration ||
      Number(session.duration) <= Number(filter.maxDuration);
    const matchesDate =
      !filter.date || session.time.split("T")[0] === filter.date;
    return (
      matchesSubject && matchesMinDuration && matchesMaxDuration && matchesDate
    );
  });

  // Dashboard stats
  const totalStudyHours = completedSessions.reduce(
    (acc, session) => acc + Number(session.duration),
    0
  );
  const activeSubjects = [
    ...new Set(sessions.map((session) => session.subject)),
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Study Planner</h1>

      {/* Add Session */}
      <Card className="mb-4 p-4">
        <CardHeader>
          <CardTitle>Add New Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="Subject"
            value={newSession.subject}
            onChange={(e) =>
              setNewSession({ ...newSession, subject: e.target.value })
            }
          />
          <Input
            placeholder="Topic"
            value={newSession.topic}
            onChange={(e) =>
              setNewSession({ ...newSession, topic: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Duration (minutes)"
            value={newSession.duration}
            onChange={(e) =>
              setNewSession({ ...newSession, duration: e.target.value })
            }
          />
          <Input
            type="datetime-local"
            value={newSession.time}
            onChange={(e) =>
              setNewSession({ ...newSession, time: e.target.value })
            }
          />
          <Button onClick={handleAddSession}>Add Session</Button>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-4 p-4">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="Filter by Subject"
            value={filter.subject}
            onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Min Duration"
            value={filter.minDuration}
            onChange={(e) =>
              setFilter({ ...filter, minDuration: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Max Duration"
            value={filter.maxDuration}
            onChange={(e) =>
              setFilter({ ...filter, maxDuration: e.target.value })
            }
          />
          <Input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* View Sessions */}
      <div className="mb-4">
        <Button
          onClick={() =>
            setViewMode(viewMode === "agenda" ? "calendar" : "agenda")
          }
        >
          {viewMode === "agenda"
            ? "Switch to Calendar View"
            : "Switch to Agenda View"}
        </Button>
      </div>

      <div className="space-y-4">
        {filteredSessions.map((session, index) => (
          <Card key={index} className="p-4">
            <CardHeader>
              <CardTitle>{session.subject}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Topic: {session.topic}</p>
              <p>Duration: {session.duration} mins</p>
              <p>Scheduled: {new Date(session.time).toLocaleString()}</p>
              <Button
                className="mt-2"
                onClick={() =>
                  markAsCompleted(index, prompt("Add notes for this session:"))
                }
              >
                Mark as Completed
              </Button>
              <Button
                className="mt-2 ml-2"
                onClick={() => toggleReminder(index)}
              >
                {session.reminder ? "Disable Reminder" : "Enable Reminder"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard */}
      <Card className="mt-4 p-4">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Study Hours: {totalStudyHours}</p>
          <p>Completed Sessions: {completedSessions.length}</p>
          <p>Active Subjects: {activeSubjects.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}
