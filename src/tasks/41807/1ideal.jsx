import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

const initialPosts = [
  {
    id: 1,
    title: "First Blog Post",
    content: "This is the content of the first blog post...",
    author: "John Doe",
    comments: [],
  },
  {
    id: 2,
    title: "Second Blog Post",
    content: "This is the content of the second blog post...",
    author: "Jane Smith",
    comments: [],
  },
];

export default function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [editingPost, setEditingPost] = useState(null);

  const postsPerPage = 5;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleExpand = (id) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCreatePost = () => {
    //Validate submission first
    if (
      !newPost.title.trim() ||
      !newPost.content.trim() ||
      !newPost.author.trim()
    ) {
      alert(
        "All fields (Title, Content, and Author) are required to create a post."
      );
      return;
    }
    setPosts([...posts, { ...newPost, id: posts.length + 1, comments: [] }]);
    setNewPost({ title: "", content: "", author: "" });
  };

  const handleUpdatePost = () => {
    setPosts(
      posts.map((post) => (post.id === editingPost.id ? editingPost : post))
    );
    setEditingPost(null);
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleAddComment = (postId, comment) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: post.comments.length + 1, text: comment },
              ],
            }
          : post
      )
    );
  };

  const handleEditComment = (postId, commentId, newText) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, text: newText }
                  : comment
              ),
            }
          : post
      )
    );
  };

  const handleDeleteComment = (postId, commentId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment) => comment.id !== commentId
              ),
            }
          : post
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog Platform</h1>
      <Input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="mb-2"
            />
            <Textarea
              placeholder="Content"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              className="mb-2"
            />
            <Input
              type="text"
              placeholder="Author"
              value={newPost.author}
              onChange={(e) =>
                setNewPost({ ...newPost, author: e.target.value })
              }
              className="mb-2"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreatePost}>Create Post</Button>
          </CardFooter>
        </Card>
        {editingPost && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Post</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                value={editingPost.title}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, title: e.target.value })
                }
                className="mb-2"
              />
              <Textarea
                value={editingPost.content}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, content: e.target.value })
                }
                className="mb-2"
              />
              <Input
                type="text"
                value={editingPost.author}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, author: e.target.value })
                }
                className="mb-2"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdatePost}>Update Post</Button>
            </CardFooter>
          </Card>
        )}
      </div>
      {currentPosts.map((post) => (
        <Card key={post.id} className="mb-4">
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>By {post.author}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {expandedPosts[post.id]
                ? post.content
                : `${post.content.substring(0, 100)}...`}
            </p>
            <Button className="mt-2" onClick={() => toggleExpand(post.id)}>
              {expandedPosts[post.id] ? "Show Less" : "Read More"}
            </Button>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setEditingPost(post)} className="mr-2">
              Edit
            </Button>
            <Button
              onClick={() => handleDeletePost(post.id)}
              variant="destructive"
            >
              Delete
            </Button>
          </CardFooter>
          <CardContent>
            <h3 className="font-bold mb-2">Comments</h3>
            {post.comments.map((comment) => (
              <div key={comment.id} className="mb-2">
                <p>{comment.text}</p>
                <Button
                  onClick={() =>
                    handleEditComment(
                      post.id,
                      comment.id,
                      prompt("Edit comment:", comment.text)
                    )
                  }
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteComment(post.id, comment.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            ))}
            <Input
              type="text"
              placeholder="Add a comment"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddComment(post.id, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(filteredPosts.length / postsPerPage) },
          (_, i) => (
            <Button key={i} onClick={() => paginate(i + 1)} className="mx-1">
              {i + 1}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
