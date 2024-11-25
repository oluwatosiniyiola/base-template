import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui";
import { Check, Edit, Trash } from "lucide-react";

function App() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({
    company: "",
    position: "",
    date: "",
    status: "Applied",
  });
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const savedApps = JSON.parse(
      localStorage.getItem("jobApplications") || "[]"
    );
    setApplications(savedApps);
  }, []);

  useEffect(() => {
    localStorage.setItem("jobApplications", JSON.stringify(applications));
  }, [applications]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId !== null) {
      setApplications(
        applications.map((app) =>
          app.id === editId ? { ...form, id: editId } : app
        )
      );
      setEditId(null);
    } else {
      setApplications([...applications, { ...form, id: Date.now() }]);
    }
    setForm({ company: "", position: "", date: "", status: "Applied" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      setApplications(applications.filter((app) => app.id !== id));
    }
  };

  const handleEdit = (app) => {
    setEditId(app.id);
    setForm(app);
  };

  const filteredApplications = applications.filter(
    (app) =>
      (filterStatus === "All" || app.status === filterStatus) &&
      (app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Job Application Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            <Input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Company Name"
              required
            />
            <Input
              type="text"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              placeholder="Position"
              required
            />
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
            <Select
              value={form.status}
              onChange={(value) => setForm({ ...form, status: value })}
            >
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </Select>
            <Button type="submit">
              {editId !== null ? "Update" : "Add"} Application
            </Button>
          </form>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <Input
              placeholder="Search by company or position"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select onValueChange={setFilterStatus}>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Company</th>
                  <th className="px-4 py-2">Position</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="border px-4 py-2">{app.company}</td>
                    <td className="border px-4 py-2">{app.position}</td>
                    <td className="border px-4 py-2">{app.date}</td>
                    <td className="border px-4 py-2">{app.status}</td>
                    <td className="border px-4 py-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(app)}
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(app.id)}
                      >
                        <Trash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredApplications.length === 0 && (
              <p className="text-center py-4">
                No applications match the current filter.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
