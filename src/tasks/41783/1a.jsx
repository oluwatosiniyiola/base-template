import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MainPage = ({ onStart }) => (
  <Card className="w-full max-w-md mx-auto mt-8">
    <CardHeader>
      <CardTitle>Pomodoro Timer</CardTitle>
      <CardDescription>
        Boost your productivity with the Pomodoro Technique
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="mb-4">
        The Pomodoro Technique is a time management method that uses a timer to
        break work into intervals, traditionally 25 minutes in length, separated
        by short breaks.
      </p>
    </CardContent>
    <CardFooter>
      <Button onClick={onStart}>Start Timer</Button>
    </CardFooter>
  </Card>
);

const TimerPage = ({ onComplete }) => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState({
    workTime: 25,
    breakTime: 5,
    sound: "bell",
  });

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(interval);
      onComplete();
      playNotificationSound();
    }
    return () => clearInterval(interval);
  }, [isActive, time, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(settings.workTime * 60);
  };

  const playNotificationSound = () => {
    // In a real app, you'd play the selected sound here
    console.log(`Playing ${settings.sound} sound`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-6xl font-bold mb-4">{formatTime(time)}</div>
        <div className="space-x-2">
          <Button onClick={toggleTimer}>{isActive ? "Pause" : "Start"}</Button>
          <Button onClick={resetTimer}>Reset</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Settings</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="workTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Work Time (minutes)
                  </label>
                  <Input
                    id="workTime"
                    type="number"
                    value={settings.workTime}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workTime: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="breakTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Break Time (minutes)
                  </label>
                  <Input
                    id="breakTime"
                    type="number"
                    value={settings.breakTime}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        breakTime: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="sound"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Notification Sound
                  </label>
                  <Select
                    value={settings.sound}
                    onValueChange={(value) =>
                      setSettings({ ...settings, sound: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bell">Bell</SelectItem>
                      <SelectItem value="chime">Chime</SelectItem>
                      <SelectItem value="gong">Gong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);

  const addSession = () => {
    const now = new Date();
    setSessions([
      ...sessions,
      `25 minutes of work at ${now.getHours()}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
    ]);
  };

  const clearHistory = () => setSessions([]);

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Session History</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p>No sessions completed yet.</p>
        ) : (
          <ul className="list-disc pl-5">
            {sessions.map((session, index) => (
              <li key={index}>{session}</li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={clearHistory}>Clear History</Button>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("main");
  const [showAlert, setShowAlert] = useState(false);
  const [history, setHistory] = useState([]);

  const startTimer = () => setCurrentPage("timer");
  const completeSession = () => {
    setShowAlert(true);
    setHistory([...history, new Date()]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <ul className="flex space-x-4">
          <li>
            <Button variant="link" onClick={() => setCurrentPage("main")}>
              Main
            </Button>
          </li>
          <li>
            <Button variant="link" onClick={() => setCurrentPage("timer")}>
              Timer
            </Button>
          </li>
          <li>
            <Button variant="link" onClick={() => setCurrentPage("history")}>
              History
            </Button>
          </li>
        </ul>
      </nav>

      {currentPage === "main" && <MainPage onStart={startTimer} />}
      {currentPage === "timer" && <TimerPage onComplete={completeSession} />}
      {currentPage === "history" && <HistoryPage sessions={history} />}

      {showAlert && (
        <Alert className="mt-4">
          <AlertTitle>Session Complete!</AlertTitle>
          <AlertDescription>
            Great job! Take a short break before starting your next session.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
