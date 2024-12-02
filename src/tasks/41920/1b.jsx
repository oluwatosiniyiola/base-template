import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import * as dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const FeedbackForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = (data) => {
    const newFeedback = { ...data, timestamp: dayjs().toISOString() };
    setFeedbacks((prev) => [newFeedback, ...prev]);
    reset();
    setSuccessMessage("Thank you for your feedback!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const filteredFeedbacks = feedbacks
    .filter((feedback) =>
      feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "recent")
        return dayjs(b.timestamp).diff(dayjs(a.timestamp));
      return dayjs(a.timestamp).diff(dayjs(b.timestamp));
    });

  const feedbacksPerPage = 5;
  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Submit Your Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <p className="text-green-600 mb-4">{successMessage}</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                className="mt-1"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">Name is required</span>
              )}
            </div>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                className="mt-1"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  Valid email is required
                </span>
              )}
            </div>
            <div className="mb-4">
              <Label htmlFor="feedback">Feedback</Label>
              <textarea
                id="feedback"
                {...register("feedback", { required: true })}
                className="mt-1 block w-full rounded-md border border-gray-300"
                rows="3"
              ></textarea>
              {errors.feedback && (
                <span className="text-red-500 text-sm">
                  Feedback is required
                </span>
              )}
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>

      <div className="mb-4">
        <Input
          placeholder="Search feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <Button
          onClick={() =>
            setSortOrder(sortOrder === "recent" ? "oldest" : "recent")
          }
        >
          Sort by {sortOrder === "recent" ? "Oldest" : "Most Recent"}
        </Button>
      </div>

      <div className="grid gap-4">
        {currentFeedbacks.map((feedback, index) => (
          <Card key={index}>
            <CardContent>
              <CardTitle>{feedback.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {dayjs(feedback.timestamp).fromNow()}
              </p>
              <p>{feedback.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage}</span>
        <Button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastFeedback >= filteredFeedbacks.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default function App() {
  return <FeedbackForm />;
}
