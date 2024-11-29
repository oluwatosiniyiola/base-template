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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PollCreator = ({ onCreatePoll }) => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState("5");

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && options.every((opt) => opt.trim() !== "")) {
      onCreatePoll({
        title,
        options: options.filter((opt) => opt.trim() !== ""),
        duration: parseInt(duration),
        createdAt: new Date(),
      });
      setTitle("");
      setOptions(["", ""]);
      setDuration("5");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create a New Poll</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Poll Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {options.map((option, index) => (
            <div key={index}>
              <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
              <Input
                id={`option-${index}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
            </div>
          ))}
          {options.length < 5 && (
            <Button type="button" onClick={handleAddOption}>
              Add Option
            </Button>
          )}
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="60">60</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Create Poll</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const PollVoting = ({ poll, onVote }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleVote = () => {
    if (selectedOption) {
      onVote(poll.id, selectedOption);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
          {poll.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={handleVote} disabled={!selectedOption || poll.closed}>
          Vote
        </Button>
      </CardFooter>
    </Card>
  );
};

const PollResults = ({ poll }) => {
  const totalVotes = Object.values(poll.votes).reduce((a, b) => a + b, 0);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        <CardDescription>
          {poll.closed ? "Poll Closed" : "Poll Results"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {poll.options.map((option) => (
            <li key={option} className="flex justify-between">
              <span>{option}:</span>
              <span>
                {poll.votes[option] || 0} votes (
                {totalVotes > 0
                  ? ((poll.votes[option] || 0) / totalVotes) * 100
                  : 0}
                %)
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <p>Total votes: {totalVotes}</p>
      </CardFooter>
    </Card>
  );
};

const PollTimer = ({ poll }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const endTime = new Date(
        poll.createdAt.getTime() + poll.duration * 60000
      );
      const remaining = Math.max(0, endTime - now);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [poll]);

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  return (
    <div className="text-center mt-4">
      {timeRemaining > 0 ? (
        <p>
          Time remaining: {minutes}m {seconds}s
        </p>
      ) : (
        <p>Poll closed</p>
      )}
    </div>
  );
};

export default function App() {
  const [polls, setPolls] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState(null);

  const createPoll = (newPoll) => {
    const pollWithId = { ...newPoll, id: Date.now(), votes: {}, closed: false };
    setPolls([...polls, pollWithId]);
    setSelectedPollId(pollWithId.id);
  };

  const vote = (pollId, option) => {
    setPolls(
      polls.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            votes: { ...poll.votes, [option]: (poll.votes[option] || 0) + 1 },
          };
        }
        return poll;
      })
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPolls((currentPolls) =>
        currentPolls.map((poll) => {
          const now = new Date();
          const endTime = new Date(
            poll.createdAt.getTime() + poll.duration * 60000
          );
          if (!poll.closed && now >= endTime) {
            return { ...poll, closed: true };
          }
          return poll;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const selectedPoll = polls.find((poll) => poll.id === selectedPollId);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Real-Time Voting Poll Widget
      </h1>
      <div className="space-y-8">
        <PollCreator onCreatePoll={createPoll} />
        {polls.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Select a Poll</h2>
            <Select
              value={selectedPollId?.toString()}
              onValueChange={(value) => setSelectedPollId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a poll" />
              </SelectTrigger>
              <SelectContent>
                {polls.map((poll) => (
                  <SelectItem key={poll.id} value={poll.id.toString()}>
                    {poll.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {selectedPoll && (
          <div className="space-y-4">
            <PollVoting poll={selectedPoll} onVote={vote} />
            <PollResults poll={selectedPoll} />
            <PollTimer poll={selectedPoll} />
          </div>
        )}
      </div>
    </div>
  );
}
