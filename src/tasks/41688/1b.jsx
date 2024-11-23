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
  Textarea,
  Select,
  SelectItem,
  Checkbox,
  Label,
} from "@/components/ui/card";

const QuestionTypes = {
  MULTIPLE_CHOICE: "Multiple Choice",
  TRUE_FALSE: "True/False",
  SHORT_ANSWER: "Short Answer",
};

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState({
    title: "",
    description: "",
    questions: [],
  });
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);

  const addQuestion = () => {
    setCurrentQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          type: QuestionTypes.MULTIPLE_CHOICE,
          text: "",
          options: ["", ""],
          correctAnswer: "",
        },
      ],
    }));
  };

  const updateQuestion = (index, field, value) => {
    setCurrentQuiz((prev) => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], [field]: value };
      return { ...prev, questions };
    });
  };

  const saveQuiz = () => {
    if (currentQuiz.title && currentQuiz.questions.length > 0) {
      const updatedQuizzes =
        selectedQuizIndex !== null
          ? quizzes.map((quiz, idx) =>
              idx === selectedQuizIndex ? currentQuiz : quiz
            )
          : [...quizzes, currentQuiz];
      setQuizzes(updatedQuizzes);
      setCurrentQuiz({ title: "", description: "", questions: [] });
      setSelectedQuizIndex(null);
    }
  };

  const deleteQuiz = (index) => {
    setQuizzes(quizzes.filter((_, idx) => idx !== index));
    if (index === selectedQuizIndex) setSelectedQuizIndex(null);
  };

  const QuizPreview = ({ quiz }) => {
    const [answers, setAnswers] = useState(quiz.questions.map(() => ""));
    const [results, setResults] = useState(null);

    const checkAnswers = () => {
      const correctCount = answers.reduce(
        (acc, answer, idx) =>
          quiz.questions[idx].correctAnswer === answer ? acc + 1 : acc,
        0
      );
      setResults({ correct: correctCount, total: quiz.questions.length });
    };

    return (
      <Card className="sm:w-full">
        <CardHeader>
          <CardTitle>Quiz Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="mb-4">
              <p>{q.text}</p>
              {q.type === QuestionTypes.MULTIPLE_CHOICE &&
                q.options.map((opt, optIdx) => (
                  <Label key={optIdx}>
                    <Checkbox
                      checked={answers[idx] === opt}
                      onChange={() => updateQuestion(idx, "answer", opt)}
                    />{" "}
                    {opt}
                  </Label>
                ))}
              {q.type === QuestionTypes.TRUE_FALSE && (
                <Select
                  value={answers[idx]}
                  onChange={(e) =>
                    setAnswers((prev) => [
                      ...prev.slice(0, idx),
                      e.target.value,
                      ...prev.slice(idx + 1),
                    ])
                  }
                >
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </Select>
              )}
              {q.type === QuestionTypes.SHORT_ANSWER && (
                <Input
                  value={answers[idx]}
                  onChange={(e) =>
                    setAnswers((prev) => [
                      ...prev.slice(0, idx),
                      e.target.value,
                      ...prev.slice(idx + 1),
                    ])
                  }
                />
              )}
            </div>
          ))}
          {results ? (
            <p>
              Score: {results.correct}/{results.total}
            </p>
          ) : (
            <Button onClick={checkAnswers}>Submit</Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Builder</h1>

      {/* Quiz Creation Card */}
      <Card className="mb-4 sm:w-full">
        <CardHeader>
          <CardTitle>Create Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Quiz Title"
            value={currentQuiz.title}
            onChange={(e) =>
              setCurrentQuiz({ ...currentQuiz, title: e.target.value })
            }
            className="mb-2"
          />
          <Textarea
            placeholder="Quiz Description"
            value={currentQuiz.description}
            onChange={(e) =>
              setCurrentQuiz({ ...currentQuiz, description: e.target.value })
            }
          />
          {currentQuiz.questions.map((q, idx) => (
            <div key={idx} className="mt-4">
              <Select
                value={q.type}
                onChange={(e) => updateQuestion(idx, "type", e.target.value)}
              >
                {Object.values(QuestionTypes).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
              <Input
                value={q.text}
                onChange={(e) => updateQuestion(idx, "text", e.target.value)}
                placeholder="Question Text"
                className="mt-2"
              />
              {q.type === QuestionTypes.MULTIPLE_CHOICE && (
                <>
                  {q.options.map((opt, optIdx) => (
                    <Input
                      key={optIdx}
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...q.options];
                        newOptions[optIdx] = e.target.value;
                        updateQuestion(idx, "options", newOptions);
                      }}
                      placeholder={`Option ${optIdx + 1}`}
                      className="mt-1"
                    />
                  ))}
                  <Button
                    onClick={() =>
                      updateQuestion(idx, "options", [...q.options, ""])
                    }
                    className="mt-1"
                  >
                    Add Option
                  </Button>
                </>
              )}
              <Input
                value={q.correctAnswer}
                onChange={(e) =>
                  updateQuestion(idx, "correctAnswer", e.target.value)
                }
                placeholder="Correct Answer"
                className="mt-2"
              />
            </div>
          ))}
          <Button onClick={addQuestion} className="mt-4">
            Add Question
          </Button>
        </CardContent>
        <CardFooter>
          <Button onClick={saveQuiz}>Save Quiz</Button>
        </CardFooter>
      </Card>

      {/* Quiz List Card */}
      <Card className="mb-4 sm:w-full">
        <CardHeader>
          <CardTitle>My Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          {quizzes.map((quiz, idx) => (
            <div key={idx} className="flex justify-between items-center mb-2">
              <span>
                {quiz.title} - {quiz.questions.length} questions
              </span>
              <div>
                <Button
                  onClick={() => {
                    setCurrentQuiz(quiz);
                    setSelectedQuizIndex(idx);
                  }}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button onClick={() => deleteQuiz(idx)} className="mr-2">
                  Delete
                </Button>
                <Button onClick={() => setSelectedQuizIndex(idx)}>View</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quiz Preview Card */}
      {selectedQuizIndex !== null && (
        <QuizPreview quiz={quizzes[selectedQuizIndex] || currentQuiz} />
      )}
    </div>
  );
}

export default App;
