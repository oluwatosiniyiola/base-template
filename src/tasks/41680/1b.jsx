import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [page, setPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [comments, setComments] = useState({});

  // Mock API call to fetch articles
  const fetchArticles = (page) => {
    // Simulating API call with setTimeout
    setTimeout(() => {
      const newArticles = Array.from({ length: 10 }, (_, i) => ({
        id: (page - 1) * 10 + i + 1,
        title: `Article ${(page - 1) * 10 + i + 1}`,
        description: `This is a brief description of Article ${
          (page - 1) * 10 + i + 1
        }`,
        category: ["Technology", "Science", "Politics", "Sports"][
          Math.floor(Math.random() * 4)
        ],
        date: new Date(Date.now() - Math.random() * 10000000000)
          .toISOString()
          .split("T")[0],
        likes: 0,
        content: `Full content of Article ${
          (page - 1) * 10 + i + 1
        }. This would typically be much longer and include more details about the article's subject matter.`,
        image: `https://picsum.photos/seed/${(page - 1) * 10 + i + 1}/300/200`,
      }));
      setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      setFilteredArticles((prevArticles) => [...prevArticles, ...newArticles]);
    }, 500);
  };

  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(articles.map((article) => article.category)),
    ];
    setCategories(uniqueCategories);
  }, [articles]);

  useEffect(() => {
    const filtered = articles.filter((article) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(article.category);
      const keywordMatch =
        article.title.toLowerCase().includes(keyword.toLowerCase()) ||
        article.description.toLowerCase().includes(keyword.toLowerCase());
      const dateMatch =
        (!dateRange.start || article.date >= dateRange.start) &&
        (!dateRange.end || article.date <= dateRange.end);
      return categoryMatch && keywordMatch && dateMatch;
    });
    setFilteredArticles(filtered);
  }, [articles, selectedCategories, keyword, dateRange]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleLike = (articleId) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === articleId
          ? { ...article, likes: article.likes + 1 }
          : article
      )
    );
  };

  const handleComment = (articleId, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [articleId]: [...(prevComments[articleId] || []), comment],
    }));
  };

  return (
    <div className="container mx-auto p-4" onScroll={handleScroll}>
      <h1 className="text-3xl font-bold mb-6">News Feed</h1>

      <div className="mb-6 flex flex-wrap gap-4">
        <Input
          placeholder="Search by keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full sm:w-auto"
        />
        <Select
          onValueChange={(value) =>
            setDateRange({ ...dateRange, start: value })
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Start Date" />
          </SelectTrigger>
          <SelectContent>{/* Add date options here */}</SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setDateRange({ ...dateRange, end: value })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="End Date" />
          </SelectTrigger>
          <SelectContent>{/* Add date options here */}</SelectContent>
        </Select>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={category}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => handleCategoryChange(category)}
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer"
            onClick={() => setSelectedArticle(article)}
          >
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>{article.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-40 object-cover mb-4"
              />
              <p className="text-sm text-gray-500">{article.date}</p>
              <p className="text-sm text-gray-500">{article.category}</p>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(article.id);
                }}
              >
                Like ({article.likes})
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedArticle}
        onOpenChange={() => setSelectedArticle(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
            <DialogDescription>
              {selectedArticle?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <img
              src={selectedArticle?.image}
              alt={selectedArticle?.title}
              className="w-full h-60 object-cover mb-4"
            />
            <p>{selectedArticle?.content}</p>
            <div className="mt-4">
              <h3 className="font-bold">Comments</h3>
              {comments[selectedArticle?.id]?.map((comment, index) => (
                <p key={index} className="text-sm">
                  {comment}
                </p>
              ))}
              <Input
                placeholder="Add a comment"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleComment(selectedArticle.id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsFeed;
