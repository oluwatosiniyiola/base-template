import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const DashboardCard = ({ title, value, unit }) => (
  <Card className="w-full sm:w-1/2 md:w-1/4 p-4">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">
        {value} <span className="text-sm font-normal">{unit}</span>
      </p>
    </CardContent>
  </Card>
);

const ActivityLog = ({ onAddActivity }) => {
  const [activity, setActivity] = useState({ type: "", value: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddActivity(activity);
    setActivity({ type: "", value: "" });
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Log Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input
            placeholder="Activity type"
            value={activity.type}
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Value"
            value={activity.value}
            onChange={(e) =>
              setActivity({ ...activity, value: e.target.value })
            }
          />
          <Button type="submit">Add Activity</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const Journal = ({ entries, onAddEntry }) => {
  const [entry, setEntry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEntry(entry);
    setEntry("");
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Fitness Journal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Textarea
            placeholder="Write your entry..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />
          <Button type="submit">Add Entry</Button>
        </form>
        <div className="mt-4 space-y-2">
          {entries.map((e, i) => (
            <p key={i} className="text-sm">
              {e}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const WorkoutRoutine = ({ routines, onAddRoutine }) => {
  const [routine, setRoutine] = useState({ name: "", exercises: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRoutine(routine);
    setRoutine({ name: "", exercises: "" });
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Workout Routines</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input
            placeholder="Routine name"
            value={routine.name}
            onChange={(e) => setRoutine({ ...routine, name: e.target.value })}
          />
          <Textarea
            placeholder="Exercises (comma-separated)"
            value={routine.exercises}
            onChange={(e) =>
              setRoutine({ ...routine, exercises: e.target.value })
            }
          />
          <Button type="submit">Add Routine</Button>
        </form>
        <div className="mt-4 space-y-2">
          {routines.map((r, i) => (
            <div key={i} className="text-sm">
              <p className="font-bold">{r.name}</p>
              <p>{r.exercises}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Profile = ({ profile, onUpdateProfile }) => {
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(editedProfile);
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input
            placeholder="Weight (kg)"
            type="number"
            value={editedProfile.weight}
            onChange={(e) =>
              setEditedProfile({ ...editedProfile, weight: e.target.value })
            }
          />
          <Input
            placeholder="Height (cm)"
            type="number"
            value={editedProfile.height}
            onChange={(e) =>
              setEditedProfile({ ...editedProfile, height: e.target.value })
            }
          />
          <Input
            placeholder="Goal"
            value={editedProfile.goal}
            onChange={(e) =>
              setEditedProfile({ ...editedProfile, goal: e.target.value })
            }
          />
          <Button type="submit">Update Profile</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const SimpleChart = ({ data }) => {
  const maxValue = Math.max(...data);
  return (
    <div className="flex h-40 items-end space-x-2">
      {data.map((value, index) => (
        <div
          key={index}
          className="bg-blue-500 w-8"
          style={{ height: `${(value / maxValue) * 100}%` }}
        ></div>
      ))}
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activities, setActivities] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [profile, setProfile] = useState({ weight: "", height: "", goal: "" });

  const addActivity = (activity) => {
    setActivities([...activities, activity]);
  };

  const addJournalEntry = (entry) => {
    setJournalEntries([entry, ...journalEntries]);
  };

  const addRoutine = (routine) => {
    setRoutines([...routines, routine]);
  };

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-white"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Fitness Tracker</h1>
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <DashboardCard title="Steps" value="10,000" unit="steps" />
          <DashboardCard title="Calories Burned" value="500" unit="kcal" />
          <DashboardCard title="Workouts" value="3" unit="this week" />
          <DashboardCard title="Goal Progress" value="75" unit="%" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Weekly Progress</h2>
          <SimpleChart data={[10, 15, 7, 20, 14, 18, 9]} />
        </div>

        <ActivityLog onAddActivity={addActivity} />
        <Journal entries={journalEntries} onAddEntry={addJournalEntry} />
        <WorkoutRoutine routines={routines} onAddRoutine={addRoutine} />
        <Profile profile={profile} onUpdateProfile={updateProfile} />
      </div>
    </div>
  );
}
