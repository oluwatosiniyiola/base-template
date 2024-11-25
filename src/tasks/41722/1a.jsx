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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ProjectForm({ project, onSubmit, onCancel }) {
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [skills, setSkills] = useState(project?.skills?.join(", ") || "");
  const [url, setUrl] = useState(project?.url || "");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!skills.trim()) newErrors.skills = "At least one skill is required";
    if (url && !/^https?:\/\/.+\..+/.test(url))
      newErrors.url = "Invalid URL format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        id: project?.id || Date.now(),
        title,
        description,
        skills: skills.split(",").map((skill) => skill.trim()),
        url,
        status: project?.status || "In Progress",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className={errors.skills ? "border-red-500" : ""}
        />
        {errors.skills && (
          <p className="text-red-500 text-sm">{errors.skills}</p>
        )}
      </div>
      <div>
        <Label htmlFor="url">Project URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={errors.url ? "border-red-500" : ""}
        />
        {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Project</Button>
      </div>
    </form>
  );
}

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.status}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{project.description}</p>
        <p className="text-sm">Skills: {project.skills.join(", ")}</p>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Project URL
          </a>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onEdit(project)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(project.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addProject = (project) => {
    setProjects([...projects, project]);
    setEditingProject(null);
  };

  const updateProject = (updatedProject) => {
    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setEditingProject(null);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Dynamic Portfolio Builder</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search projects by title or skill"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      {editingProject ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingProject.id ? "Edit Project" : "Add New Project"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm
              project={editingProject}
              onSubmit={editingProject.id ? updateProject : addProject}
              onCancel={() => setEditingProject(null)}
            />
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setEditingProject({})} className="mb-6">
          Add New Project
        </Button>
      )}
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={setEditingProject}
            onDelete={deleteProject}
          />
        ))
      ) : (
        <Alert>
          <AlertTitle>No projects found</AlertTitle>
          <AlertDescription>
            {searchTerm
              ? "Try adjusting your search term."
              : "Add a new project to get started."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
