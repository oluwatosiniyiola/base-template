import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusOptions = ["applied", "interviewing", "rejected", "offer"];

const JobForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="company_name">Company Name</Label>
        <Input
          id="company_name"
          name="company_name"
          value={formData.company_name || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          name="position"
          value={formData.position || ""}
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
          value={formData.application_date || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          name="status"
          value={formData.status || ""}
          onValueChange={(value) =>
            handleChange({ target: { name: "status", value } })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="salary">Salary (optional)</Label>
        <Input
          id="salary"
          name="salary"
          type="number"
          value={formData.salary || ""}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

const JobCard = ({ job, onStatusChange }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{job.company_name}</CardTitle>
      <CardDescription>{job.position}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Application Date: {job.application_date}</p>
      <p>Status: {job.status}</p>
      {job.salary && <p>Salary: ${job.salary}</p>}
    </CardContent>
    <CardFooter>
      <Select
        value={job.status}
        onValueChange={(value) => onStatusChange(job.id, value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Change status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </CardFooter>
  </Card>
);

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState({ status: "", salaryRange: "" });
  const [sort, setSort] = useState("application_date");
  const [view, setView] = useState("timeline");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const addJob = (newJob) => {
    setJobs((prev) => [...prev, { ...newJob, id: Date.now() }]);
  };

  const updateJobStatus = (id, newStatus) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = !filter.status || job.status === filter.status;
    const matchesSalary =
      !filter.salaryRange ||
      (job.salary >= parseInt(filter.salaryRange.split("-")[0]) &&
        job.salary <= parseInt(filter.salaryRange.split("-")[1]));
    const matchesSearch = job.company_name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesStatus && matchesSalary && matchesSearch;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) =>
    a[sort] > b[sort] ? 1 : -1
  );

  const paginatedJobs = sortedJobs.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Job Application Tracker</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Job</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Job Application</DialogTitle>
              <DialogDescription>
                Enter the details of your new job application.
              </DialogDescription>
            </DialogHeader>
            <JobForm onSubmit={addJob} />
          </DialogContent>
        </Dialog>

        <Select
          value={filter.status}
          onValueChange={(value) => setFilter({ ...filter, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filter.salaryRange}
          onValueChange={(value) =>
            setFilter({ ...filter, salaryRange: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by salary" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All salaries</SelectItem>
            <SelectItem value="0-50000">$0 - $50,000</SelectItem>
            <SelectItem value="50001-100000">$50,001 - $100,000</SelectItem>
            <SelectItem value="100001-150000">$100,001 - $150,000</SelectItem>
            <SelectItem value="150001-1000000">$150,001+</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="application_date">Application Date</SelectItem>
            <SelectItem value="company_name">Company Name</SelectItem>
            <SelectItem value="salary">Salary</SelectItem>
          </SelectContent>
        </Select>

        <Select value={view} onValueChange={setView}>
          <SelectTrigger>
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="timeline">Timeline</SelectItem>
            <SelectItem value="table">Table</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by company name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto"
        />
      </div>

      {view === "timeline" ? (
        <div className="space-y-4">
          {paginatedJobs.map((job) => (
            <JobCard key={job.id} job={job} onStatusChange={updateJobStatus} />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Salary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.company_name}</TableCell>
                <TableCell>{job.position}</TableCell>
                <TableCell>{job.application_date}</TableCell>
                <TableCell>
                  <Select
                    value={job.status}
                    onValueChange={(value) => updateJobStatus(job.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{job.salary ? `$${job.salary}` : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-4 flex justify-between">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage}</span>
        <Button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(filteredJobs.length / 5))
            )
          }
          disabled={currentPage === Math.ceil(filteredJobs.length / 5)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
