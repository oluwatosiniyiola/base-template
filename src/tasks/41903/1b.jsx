import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  RadioGroup,
  Radio,
} from "@/components/ui";
import { format } from "date-fns";

// Utility function to simulate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

function JobApplicationForm({ onSubmit, onClose, initialData = {} }) {
  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
  const [formData, setFormData] = useState({
    company_name: initialData.company_name || "",
    position: initialData.position || "",
    application_date:
      initialData.application_date || format(new Date(), "yyyy-MM-dd"),
    status: initialData.status || "applied",
    salary: initialData.salary || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, id: initialData.id || generateId() });
    closeModal();
    setFormData({
      company_name: "",
      position: "",
      application_date: format(new Date(), "yyyy-MM-dd"),
      status: "applied",
      salary: "",
    });
  };

  return (
    <>
      <Button onClick={onOpen}>Add New Application</Button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="space-y-1">
              <ModalTitle>
                {initialData.id
                  ? "Edit Job Application"
                  : "New Job Application"}
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Input
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                placeholder="Company Name"
                required
              />
              <Input
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                placeholder="Position"
                required
              />
              <Input
                type="date"
                value={formData.application_date}
                onChange={(e) =>
                  setFormData({ ...formData, application_date: e.target.value })
                }
                required
              />
              <RadioGroup
                value={formData.status}
                onValueChange={(status) => setFormData({ ...formData, status })}
              >
                {["applied", "interviewing", "rejected", "offer"].map((s) => (
                  <Radio key={s} value={s}>
                    {s}
                  </Radio>
                ))}
              </RadioGroup>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                placeholder="Salary (optional)"
              />
            </ModalBody>
            <ModalFooter>
              <Button type="submit">Save</Button>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

function JobApplicationsTable({ applications, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Company
            </th>
            <th scope="col" className="px-6 py-3">
              Position
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Salary
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="bg-white border-b">
              <td className="px-6 py-4">{app.company_name}</td>
              <td className="px-6 py-4">{app.position}</td>
              <td className="px-6 py-4">{app.application_date}</td>
              <td className="px-6 py-4">{app.status}</td>
              <td className="px-6 py-4">{app.salary || "N/A"}</td>
              <td className="px-6 py-4">
                <Button onClick={() => onEdit(app)}>Edit</Button>
                <Button onClick={() => onDelete(app.id)} variant="destructive">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [applications, setApplications] = useState([]);
  const [view, setView] = useState("table");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("application_date");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Sorting function
  const sortedApplications = [...applications].sort((a, b) => {
    if (sortBy === "salary" && (a.salary === "" || b.salary === "")) return 0; // Handle empty salaries
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });

  // Filtering function
  const filteredApplications = sortedApplications.filter((app) => {
    if (filter !== "all" && app.status !== filter) return false;
    if (
      search &&
      !app.company_name.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const addOrEditApplication = (app) => {
    if (applications.some((a) => a.id === app.id)) {
      setApplications(applications.map((a) => (a.id === app.id ? app : a)));
    } else {
      setApplications((prev) => [app, ...prev]);
    }
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <JobApplicationForm onSubmit={addOrEditApplication} />
        <Input
          type="search"
          placeholder="Search by company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 sm:mt-0"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["all", "applied", "interviewing", "rejected", "offer"].map(
              (status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Sort By</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["application_date", "company_name", "salary"].map((field) => (
              <DropdownMenuItem key={field} onClick={() => setSortBy(field)}>
                {field.replace("_", " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={() => setView(view === "table" ? "timeline" : "table")}
        >
          Switch to {view === "table" ? "Timeline" : "Table"}
        </Button>
      </div>

      {view === "table" ? (
        <>
          <JobApplicationsTable
            applications={currentItems}
            onEdit={(app) => addOrEditApplication(app)}
            onDelete={deleteApplication}
          />
          <div className="mt-4 flex justify-between">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span>Page {currentPage}</span>
            <Button
              disabled={indexOfLastItem >= filteredApplications.length}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {currentItems.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <CardTitle>
                  {app.company_name} - {app.position}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Applied on: {app.application_date}</p>
                <p>Status: {app.status}</p>
                {app.salary && <p>Salary: ${app.salary}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
