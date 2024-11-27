import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function MainPage({ onStart }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
          <CardDescription>
            Focus for 25 minutes, then take a 5-minute break. Boost productivity
            using the Pomodoro technique.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <button
            onClick={onStart}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Start Timer
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}

function TimerPage({ timerSettings, setTimerSettings, setSessions, navigate }) {
  const [timeLeft, setTimeLeft] = useState(timerSettings.workTime * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Update `timeLeft` whenever `timerSettings` change
    setTimeLeft(timerSettings.workTime * 60);
  }, [timerSettings]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            alert("Time's up!");
            logSession();
            return timerSettings.breakTime * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSettings.breakTime]);

  const logSession = () => {
    const now = new Date();
    setSessions((prev) => [
      ...prev,
      `${
        timerSettings.workTime
      } minutes of work at ${now.toLocaleTimeString()}`,
    ]);
  };

  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerSettings.workTime * 60);
  };

  const openSettings = () => {
    const newWorkTime = parseInt(
      prompt("Set work time in minutes:", timerSettings.workTime)
    );
    const newBreakTime = parseInt(
      prompt("Set break time in minutes:", timerSettings.breakTime)
    );
    if (!isNaN(newWorkTime) && !isNaN(newBreakTime)) {
      setTimerSettings({ workTime: newWorkTime, breakTime: newBreakTime });
      resetTimer(); // Reset the timer with new settings
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Timer</CardTitle>
          <button
            onClick={() => navigate("history")}
            className="text-blue-500 underline text-sm"
          >
            View History
          </button>
        </CardHeader>
        <CardContent>
          <div className="text-4xl text-center">
            {Math.floor(timeLeft / 60)
              .toString()
              .padStart(2, "0")}
            :{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <button
            onClick={toggleTimer}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Reset
          </button>
          <button
            onClick={openSettings}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Settings
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}

function HistoryPage({ sessions, clearHistory, navigate }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>History</CardTitle>
          <button
            onClick={() => navigate("timer")}
            className="text-blue-500 underline text-sm"
          >
            Back to Timer
          </button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {sessions.length > 0 ? (
              sessions.map((session, index) => (
                <li key={index} className="text-sm">
                  {session}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No sessions logged yet.</li>
            )}
          </ul>
        </CardContent>
        <CardFooter>
          <button
            onClick={clearHistory}
            className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
          >
            Clear History
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("main");
  const [timerSettings, setTimerSettings] = useState({
    workTime: 25,
    breakTime: 5,
  });
  const [sessions, setSessions] = useState([]);

  const navigate = (pageName) => setPage(pageName);

  return (
    <div>
      {page === "main" && <MainPage onStart={() => setPage("timer")} />}
      {page === "timer" && (
        <TimerPage
          timerSettings={timerSettings}
          setTimerSettings={setTimerSettings}
          setSessions={setSessions}
          navigate={navigate}
        />
      )}
      {page === "history" && (
        <HistoryPage
          sessions={sessions}
          clearHistory={() => setSessions([])}
          navigate={navigate}
        />
      )}
    </div>
  );
}
