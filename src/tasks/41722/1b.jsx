import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Label,
  Textarea,
  Alert,
} from "@/components/ui";
import { Check, Trash2, Edit, Search } from "lucide-react";

function App() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    url: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Simple validation for URL format
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (form.url && !urlRegex.test(form.url)) {
      setError("Please enter a valid URL.");
    } else {
      setError("");
    }
  }, [form.url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      setError("Project title is required.");
      return;
    }
    if (!form.skills.split(",").filter(Boolean).length) {
      setError("At least one skill must be added.");
      return;
    }

    if (editingId !== null) {
      setProjects(
        projects.map((p) =>
          p.id === editingId ? { ...form, id: editingId } : p
        )
      );
    } else {
      setProjects([...projects, { ...form, id: Date.now() }]);
    }
    setForm({ title: "", description: "", skills: "", url: "" });
    setEditingId(null);
    setError("");
  };

  const startEdit = (project) => {
    setForm(project);
    setEditingId(project.id);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8">
      <h1 className="text-2xl mb-4 text-center">Portfolio Builder</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          icon={<Search />}
          placeholder="Search by title or skill..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
      </div>

      {/* Form for Adding/Editing Project */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Project" : "Add New Project"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2 mb-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
              />
              <Label htmlFor="url">Project URL</Label>
              <Input
                id="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              {editingId ? "Update Project" : "Add Project"}
            </Button>
            {error && (
              <Alert className="mt-2" variant="destructive">
                {error}
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Projects Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Skills:</strong> {project.skills}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-500">Live</span>
              </p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Visit Project
              </a>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => startEdit(project)}>
                <Edit className="mr-2" /> Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteProject(project.id)}
              >
                <Trash2 className="mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
