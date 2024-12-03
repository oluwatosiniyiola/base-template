import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [steps, setSteps] = useState("");
  const [calories, setCalories] = useState("");
  const [workout, setWorkout] = useState("");
  const [goals, setGoals] = useState({ dailySteps: 10000, dailyCalories: 500 });
  const [journal, setJournal] = useState("");
  const [customWorkout, setCustomWorkout] = useState("");
  const [profile, setProfile] = useState({
    weight: "",
    height: "",
    fitnessGoal: "",
  });
  const [weekProgress, setWeekProgress] = useState([]);
  const [monthProgress, setMonthProgress] = useState([]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    setGoals({ ...goals, [name]: value });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleActivitySubmit = () => {
    const today = new Date();
    const newProgress = {
      date: today.toLocaleDateString(),
      steps,
      calories,
      workout,
    };
    setWeekProgress([newProgress, ...weekProgress].slice(0, 7));
    setMonthProgress([newProgress, ...monthProgress].slice(0, 30));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="flex justify-between p-4">
        <h1 className="text-3xl font-bold">Fitness Tracker</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Toggle Theme
        </button>
      </header>

      <main className="p-4 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Daily Activity</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="number"
                  placeholder="Enter Steps"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="number"
                  placeholder="Enter Calories"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Workout</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  placeholder="Enter Workout"
                  value={workout}
                  onChange={(e) => setWorkout(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </CardContent>
            </Card>
          </div>
          <button
            onClick={handleActivitySubmit}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Activity
          </button>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Progress</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {weekProgress.map((entry, idx) => (
                    <li key={idx}>
                      {entry.date}: {entry.steps} steps, {entry.calories} cal,{" "}
                      {entry.workout}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {monthProgress.map((entry, idx) => (
                    <li key={idx}>
                      {entry.date}: {entry.steps} steps, {entry.calories} cal,{" "}
                      {entry.workout}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Set Your Goals</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="number"
                  name="dailySteps"
                  value={goals.dailySteps}
                  onChange={handleGoalChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daily Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="number"
                  name="dailyCalories"
                  value={goals.dailyCalories}
                  onChange={handleGoalChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Journal</h2>
          <textarea
            placeholder="Write about your fitness progress..."
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="p-4 border border-gray-300 rounded w-full h-32"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold">Create Workout Routine</h2>
          <textarea
            placeholder="Enter Custom Workout"
            value={customWorkout}
            onChange={(e) => setCustomWorkout(e.target.value)}
            className="p-4 border border-gray-300 rounded w-full h-32"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="number"
                  name="weight"
                  value={profile.weight}
                  onChange={handleProfileChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Height</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="number"
                  name="height"
                  value={profile.height}
                  onChange={handleProfileChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fitness Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  name="fitnessGoal"
                  value={profile.fitnessGoal}
                  onChange={handleProfileChange}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
