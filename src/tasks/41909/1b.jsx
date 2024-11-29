import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const subjects = ["Math", "Science", "History", "English", "Other"];

function StudySessionForm({ addSession }) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addSession({
      subject,
      topic,
      duration,
      scheduledTime,
      completed: false,
      notes: "",
    });
    setSubject("");
    setTopic("");
    setDuration("");
    setScheduledTime("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select value={subject} onValueChange={setSubject}>
        <Select.Trigger className="w-full">
          <Select.Value placeholder="Select subject" />
        </Select.Trigger>
        <Select.Content>
          {subjects.map((s) => (
            <Select.Item key={s} value={s}>
              {s}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      <Input
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <Input
        type="datetime-local"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
      />
      <Button type="submit">Add Session</Button>
    </form>
  );
}

function SessionList({ sessions, toggleCompleted, addNotes, filter }) {
  const filteredSessions = sessions.filter((session) => {
    if (filter.subject && session.subject !== filter.subject) return false;
    if (filter.minDuration && session.duration < filter.minDuration)
      return false;
    if (filter.maxDuration && session.duration > filter.maxDuration)
      return false;
    if (filter.date && !session.scheduledTime.startsWith(filter.date))
      return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {filteredSessions.map((session, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>
              {session.subject}: {session.topic}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Duration: {session.duration} minutes</p>
            <p>Scheduled: {new Date(session.scheduledTime).toLocaleString()}</p>
            <Checkbox
              checked={session.completed}
              onCheckedChange={() => toggleCompleted(index)}
              label="Completed"
            />
            {session.completed && (
              <Input
                placeholder="Add notes"
                value={session.notes}
                onChange={(e) => addNotes(index, e.target.value)}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Dashboard({ sessions }) {
  const totalHours =
    sessions.reduce((sum, session) => sum + Number(session.duration), 0) / 60;
  const completedSessions = sessions.filter(
    (session) => session.completed
  ).length;
  const activeSubjects = [
    ...new Set(sessions.map((session) => session.subject)),
  ].length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Study Hours: {totalHours.toFixed(2)}</p>
        <p>Completed Sessions: {completedSessions}</p>
        <p>Active Subjects: {activeSubjects}</p>
      </CardContent>
    </Card>
  );
}

function FilterForm({ setFilter }) {
  const [subject, setSubject] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilter({ subject, minDuration, maxDuration, date });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select value={subject} onValueChange={setSubject}>
        <Select.Trigger className="w-full">
          <Select.Value placeholder="Filter by subject" />
        </Select.Trigger>
        <Select.Content>
          {subjects.map((s) => (
            <Select.Item key={s} value={s}>
              {s}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      <Input
        type="number"
        placeholder="Min duration"
        value={minDuration}
        onChange={(e) => setMinDuration(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Max duration"
        value={maxDuration}
        onChange={(e) => setMaxDuration(e.target.value)}
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button type="submit">Apply Filter</Button>
    </form>
  );
}

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState({});

  const addSession = (session) => {
    setSessions([...sessions, session]);
  };

  const toggleCompleted = (index) => {
    const newSessions = [...sessions];
    newSessions[index].completed = !newSessions[index].completed;
    setSessions(newSessions);
  };

  const addNotes = (index, notes) => {
    const newSessions = [...sessions];
    newSessions[index].notes = notes;
    setSessions(newSessions);
  };

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkReminders = setInterval(() => {
      sessions.forEach((session) => {
        const sessionTime = new Date(session.scheduledTime);
        const now = new Date();
        if (sessionTime > now && sessionTime - now <= 5 * 60 * 1000) {
          new Notification("Study Reminder", {
            body: `Your ${session.subject} session starts in 5 minutes!`,
          });
        }
      });
    }, 60000);

    return () => clearInterval(checkReminders);
  }, [sessions]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Study Planner Widget</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Study Session</CardTitle>
          </CardHeader>
          <CardContent>
            <StudySessionForm addSession={addSession} />
          </CardContent>
        </Card>
        <Dashboard sessions={sessions} />
      </div>
      <Tabs defaultValue="list" className="mt-6">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Study Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <FilterForm setFilter={setFilter} />
              <SessionList
                sessions={sessions}
                toggleCompleted={toggleCompleted}
                addNotes={addNotes}
                filter={filter}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Calendar view not implemented in this example.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
