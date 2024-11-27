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
  Label,
  Select,
  SelectItem,
  Toggle,
  Tooltip,
} from "@/components/ui/card";

// Utility function to get the week's start and end
const getWeekDates = () => {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - now.getDay()));
  const end = new Date(now.setDate(start.getDate() + 6));
  return { start, end };
};

// Mock data for exercise types
const exerciseTypes = ["Cardio", "Strength", "Flexibility"];

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { start, end } = getWeekDates();
  const [form, setForm] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    type: "",
    favorite: false,
  });

  // Calculate summary
  const summary = workouts.reduce(
    (acc, workout) => ({
      sets: acc.sets + workout.sets,
      reps: acc.reps + workout.reps,
      calories: acc.calories + workout.sets * workout.reps * 0.5, // Simple calorie calc
    }),
    { sets: 0, reps: 0, calories: 0 }
  );

  // Validation function
  const validateForm = () => {
    let errors = {};
    if (
      !form.name ||
      workouts.some(
        (w) =>
          w.name === form.name &&
          w.date === currentDate.toISOString().split("T")[0]
      )
    ) {
      errors.name = "Exercise name must be unique for the day.";
    }
    if (!form.sets || form.sets <= 0 || !Number.isInteger(Number(form.sets)))
      errors.sets = "Must be a positive integer.";
    if (!form.reps || form.reps <= 0 || !Number.isInteger(Number(form.reps)))
      errors.reps = "Must be a positive integer.";
    if (form.weight && (form.weight < 0.5 || form.weight > 500))
      errors.weight = "Weight must be between 0.5 and 500.";
    if (form.favorite && form.reps < 5)
      errors.favorite = "Favorite workouts must have at least 5 reps.";
    return errors;
  };

  const addWorkout = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      setWorkouts([
        ...workouts,
        { ...form, date: currentDate.toISOString().split("T")[0] },
      ]);
      setForm({
        name: "",
        sets: "",
        reps: "",
        weight: "",
        type: "",
        favorite: false,
      });
    } else {
      alert(Object.values(errors).join("\n"));
    }
  };

  const toggleFavorite = (index) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[index].favorite = !updatedWorkouts[index].favorite;
    setWorkouts(updatedWorkouts);
  };

  // Simple chart without any library
  const Chart = ({ data }) => (
    <div className="w-full h-40 bg-slate-800 rounded-lg flex items-end p-2">
      {data.map((value, idx) => (
        <div
          key={idx}
          className="bg-blue-500 mx-1"
          style={{ width: "calc(100% / 7)", height: `${value * 10}%` }}
        />
      ))}
    </div>
  );

  // Weekly Calendar
  const WeeklyCalendar = () => {
    const days = Array.from(
      { length: 7 },
      (_, i) => new Date(start.getTime() + i * 86400000)
    );
    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <Card
            key={day.toISOString()}
            onClick={() => setCurrentDate(day)}
            className="cursor-pointer"
          >
            <CardHeader>
              <CardTitle>{day.toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              {workouts
                .filter((w) => w.date === day.toISOString().split("T")[0])
                .map((w) => (
                  <div
                    key={w.name}
                    className={`p-1 rounded ${
                      w.type === "Cardio" ? "bg-red-200" : "bg-blue-200"
                    }`}
                  >
                    {w.name}
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } p-4 sm:p-8`}
    >
      <Button onClick={() => setDarkMode(!darkMode)}>Toggle Theme</Button>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Workout Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sets: {summary.sets}</p>
          <p>Reps: {summary.reps}</p>
          <p>Calories Burned: {summary.calories.toFixed(2)}</p>
          <div className="relative w-full h-4 bg-gray-300 mt-4">
            <div
              className="absolute h-full bg-green-500"
              style={{ width: `${(summary.reps / 1000) * 100}%` }}
            >
              <Tooltip
                content="Your weekly goal is 1000 reps."
                className="invisible group-hover:visible"
              >
                <span className="sr-only">Goal Progress</span>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Weekly Intensity</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart data={Array.from({ length: 7 }, () => Math.random() * 10)} />
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Add Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addWorkout();
            }}
          >
            <div className="grid gap-2 mb-2">
              <Label htmlFor="name">Exercise Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {exerciseTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
              <Label htmlFor="sets">Sets</Label>
              <Input
                type="number"
                id="sets"
                value={form.sets}
                onChange={(e) => setForm({ ...form, sets: e.target.value })}
                required
              />
              <Label htmlFor="reps">Reps</Label>
              <Input
                type="number"
                id="reps"
                value={form.reps}
                onChange={(e) => setForm({ ...form, reps: e.target.value })}
                required
              />
              <Label
                htmlFor="weight"
                className={form.type === "Cardio" ? "hidden" : ""}
              >
                Weight (kg)
              </Label>
              <Input
                type="number"
                id="weight"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className={form.type === "Cardio" ? "hidden" : ""}
              />
              <Toggle
                id="favorite"
                checked={form.favorite}
                onCheckedChange={(checked) =>
                  setForm({ ...form, favorite: checked })
                }
              >
                Favorite
              </Toggle>
            </div>
            <Button type="submit">Add Workout</Button>
          </form>
        </CardContent>
      </Card>
      <WeeklyCalendar />
    </div>
  );
}

export default App;
