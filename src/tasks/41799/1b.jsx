import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Tooltip,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useDebounce } from "use-debounce";
import { Switch } from "@/components/ui/switch";

const LibraryApp = () => {
  const [books, setBooks] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [lastDeleted, setLastDeleted] = useState(null);

  const genres = useMemo(() => Object.keys(books).sort(), [books]);

  const addBook = (newBook) => {
    if (
      Object.values(books).some(
        (genre) =>
          genre.length >= 5 &&
          genre.some((book) => book.title === newBook.title)
      )
    ) {
      alert(
        "This genre has reached its limit or this book title already exists in this genre."
      );
      return;
    }
    setBooks((prev) => ({
      ...prev,
      [newBook.genre]: [
        ...(prev[newBook.genre] || []),
        { ...newBook, id: Date.now() },
      ],
    }));
  };

  const removeBook = (id, genre) => {
    const bookToRemove = books[genre].find((book) => book.id === id);
    setBooks((prev) => ({
      ...prev,
      [genre]: prev[genre].filter((book) => book.id !== id),
    }));
    setLastDeleted({ book: bookToRemove, genre });
    setTimeout(() => setLastDeleted(null), 5000);
  };

  const undoDelete = () => {
    if (lastDeleted) {
      addBook({ ...lastDeleted.book, genre: lastDeleted.genre });
      setLastDeleted(null);
    }
  };

  const updateBook = (id, updatedBook, genre) => {
    setBooks((prev) => ({
      ...prev,
      [genre]: prev[genre].map((book) =>
        book.id === id ? { ...book, ...updatedBook } : book
      ),
    }));
  };

  const filteredBooks = useMemo(() => {
    if (!debouncedSearchTerm) return books;
    return Object.keys(books).reduce((acc, genre) => {
      const filtered = books[genre].filter(
        (book) =>
          book.title
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          book.author
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          genre.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      if (filtered.length) acc[genre] = filtered;
      return acc;
    }, {});
  }, [books, debouncedSearchTerm]);

  const totalBooks = useMemo(
    () => Object.values(books).reduce((sum, genre) => sum + genre.length, 0),
    [books]
  );

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    publicationDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.genre || !form.publicationDate) {
      alert("All fields are required.");
      return;
    }
    if (form.title.length < 3) {
      alert("Title must be at least three characters long.");
      return;
    }
    const date = new Date(form.publicationDate);
    if (isNaN(date.getTime()) || date > new Date()) {
      alert("Please enter a valid past date.");
      return;
    }
    addBook({ ...form, publicationDate: date.toISOString().split("T")[0] });
    setForm({ title: "", author: "", genre: "", publicationDate: "" });
  };

  const handleResetLibrary = () => {
    if (window.confirm("Are you sure?")) {
      if (window.confirm("This action is irreversible. Proceed?")) {
        setBooks({});
      }
    }
  };

  const BookForm = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add New Book</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {["title", "author", "genre", "publicationDate"].map((field) => (
            <div key={field} className="mb-2">
              <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
                type={field === "publicationDate" ? "date" : "text"}
              />
            </div>
          ))}
          <Button type="submit">Add Book</Button>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Library</h1>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
        <Input
          placeholder="Search by title, author, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        {BookForm()}
        {lastDeleted && (
          <Button onClick={undoDelete} className="mb-4">
            Undo Delete
          </Button>
        )}
        {totalBooks > 0 ? (
          <>
            <div className="mb-4 text-lg">Total Books: {totalBooks}</div>
            {genres.map((genre) => (
              <Card key={genre} className="mb-4">
                <CardHeader>
                  <CardTitle>
                    {genre}{" "}
                    <span className="text-sm">
                      ({filteredBooks[genre].length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredBooks[genre]
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((book) => (
                      <div
                        key={book.id}
                        className="mb-2 flex justify-between items-center"
                      >
                        <Tooltip content={`Published: ${book.publicationDate}`}>
                          <span className="hover:underline cursor-pointer">
                            {book.title}
                          </span>
                        </Tooltip>
                        <div>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (window.confirm("Edit this book?")) {
                                const newTitle = prompt(
                                  "New Title:",
                                  book.title
                                );
                                const newAuthor = prompt(
                                  "New Author:",
                                  book.author
                                );
                                const newGenre = prompt("New Genre:", genre);
                                const newDate = prompt(
                                  "New Publication Date (YYYY-MM-DD):",
                                  book.publicationDate
                                );
                                updateBook(
                                  book.id,
                                  {
                                    title: newTitle,
                                    author: newAuthor,
                                    genre: newGenre,
                                    publicationDate: newDate,
                                  },
                                  genre
                                );
                              }
                            }}
                            className="mr-2"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              window.confirm(
                                "Are you sure you want to remove this book?"
                              ) && removeBook(book.id, genre)
                            }
                            color="destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <p className="text-center mt-4">No books in the library.</p>
        )}
        {totalBooks > 0 && (
          <Button onClick={handleResetLibrary} color="destructive">
            Reset Library
          </Button>
        )}
      </div>
    </div>
  );
};

export default LibraryApp;
