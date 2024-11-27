import React, { useState, useEffect, useCallback } from "react";
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
import { Select, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

function App() {
  const [page, setPage] = useState("main");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [sound, setSound] = useState("bell");
  const [history, setHistory] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      clearInterval(interval);
      const now = new Date();
      const sessionType = timeLeft === 0 ? "Work" : "Break";
      setHistory([...history, `${sessionType} at ${now.toLocaleTimeString()}`]);
      toast({
        title: `${sessionType} session completed.`,
        description: "Time for a break or work!",
      });
      setTimeLeft(sessionType === "Work" ? breakTime * 60 : workTime * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, workTime, breakTime, history, toast]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(workTime * 60);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const SettingsModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <Card className="w-full max-w-sm p-4">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            value={workTime}
            onChange={(e) => setWorkTime(e.target.value)}
            label="Work Time (minutes)"
            className="mb-2"
          />
          <Input
            type="number"
            value={breakTime}
            onChange={(e) => setBreakTime(e.target.value)}
            label="Break Time (minutes)"
            className="mb-2"
          />
          <Select value={sound} onValueChange={setSound}>
            <SelectItem value="bell">Bell</SelectItem>
            <SelectItem value="chime">Chime</SelectItem>
          </Select>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-8">
      {page === "main" && (
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Pomodoro Timer</CardTitle>
            <CardDescription>
              The Pomodoro Technique is a time management method that uses a
              timer to break work into intervals, traditionally 25 minutes in
              length, separated by short breaks.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setPage("timer")}>Start Timer</Button>
          </CardFooter>
        </Card>
      )}

      {page === "timer" && (
        <Card className="w-full max-w-lg">
          <CardContent className="text-center">
            <div className="text-5xl mb-4">{formatTime(timeLeft)}</div>
            <Button onClick={toggleTimer}>
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetTimer} className="ml-2">
              Reset
            </Button>
            <Button onClick={() => setPage("settings")} className="ml-2">
              Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {page === "settings" && (
        <SettingsModal onClose={() => setPage("timer")} />
      )}

      {page === "history" && (
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            {history.map((entry, idx) => (
              <div key={idx}>{entry}</div>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={() => setHistory([])}>Clear History</Button>
            <Button onClick={() => setPage("main")} className="ml-2">
              Back
            </Button>
          </CardFooter>
        </Card>
      )}

      {(page === "main" || page === "history") && (
        <Button onClick={() => setPage("history")} className="mt-4">
          View History
        </Button>
      )}
    </div>
  );
}

export default App;
