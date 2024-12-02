import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FeedbackForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!message.trim()) newErrors.message = "Feedback is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ name, email, message, timestamp: new Date() });
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Submit Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="message">Feedback</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={errors.message ? "border-red-500" : ""}
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
          </div>
          <Button type="submit">Submit Feedback</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const FeedbackItem = ({ feedback }) => (
  <Card className="mb-4">
    <CardContent className="pt-4">
      <h3 className="font-bold">{feedback.name}</h3>
      <p className="text-sm text-gray-500">{feedback.email}</p>
      <p className="mt-2">{feedback.message}</p>
      <p className="text-sm text-gray-500 mt-2">
        {new Date(feedback.timestamp).toLocaleString()}
      </p>
    </CardContent>
  </Card>
);

const FeedbackList = ({ feedbacks, searchTerm, sortOrder }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredFeedbacks = feedbacks
    .filter((feedback) =>
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp
    );

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {paginatedFeedbacks.map((feedback, index) => (
        <FeedbackItem key={index} feedback={feedback} />
      ))}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = (newFeedback) => {
    setFeedbacks([...feedbacks, newFeedback]);
    setShowSuccess(true);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">User Feedback Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FeedbackForm onSubmit={handleSubmit} />
          {showSuccess && (
            <Alert className="mt-4">
              <AlertDescription>
                Thank you for your feedback! It has been submitted successfully.
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Submitted Feedback</h2>
          <div className="mb-4">
            <Input
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <FeedbackList
            feedbacks={feedbacks}
            searchTerm={searchTerm}
            sortOrder={sortOrder}
          />
        </div>
      </div>
    </div>
  );
}
