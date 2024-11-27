import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const initialWorkouts = [
  {
    id: 1,
    name: "Push-ups",
    type: "Strength",
    sets: 3,
    reps: 10,
    weight: 0,
    favorite: false,
    date: new Date(),
  },
  {
    id: 2,
    name: "Running",
    type: "Cardio",
    sets: 1,
    reps: 1,
    weight: 0,
    favorite: true,
    date: new Date(Date.now() - 86400000),
  },
];

const exerciseTypes = ["Cardio", "Strength"];

const Dashboard = ({ workouts }) => {
  const totalSets = workouts.reduce((sum, workout) => sum + workout.sets, 0);
  const totalReps = workouts.reduce((sum, workout) => sum + workout.reps, 0);
  const caloriesBurned = totalReps * 0.1; // Simple calculation for demonstration

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Sets: {totalSets}</p>
        <p>Total Reps: {totalReps}</p>
        <p>Calories Burned: {caloriesBurned.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

const Chart = ({ workouts }) => {
  const lastWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const data = lastWeek.map((date) => {
    const dayWorkouts = workouts.filter(
      (w) => w.date.toISOString().split("T")[0] === date
    );
    return dayWorkouts.reduce((sum, w) => sum + w.sets * w.reps, 0);
  });

  const max = Math.max(...data, 1);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Workout Intensity Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-40 flex items-end justify-between">
        {data.map((value, index) => (
          <div
            key={index}
            className="h-full flex flex-col justify-end items-center"
          >
            <div
              className="w-8 bg-blue-500"
              style={{ height: `${(value / max) * 100}%` }}
            ></div>
            <span className="text-xs mt-1">{lastWeek[index].slice(-2)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const WorkoutForm = ({ addWorkout }) => {
  const [workout, setWorkout] = useState({
    name: "",
    type: "Strength",
    sets: 1,
    reps: 1,
    weight: 0,
    favorite: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setWorkout((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!workout.name) errors.name = "Exercise name is required";
    if (workout.sets <= 0) errors.sets = "Sets must be greater than zero";
    if (workout.reps <= 0) errors.reps = "Reps must be greater than zero";
    if (workout.weight < 0.5 || workout.weight > 500)
      errors.weight = "Weight must be between 0.5 and 500";
    if (workout.favorite && workout.reps < 5)
      errors.favorite = "Favorite workouts must have at least 5 reps";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      addWorkout({ ...workout, date: new Date() });
      setWorkout({
        name: "",
        type: "Strength",
        sets: 1,
        reps: 1,
        weight: 0,
        favorite: false,
      });
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exercise Name */}
          <div>
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              name="name"
              value={workout.name}
              onChange={handleChange}
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Exercise Type Dropdown */}
          <div>
            <Label htmlFor="type">Exercise Type</Label>
            <select
              id="type"
              name="type"
              value={workout.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
            >
              {exerciseTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type}</p>
            )}
          </div>

          {/* Sets */}
          <div>
            <Label htmlFor="sets">Sets</Label>
            <Input
              type="number"
              id="sets"
              name="sets"
              value={workout.sets}
              onChange={handleChange}
              className="w-full"
            />
            {errors.sets && (
              <p className="text-red-500 text-sm">{errors.sets}</p>
            )}
          </div>

          {/* Reps */}
          <div>
            <Label htmlFor="reps">Reps</Label>
            <Input
              type="number"
              id="reps"
              name="reps"
              value={workout.reps}
              onChange={handleChange}
              className="w-full"
            />
            {errors.reps && (
              <p className="text-red-500 text-sm">{errors.reps}</p>
            )}
          </div>

          {/* Weight (only for Strength exercises) */}
          {workout.type === "Strength" && (
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                type="number"
                id="weight"
                name="weight"
                value={workout.weight}
                onChange={handleChange}
                step="0.5"
                className="w-full"
              />
              {errors.weight && (
                <p className="text-red-500 text-sm">{errors.weight}</p>
              )}
            </div>
          )}

          {/* Favorite Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="favorite"
              name="favorite"
              checked={workout.favorite}
              onCheckedChange={(checked) =>
                setWorkout((prev) => ({ ...prev, favorite: checked }))
              }
            />
            <Label htmlFor="favorite">Favorite</Label>
          </div>
          {errors.favorite && (
            <p className="text-red-500 text-sm">{errors.favorite}</p>
          )}

          <Button type="submit" className="w-full">
            Add Workout
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ProgressBar = ({ workouts }) => {
  const totalReps = workouts.reduce((sum, workout) => sum + workout.reps, 0);
  const weeklyGoal = 100; // Example goal
  const progress = Math.min((totalReps / weeklyGoal) * 100, 100);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full" />
        <div className="mt-2 relative">
          <span className="text-sm">{progress.toFixed(0)}% of weekly goal</span>
          <div className="absolute top-0 right-0 bg-gray-800 p-2 rounded shadow hidden group-hover:block">
            Goal: {weeklyGoal} reps per week
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Calendar = ({ workouts, editWorkout }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const getWeekDates = () => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  const getWorkoutsForDate = (date) => {
    return workouts.filter(
      (w) => w.date.toDateString() === date.toDateString()
    );
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Weekly Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`p-2 border rounded cursor-pointer ${
                selectedDate &&
                selectedDate.toDateString() === date.toDateString()
                  ? "bg-blue-500"
                  : ""
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="text-sm font-bold">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className="text-xs">{date.getDate()}</div>
              {getWorkoutsForDate(date).map((workout, i) => (
                <div
                  key={i}
                  className={`mt-1 h-2 w-full rounded ${
                    workout.type === "Cardio" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
              ))}
            </div>
          ))}
        </div>
        {selectedDate && (
          <div className="mt-4">
            <h3 className="font-bold">
              Workouts for {selectedDate.toDateString()}
            </h3>
            {getWorkoutsForDate(selectedDate).map((workout, index) => (
              <div key={index} className="mt-2">
                <p>
                  {workout.name} - {workout.sets} sets, {workout.reps} reps
                </p>
                <Button
                  onClick={() => editWorkout(workout.id)}
                  className="mt-1"
                >
                  Edit
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = darkMode
      ? "dark bg-gray-900 text-white"
      : "bg-white text-black";
  }, [darkMode]);

  const addWorkout = (workout) => {
    setWorkouts((prev) => [...prev, { ...workout, id: Date.now() }]);
  };

  const editWorkout = (id) => {
    // Implement edit functionality here
    console.log("Edit workout with id:", id);
  };

  return (
    <div className={`container mx-auto p-4 ${darkMode ? "dark" : ""}`}>
      <Button onClick={() => setDarkMode(!darkMode)} className="mb-4">
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </Button>
      <Dashboard workouts={workouts} />
      <Chart workouts={workouts} />
      <WorkoutForm addWorkout={addWorkout} />
      <ProgressBar workouts={workouts} />
      <Calendar workouts={workouts} editWorkout={editWorkout} />
    </div>
  );
}
