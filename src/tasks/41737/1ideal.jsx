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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Job Application Table Component
const JobTable = ({ applications, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Company Name</th>
            <th className="px-4 py-2 text-left">Position</th>
            <th className="px-4 py-2 text-left">Application Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{app.company}</td>
              <td className="border px-4 py-2">{app.position}</td>
              <td className="border px-4 py-2">{app.date}</td>
              <td className="border px-4 py-2">{app.status}</td>
              <td className="border px-4 py-2 flex space-x-2">
                <Button onClick={() => onEdit(index)}>Edit</Button>
                <Button onClick={() => onDelete(index)} variant="destructive">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Status Select Component
const StatusSelect = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Applied">Applied</SelectItem>
        <SelectItem value="Interviewing">Interviewing</SelectItem>
        <SelectItem value="Hired">Hired</SelectItem>
        <SelectItem value="Rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
};

// Job Application Tracker App Component
export default function App() {
  const [applications, setApplications] = useState([]);
  const [newApp, setNewApp] = useState({
    company: "",
    position: "",
    date: "",
    status: "Applied",
  });
  const [filterStatus, setFilterStatus] = useState("");

  const handleAddApplication = () => {
    setApplications([
      ...applications,
      { ...newApp, date: new Date(newApp.date).toLocaleDateString() },
    ]);
    setNewApp({ company: "", position: "", date: "", status: "Applied" });
  };

  const handleEditApplication = (index) => {
    const updatedApp = applications[index];
    setNewApp(updatedApp);
    deleteApplication(index); // Optional: You can edit or delete first before setting data in form
  };

  const handleDeleteApplication = (index) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      const updatedApps = applications.filter((_, i) => i !== index);
      setApplications(updatedApps);
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredApplications = applications.filter(
    (app) => !filterStatus || app.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Job Application Tracker</CardTitle>
          <CardDescription>
            Track your job applications efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter and Search */}
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search by Company or Position"
              value={newApp.company}
              onChange={(e) =>
                setNewApp({ ...newApp, company: e.target.value })
              }
              className="input"
            />
            <StatusSelect value={filterStatus} onChange={handleFilterChange} />
          </div>

          {/* Application Form */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Company Name"
              value={newApp.company}
              onChange={(e) =>
                setNewApp({ ...newApp, company: e.target.value })
              }
              className="input"
            />
            <input
              type="text"
              placeholder="Position"
              value={newApp.position}
              onChange={(e) =>
                setNewApp({ ...newApp, position: e.target.value })
              }
              className="input"
            />
            <input
              type="date"
              value={newApp.date}
              onChange={(e) => setNewApp({ ...newApp, date: e.target.value })}
              className="input"
            />
            <StatusSelect
              value={newApp.status}
              onChange={(status) => setNewApp({ ...newApp, status })}
            />
            <Button onClick={handleAddApplication}>Add Application</Button>
          </div>

          {/* Job Applications Table */}
          <JobTable
            applications={filteredApplications}
            onEdit={handleEditApplication}
            onDelete={handleDeleteApplication}
          />
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setApplications([])}>
            Clear All Applications
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
