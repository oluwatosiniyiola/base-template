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
  Checkbox,
  Label,
  Calendar,
  Tooltip,
} from "@/components/ui/card";
import { format, addDays, isToday, isFuture } from "date-fns";

// Utility function to generate unique IDs
const uid = () => Math.random().toString(36).substr(2, 9);

// Session Form Component
function SessionForm({ onSubmit, onCancel, session = {} }) {
  const [form, setForm] = useState({
    id: session.id || uid(),
    subject: session.subject || "",
    topic: session.topic || "",
    duration: session.duration || "",
    time: session.time || "",
    completed: session.completed || false,
    notes: session.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, time: new Date(form.time) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        placeholder="Subject"
        required
      />
      <Input
        value={form.topic}
        onChange={(e) => setForm({ ...form, topic: e.target.value })}
        placeholder="Topic"
        required
      />
      <Input
        type="number"
        value={form.duration}
        onChange={(e) => setForm({ ...form, duration: e.target.value })}
        placeholder="Duration (hours)"
        required
      />
      <Input
        type="datetime-local"
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
        required
      />
      <Button type="submit">Save</Button>
      <Button onClick={onCancel} type="button" variant="secondary">
        Cancel
      </Button>
    </form>
  );
}

// Main App Component
export default function App() {
  const [sessions, setSessions] = useState([]);
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState({
    subject: "",
    duration: { min: "", max: "" },
    date: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editSession, setEditSession] = useState(null);

  const addSession = (newSession) => {
    setSessions((prev) => [...prev, newSession]);
    setShowForm(false);
    setEditSession(null);
  };

  const updateSession = (updatedSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
    setShowForm(false);
    setEditSession(null);
  };

  const toggleCompleted = (id) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, completed: !s.completed, notes: s.completed ? "" : s.notes }
          : s
      )
    );
  };

  const filteredSessions = sessions.filter((session) => {
    const subjectMatch =
      filter.subject === "" || session.subject.includes(filter.subject);
    const durationMatch =
      (filter.duration.min === "" ||
        session.duration >= Number(filter.duration.min)) &&
      (filter.duration.max === "" ||
        session.duration <= Number(filter.duration.max));
    const dateMatch =
      filter.date === "" ||
      format(new Date(session.time), "yyyy-MM-dd") === filter.date;
    return subjectMatch && durationMatch && dateMatch;
  });

  const dashboardStats = {
    totalHours: sessions.reduce((acc, curr) => acc + Number(curr.duration), 0),
    completedSessions: sessions.filter((s) => s.completed).length,
    activeSubjects: [...new Set(sessions.map((s) => s.subject))].length,
  };

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Study Planner</CardTitle>
          <CardDescription>
            Manage your study sessions efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditSession(null);
            }}
          >
            Add Session
          </Button>
          <Select onValueChange={setView}>
            <SelectItem value="list">List View</SelectItem>
            <SelectItem value="calendar">Calendar View</SelectItem>
          </Select>
          {view === "list" ? (
            <div>
              <Input
                placeholder="Filter by subject"
                value={filter.subject}
                onChange={(e) =>
                  setFilter({ ...filter, subject: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Min duration"
                value={filter.duration.min}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    duration: { ...filter.duration, min: e.target.value },
                  })
                }
              />
              <Input
                type="number"
                placeholder="Max duration"
                value={filter.duration.max}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    duration: { ...filter.duration, max: e.target.value },
                  })
                }
              />
              <Input
                type="date"
                value={filter.date}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              />
              {filteredSessions.map((session) => (
                <Card key={session.id} className="mt-2">
                  <CardContent>
                    <div>
                      {session.subject} - {session.topic}
                    </div>
                    <div>Duration: {session.duration} hours</div>
                    <div>Scheduled: {format(new Date(session.time), "Pp")}</div>
                    <Checkbox
                      checked={session.completed}
                      onCheckedChange={() => toggleCompleted(session.id)}
                    />
                    <Label>Completed</Label>
                    {session.completed && (
                      <Input
                        placeholder="Notes"
                        value={session.notes}
                        onChange={(e) =>
                          updateSession({ ...session, notes: e.target.value })
                        }
                      />
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => {
                        setEditSession(session);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Calendar
              date={new Date()}
              onDateChange={(newDate) => console.log("Selected date:", newDate)}
              mode="month"
              renderDay={(date) => {
                const sessionsToday = sessions.filter((s) => isToday(s.time));
                return (
                  <div>
                    <div>{format(date, "d")}</div>
                    {sessionsToday.length > 0 && (
                      <Tooltip
                        content={sessionsToday
                          .map((s) => `${s.subject}: ${s.topic}`)
                          .join(", ")}
                      >
                        <div className="bg-blue-500 rounded-full w-2 h-2 mx-auto"></div>
                      </Tooltip>
                    )}
                  </div>
                );
              }}
            />
          )}
        </CardContent>
        <CardFooter>
          <div>Total Study Hours: {dashboardStats.totalHours}</div>
          <div>Completed Sessions: {dashboardStats.completedSessions}</div>
          <div>Active Subjects: {dashboardStats.activeSubjects}</div>
        </CardFooter>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editSession ? "Edit Session" : "New Session"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SessionForm
              onSubmit={editSession ? updateSession : addSession}
              onCancel={() => {
                setShowForm(false);
                setEditSession(null);
              }}
              session={editSession || {}}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
