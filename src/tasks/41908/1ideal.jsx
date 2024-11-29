import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusOptions = ["applied", "interviewing", "rejected", "offer"];

const JobApplicationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    position: "",
    application_date: "",
    status: "applied",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      company_name: "",
      position: "",
      application_date: "",
      status: "applied",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="company_name">Company Name</Label>
        <Input
          id="company_name"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="application_date">Application Date</Label>
        <Input
          id="application_date"
          name="application_date"
          type="date"
          value={formData.application_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          name="status"
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Add Application</Button>
    </form>
  );
};

const TimelineView = ({ applications }) => (
  <div className="space-y-4">
    {applications.map((app, index) => (
      <Card key={index}>
        <CardHeader>
          <CardTitle>{app.company_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Position: {app.position}</p>
          <p>Date: {app.application_date}</p>
          <p>Status: {app.status}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

const TableView = ({
  applications,
  onUpdateStatus,
  currentPage,
  itemsPerPage,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = applications.slice(startIndex, endIndex);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedApplications.map((app, index) => (
          <TableRow key={index}>
            <TableCell>{app.company_name}</TableCell>
            <TableCell>{app.position}</TableCell>
            <TableCell>{app.application_date}</TableCell>
            <TableCell>
              <Select
                value={app.status}
                onValueChange={(value) => onUpdateStatus(index, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function App() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("application_date");
  const [isTimelineView, setIsTimelineView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const addApplication = (newApplication) => {
    setApplications([...applications, newApplication]);
  };

  const updateStatus = (index, newStatus) => {
    const updatedApplications = [...applications];
    updatedApplications[index].status = newStatus;
    setApplications(updatedApplications);
  };

  const filteredApplications = applications
    .filter((app) => filter === "all" || app.status === filter)
    .filter((app) =>
      app.company_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedApplications = [...filteredApplications].sort((a, b) =>
    a[sortBy].localeCompare(b[sortBy])
  );

  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Application Tracker</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Application</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Job Application</DialogTitle>
            </DialogHeader>
            <JobApplicationForm onSubmit={addApplication} />
          </DialogContent>
        </Dialog>
        <Input
          placeholder="Search by Company Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[200px]"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="application_date">Application Date</SelectItem>
            <SelectItem value="company_name">Company Name</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setIsTimelineView(!isTimelineView)}>
          {isTimelineView ? "Switch to Table View" : "Switch to Timeline View"}
        </Button>
      </div>
      {isTimelineView ? (
        <TimelineView applications={sortedApplications} />
      ) : (
        <>
          <TableView
            applications={sortedApplications}
            onUpdateStatus={updateStatus}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
          <div className="mt-4 flex justify-between">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
