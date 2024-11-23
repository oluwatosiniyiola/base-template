import React, { useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const QuestionForm = ({ onAdd }) => {
  const [question, setQuestion] = useState({
    type: "",
    text: "",
    options: [],
    correctAnswer: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.text.trim()) {
      alert("Question text cannot be empty.");
      return;
    }
    if (question.type === "multiple" && question.options.length < 2) {
      alert("Multiple choice questions must have at least two options.");
      return;
    }
    if (
      question.type === "truefalse" &&
      !["true", "false"].includes(question.correctAnswer.toLowerCase())
    ) {
      alert(
        "True/False questions must have 'true' or 'false' as the correct answer."
      );
      return;
    }
    if (!question.correctAnswer.trim()) {
      alert("Please provide a correct answer.");
      return;
    }
    onAdd(question);
    setQuestion({ type: "", text: "", options: [], correctAnswer: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        onValueChange={(value) => setQuestion({ ...question, type: value })}
        value={question.type}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select question type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="multiple">Multiple Choice</SelectItem>
          <SelectItem value="truefalse">True/False</SelectItem>
          <SelectItem value="short">Short Answer</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Question text"
        value={question.text}
        onChange={(e) => setQuestion({ ...question, text: e.target.value })}
      />
      {question.type === "multiple" && (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <Input
              key={index}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...question.options];
                newOptions[index] = e.target.value;
                setQuestion({ ...question, options: newOptions });
              }}
            />
          ))}
          <Button
            type="button"
            onClick={() =>
              setQuestion({ ...question, options: [...question.options, ""] })
            }
          >
            Add Option
          </Button>
        </div>
      )}
      {question.type === "truefalse" && (
        <div className="space-y-2">
          <RadioGroup
            onValueChange={(value) =>
              setQuestion({ ...question, correctAnswer: value })
            }
            value={question.correctAnswer}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true-option" />
              <Label htmlFor="true-option">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false-option" />
              <Label htmlFor="false-option">False</Label>
            </div>
          </RadioGroup>
        </div>
      )}
      <Input
        placeholder="Correct Answer"
        value={question.correctAnswer}
        onChange={(e) =>
          setQuestion({ ...question, correctAnswer: e.target.value })
        }
        disabled={question.type === "truefalse"}
      />
      <Button type="submit">Add Question</Button>
    </form>
  );
};

const QuizList = ({ quizzes, onEdit, onDelete, onView }) => (
  <div className="space-y-4">
    {quizzes.map((quiz, index) => (
      <Card key={index}>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>
            {quiz.questions.length} questions |{" "}
            {quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No time limit"}
          </CardDescription>
        </CardHeader>
        <CardFooter className="space-x-2">
          <Button onClick={() => onEdit(index)}>Edit</Button>
          <Button onClick={() => onDelete(index)} variant="destructive">
            Delete
          </Button>
          <Button onClick={() => onView(index)}>View</Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);

const QuizPreview = ({ quiz, onComplete }) => {
  const [answers, setAnswers] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const score = quiz.questions.reduce((acc, q, index) => {
      const correct =
        q.type === "truefalse"
          ? answers[index]?.toLowerCase() === q.correctAnswer.toLowerCase()
          : answers[index] === q.correctAnswer;
      return acc + (correct ? 1 : 0);
    }, 0);
    onComplete(score);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {quiz.questions.map((q, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{q.text}</CardTitle>
          </CardHeader>
          <CardContent>
            {q.type === "multiple" ? (
              <RadioGroup
                onValueChange={(value) =>
                  setAnswers({ ...answers, [index]: value })
                }
              >
                {q.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option}
                      id={`q${index}-option${optionIndex}`}
                    />
                    <Label htmlFor={`q${index}-option${optionIndex}`}>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : q.type === "truefalse" ? (
              <RadioGroup
                onValueChange={(value) =>
                  setAnswers({ ...answers, [index]: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`q${index}-true`} />
                  <Label htmlFor={`q${index}-true`}>True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`q${index}-false`} />
                  <Label htmlFor={`q${index}-false`}>False</Label>
                </div>
              </RadioGroup>
            ) : (
              <Input
                placeholder="Your answer"
                onChange={(e) =>
                  setAnswers({ ...answers, [index]: e.target.value })
                }
              />
            )}
          </CardContent>
        </Card>
      ))}
      <Button type="submit">Submit Quiz</Button>
    </form>
  );
};

export default function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState({
    title: "",
    description: "",
    questions: [],
    timeLimit: "",
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const addQuiz = () => {
    if (currentQuiz.title && currentQuiz.questions.length > 0) {
      setQuizzes([...quizzes, currentQuiz]);
      setCurrentQuiz({
        title: "",
        description: "",
        questions: [],
        timeLimit: "",
      });
    } else {
      alert("Please add a title and at least one question to the quiz.");
    }
  };

  const editQuiz = (index) => {
    setCurrentQuiz(quizzes[index]);
    setQuizzes(quizzes.filter((_, i) => i !== index));
  };

  const deleteQuiz = (index) => {
    setQuizzes(quizzes.filter((_, i) => i !== index));
  };

  const viewQuiz = (index) => {
    setSelectedQuiz(quizzes[index]);
    setQuizResult(null);
  };

  const handleQuizComplete = (score) => {
    setQuizResult(
      `You scored ${score} out of ${selectedQuiz.questions.length}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Interactive Quiz Builder</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Quiz Title"
              value={currentQuiz.title}
              onChange={(e) =>
                setCurrentQuiz({ ...currentQuiz, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Quiz Description"
              value={currentQuiz.description}
              onChange={(e) =>
                setCurrentQuiz({ ...currentQuiz, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Time Limit (minutes)"
              value={currentQuiz.timeLimit}
              onChange={(e) =>
                setCurrentQuiz({ ...currentQuiz, timeLimit: e.target.value })
              }
            />
            <QuestionForm
              onAdd={(question) =>
                setCurrentQuiz({
                  ...currentQuiz,
                  questions: [...currentQuiz.questions, question],
                })
              }
            />
          </CardContent>
          <CardFooter>
            <Button onClick={addQuiz}>Save Quiz</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quiz List</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizList
              quizzes={quizzes}
              onEdit={editQuiz}
              onDelete={deleteQuiz}
              onView={viewQuiz}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedQuiz ? (
              quizResult ? (
                <div>
                  <p className="mb-4">{quizResult}</p>
                  <Button onClick={() => setQuizResult(null)}>
                    Retake Quiz
                  </Button>
                </div>
              ) : (
                <QuizPreview
                  quiz={selectedQuiz}
                  onComplete={handleQuizComplete}
                />
              )
            ) : (
              <p>Select a quiz to preview</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
