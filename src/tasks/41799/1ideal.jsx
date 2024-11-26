import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  createContext,
} from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ThemeContext = createContext();

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <div
        className={`min-h-screen ${
          isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <Library />
      </div>
    </ThemeContext.Provider>
  );
};

const Library = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [undoBook, setUndoBook] = useState(null);
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

  const genres = useMemo(
    () => [...new Set(books.map((book) => book.genre))],
    [books]
  );

  const addBook = (newBook) => {
    if (books.filter((book) => book.genre === newBook.genre).length >= 5) {
      alert(`Maximum of 5 books reached for the genre: ${newBook.genre}`);
      return;
    }
    if (
      books.some(
        (book) =>
          book.title.toLowerCase() === newBook.title.toLowerCase() &&
          book.genre === newBook.genre
      )
    ) {
      alert("A book with this title already exists in this genre.");
      return;
    }
    setBooks((prevBooks) =>
      [...prevBooks, newBook].sort((a, b) => a.title.localeCompare(b.title))
    );
  };

  const removeBook = (bookToRemove) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book !== bookToRemove));
    setUndoBook(bookToRemove);
    setTimeout(() => setUndoBook(null), 5000);
  };

  const editBook = (oldBook, updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks
        .map((book) => (book === oldBook ? updatedBook : book))
        .sort((a, b) => a.title.localeCompare(b.title))
    );
  };

  const undoRemove = () => {
    if (undoBook) {
      setBooks((prevBooks) =>
        [...prevBooks, undoBook].sort((a, b) => a.title.localeCompare(b.title))
      );
      setUndoBook(null);
    }
  };

  const resetLibrary = () => {
    setBooks([]);
  };

  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  const debouncedSearch = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Personal Library</h1>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search books..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="w-64"
        />
        <div className="flex items-center">
          <Label htmlFor="dark-mode" className="mr-2">
            Dark Mode
          </Label>
          <Switch
            id="dark-mode"
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
          />
        </div>
      </div>
      <AddBookForm addBook={addBook} />
      {books.length > 0 && (
        <div className="mb-4">
          <p>Total books: {books.length}</p>
          {genres.map((genre) => (
            <p key={genre}>
              {genre}: {books.filter((book) => book.genre === genre).length}
            </p>
          ))}
        </div>
      )}
      <Accordion type="single" collapsible className="mb-4">
        {genres.map((genre) => (
          <AccordionItem key={genre} value={genre}>
            <AccordionTrigger>{genre}</AccordionTrigger>
            <AccordionContent>
              {filteredBooks
                .filter((book) => book.genre === genre)
                .map((book) => (
                  <BookItem
                    key={book.title}
                    book={book}
                    removeBook={removeBook}
                    editBook={editBook}
                  />
                ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {undoBook && (
        <Button onClick={undoRemove} className="mb-4">
          Undo Remove
        </Button>
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Reset Library</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove all books from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={resetLibrary}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const AddBookForm = ({ addBook }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [publicationDate, setPublicationDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !genre || !publicationDate) {
      alert("All fields are required.");
      return;
    }
    if (title.length < 3) {
      alert("Title must be at least 3 characters long.");
      return;
    }
    if (new Date(publicationDate) > new Date()) {
      alert("Publication date must be in the past.");
      return;
    }
    addBook({ title, author, genre, publicationDate });
    setTitle("");
    setAuthor("");
    setGenre("");
    setPublicationDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
          />
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select value={genre} onValueChange={setGenre} required>
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fiction">Fiction</SelectItem>
              <SelectItem value="Non-fiction">Non-fiction</SelectItem>
              <SelectItem value="Science Fiction">Science Fiction</SelectItem>
              <SelectItem value="Mystery">Mystery</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="publicationDate">Publication Date</Label>
          <Input
            id="publicationDate"
            type="date"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            required
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>
      <Button type="submit" className="mt-4">
        Add Book
      </Button>
    </form>
  );
};

const BookItem = ({ book, removeBook, editBook }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState({ ...book });

  const handleEdit = () => {
    if (isEditing) {
      editBook(book, editedBook);
    }
    setIsEditing(!isEditing);
  };

  return (
    <Card className="mb-2">
      <CardHeader>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle>{book.title}</CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Title: {book.title}</p>
              <p>Author: {book.author}</p>
              <p>Genre: {book.genre}</p>
              <p>Publication Date: {book.publicationDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid grid-cols-1 gap-2">
            <Input
              value={editedBook.title}
              onChange={(e) =>
                setEditedBook({ ...editedBook, title: e.target.value })
              }
            />
            <Input
              value={editedBook.author}
              onChange={(e) =>
                setEditedBook({ ...editedBook, author: e.target.value })
              }
            />
            <Select
              value={editedBook.genre}
              onValueChange={(value) =>
                setEditedBook({ ...editedBook, genre: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fiction">Fiction</SelectItem>
                <SelectItem value="Non-fiction">Non-fiction</SelectItem>
                <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                <SelectItem value="Mystery">Mystery</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={editedBook.publicationDate}
              onChange={(e) =>
                setEditedBook({
                  ...editedBook,
                  publicationDate: e.target.value,
                })
              }
            />
          </div>
        ) : (
          <>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Publication Date: {book.publicationDate}</p>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Remove</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Removal</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this book?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => removeBook(book)}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button onClick={handleEdit}>{isEditing ? "Save" : "Edit"}</Button>
      </CardFooter>
    </Card>
  );
};

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default App;
