import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState({ steps: 0, calories: 0, workouts: 0 });
  const [journal, setJournal] = useState("");
  const [workoutRoutines, setWorkoutRoutines] = useState([]);
  const [profile, setProfile] = useState({ weight: "", height: "", goal: "" });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const addActivity = (type, value) => {
    setActivities((prev) => [...prev, { type, value, date: new Date() }]);
  };

  const updateGoals = (key, value) => {
    setGoals((prev) => ({ ...prev, [key]: value }));
  };

  const addRoutine = (routine) => {
    setWorkoutRoutines((prev) => [...prev, { ...routine, id: Date.now() }]);
  };

  const progressData = (activities, period = "weekly") => {
    const now = new Date();
    const filterDate = new Date(now);
    filterDate.setDate(now.getDate() - (period === "weekly" ? 7 : 30));

    return activities
      .filter((a) => new Date(a.date) > filterDate)
      .reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + curr.value;
        return acc;
      }, {});
  };

  const WeeklyProgress = () => {
    const data = progressData(activities, "weekly");
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-2 flex justify-between">
              <span>{key}</span>
              <span>{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "dark" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fitness Tracker</h1>
        <Button variant="outline" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="routines">Routines</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <WeeklyProgress />
          {/* Placeholder for monthly progress */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Monthly stats will be shown here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Add Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Input
                type="number"
                placeholder="Steps"
                onChange={(e) => addActivity("Steps", parseInt(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Calories Burned"
                onChange={(e) =>
                  addActivity("Calories", parseInt(e.target.value))
                }
              />
              <Input
                type="text"
                placeholder="Workout Description"
                onChange={(e) => addActivity("Workout", e.target.value)}
              />
            </CardContent>
          </Card>
          <div className="mt-4">
            {activities.map((act, idx) => (
              <div key={idx} className="mb-2">
                {act.type}: {act.value} on {act.date.toDateString()}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals">
          {["steps", "calories", "workouts"].map((goal) => (
            <div key={goal} className="mb-4">
              <Label>{goal.charAt(0).toUpperCase() + goal.slice(1)}</Label>
              <Input
                type="number"
                value={goals[goal]}
                onChange={(e) => updateGoals(goal, parseInt(e.target.value))}
              />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="journal">
          <textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="w-full h-40 p-2 border rounded"
            placeholder="Write your fitness journal here..."
          />
        </TabsContent>

        <TabsContent value="routines">
          <Card>
            <CardHeader>
              <CardTitle>Create Routine</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Routine Name" />
              <Button
                onClick={() =>
                  addRoutine({ name: "New Routine", exercises: [] })
                }
              >
                Add Routine
              </Button>
            </CardContent>
          </Card>
          {workoutRoutines.map((routine) => (
            <Card key={routine.id} className="mt-4">
              <CardHeader>
                <CardTitle>{routine.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="profile">
          <Input
            type="number"
            placeholder="Weight (kg)"
            value={profile.weight}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
          <Input
            type="number"
            placeholder="Height (cm)"
            value={profile.height}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, height: e.target.value }))
            }
          />
          <Input
            placeholder="Fitness Goal"
            value={profile.goal}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, goal: e.target.value }))
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default App;
