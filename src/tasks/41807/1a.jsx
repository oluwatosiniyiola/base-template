import React, { useState, useEffect, useCallback } from "react";
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
  Label,
} from "@/components/ui/card";
import { useDebounce } from "@/hooks/useDebounce";

// Mock data storage since we can't use external storage or databases
let mockPosts = [
  {
    id: 1,
    title: "First Post",
    content: "This is the content of the first post.",
    author: "Alice",
    comments: [],
  },
  // Add more mock posts here...
];

function PostCard({ post, onViewMore, onDelete }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>By {post.author}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{post.content.slice(0, 100)}...</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onViewMore(post)}>Read More</Button>
        <Button onClick={() => onDelete(post.id)} variant="destructive">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

function Comment({ comment, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);

  return (
    <div className="border-t mt-2 pt-2">
      {isEditing ? (
        <Textarea value={text} onChange={(e) => setText(e.target.value)} />
      ) : (
        <p>{text}</p>
      )}
      <div className="flex justify-end space-x-2 mt-2">
        {isEditing ? (
          <Button
            onClick={() => {
              onEdit(comment.id, text);
              setIsEditing(false);
            }}
          >
            Save
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
        <Button onClick={() => onDelete(comment.id)} variant="destructive">
          Delete
        </Button>
      </div>
    </div>
  );
}

function PostDetail({
  post,
  onClose,
  onComment,
  onEditComment,
  onDeleteComment,
}) {
  const [commentText, setCommentText] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="w-full max-w-lg p-4">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>By {post.author}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{post.content}</p>
        </CardContent>
        <CardFooter>
          <Input
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="mb-2"
          />
          <Button
            onClick={() => {
              onComment(commentText);
              setCommentText("");
            }}
          >
            Comment
          </Button>
        </CardFooter>
        {post.comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
          />
        ))}
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </Card>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center space-x-2 my-4">
      {[...Array(totalPages)].map((_, index) => (
        <Button
          key={index}
          onClick={() => onPageChange(index + 1)}
          variant={currentPage === index + 1 ? "default" : "outline"}
        >
          {index + 1}
        </Button>
      ))}
    </div>
  );
}

export default function App() {
  const [posts, setPosts] = useState(mockPosts);
  const [currentPost, setCurrentPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleCreatePost = (newPost) => {
    setPosts([{ id: Date.now(), comments: [], ...newPost }, ...posts]);
  };

  const handleEditPost = (id, updatedPost) => {
    setPosts(
      posts.map((post) => (post.id === id ? { ...post, ...updatedPost } : post))
    );
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleComment = (postId, commentText) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: Date.now(), text: commentText },
              ],
            }
          : post
      )
    );
  };

  const handleEditComment = (postId, commentId, updatedText) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((c) =>
                c.id === commentId ? { ...c, text: updatedText } : c
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
              comments: post.comments.filter((c) => c.id !== commentId),
            }
          : post
      )
    );
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Blog Platform</h1>
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <CreatePostForm onCreate={handleCreatePost} />
        {currentPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onViewMore={setCurrentPost}
            onDelete={handleDeletePost}
          />
        ))}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {currentPost && (
        <PostDetail
          post={currentPost}
          onClose={() => setCurrentPost(null)}
          onComment={(text) => handleComment(currentPost.id, text)}
          onEditComment={(commentId, text) =>
            handleEditComment(currentPost.id, commentId, text)
          }
          onDeleteComment={(commentId) =>
            handleDeleteComment(currentPost.id, commentId)
          }
        />
      )}
    </div>
  );
}

function CreatePostForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => {
            onCreate({ title, content, author });
            setTitle("");
            setContent("");
            setAuthor("");
          }}
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  );
}
