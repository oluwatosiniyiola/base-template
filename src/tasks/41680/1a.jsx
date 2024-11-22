import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  CheckboxIndicator,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/card";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [visibleArticles, setVisibleArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: [],
    keywords: "",
    dateRange: { start: null, end: null },
  });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});

  // Mock data fetching
  useEffect(() => {
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      title: `Article ${i}`,
      content: `This is the content for Article ${i}.`,
      category: ["Tech", "Health", "Sports"][i % 3],
      date: new Date(2023, 4, (i % 30) + 1).toISOString().split("T")[0],
      image: `image-${i % 5}.jpg`,
      video: i % 4 === 0 ? "video.mp4" : null,
    }));

    setArticles(mockData);
    setVisibleArticles(mockData.slice(0, 10));
  }, []);

  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        (filters.categories.length === 0 ||
          filters.categories.includes(article.category)) &&
        (filters.keywords === "" ||
          article.title
            .toLowerCase()
            .includes(filters.keywords.toLowerCase())) &&
        (!filters.dateRange.start ||
          new Date(article.date) >= new Date(filters.dateRange.start)) &&
        (!filters.dateRange.end ||
          new Date(article.date) <= new Date(filters.dateRange.end))
    );
    setVisibleArticles(filtered.slice(0, page * 10));
  }, [filters, page, articles]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addComment = (id, comment) => {
    setComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), comment],
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex mb-4 space-x-4">
        <Select
          onValueChange={(value) => handleFilterChange("categories", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tech">Tech</SelectItem>
            <SelectItem value="Health">Health</SelectItem>
            <SelectItem value="Sports">Sports</SelectItem>
          </SelectContent>
        </Select>
        <input
          type="text"
          placeholder="Search by keyword"
          onChange={(e) => handleFilterChange("keywords", e.target.value)}
          className="border p-2 rounded"
        />
        {/* Date range picker would go here, simplified for this example */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleArticles.map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer"
            onClick={() => setSelectedArticle(article)}
          >
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>{article.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{article.content.substring(0, 100)}...</p>
              <Button onClick={() => toggleLike(article.id)}>
                {likes[article.id] ? "Unlike" : "Like"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {visibleArticles.length < articles.length && (
        <Button onClick={loadMore} className="mt-4">
          Load More
        </Button>
      )}

      {selectedArticle && (
        <Modal
          open={!!selectedArticle}
          onOpenChange={() => setSelectedArticle(null)}
        >
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{selectedArticle.title}</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <img src={selectedArticle.image} alt={selectedArticle.title} />
              <p>{selectedArticle.content}</p>
              {selectedArticle.video && (
                <video src={selectedArticle.video} controls />
              )}
              <div>
                <Button onClick={() => toggleLike(selectedArticle.id)}>
                  {likes[selectedArticle.id] ? "Unlike" : "Like"}
                </Button>
                <div>
                  Comments:
                  {(comments[selectedArticle.id] || []).map((comment, idx) => (
                    <p key={idx}>{comment}</p>
                  ))}
                  <input
                    type="text"
                    placeholder="Add a comment"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addComment(selectedArticle.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setSelectedArticle(null)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default NewsFeed;
