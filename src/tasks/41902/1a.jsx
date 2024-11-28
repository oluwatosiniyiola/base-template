import React, { useState } from "react";
import {
  Card,
  CardContent,
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
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Utility function for form validation
const validateField = (value, type) => {
  if (!value) return "This field is required";
  switch (type) {
    case "email":
      return /\S+@\S+\.\S+/.test(value) ? null : "Invalid email format";
    case "phone":
      return /^\d{10}$/.test(value) ? null : "Invalid phone number";
    case "date":
      return isNaN(Date.parse(value)) ? "Invalid date" : null;
    case "salary":
      return isNaN(value) || value <= 0 ? "Invalid salary" : null;
    default:
      return null;
  }
};

const PersonalInfo = ({ data, setData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setErrors({ ...errors, [name]: validateField(value, name) });
  };

  return (
    <div className="space-y-4">
      <Input
        name="name"
        placeholder="Full Name"
        value={data.name}
        onChange={handleChange}
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={handleChange}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      <Input
        name="phone"
        placeholder="Phone Number"
        value={data.phone}
        onChange={handleChange}
      />
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      <Input
        name="address"
        placeholder="Address"
        value={data.address}
        onChange={handleChange}
      />
      {errors.address && (
        <p className="text-red-500 text-sm">{errors.address}</p>
      )}
    </div>
  );
};

const JobDetails = ({ data, setData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setErrors({ ...errors, [name]: validateField(value, name) });
  };

  const handleSelectChange = (value, name) => {
    setData({ ...data, [name]: value });
    setErrors({ ...errors, [name]: validateField(value, name) });
  };

  return (
    <div className="space-y-4">
      <Input
        name="job_title"
        placeholder="Job Title"
        value={data.job_title}
        onChange={handleChange}
      />
      {errors.job_title && (
        <p className="text-red-500 text-sm">{errors.job_title}</p>
      )}
      <Select
        name="department"
        onValueChange={(value) => handleSelectChange(value, "department")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hr">Human Resources</SelectItem>
          <SelectItem value="it">Information Technology</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
        </SelectContent>
      </Select>
      {errors.department && (
        <p className="text-red-500 text-sm">{errors.department}</p>
      )}
      <Input
        name="date_of_joining"
        type="date"
        value={data.date_of_joining}
        onChange={handleChange}
      />
      {errors.date_of_joining && (
        <p className="text-red-500 text-sm">{errors.date_of_joining}</p>
      )}
      <Input
        name="salary"
        type="number"
        placeholder="Salary"
        value={data.salary}
        onChange={handleChange}
      />
      {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
      {data.salary && Number(data.salary) < 50000 && (
        <Input
          name="probation_period"
          type="number"
          placeholder="Probation Period (months)"
          value={data.probation_period}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

const DocumentUpload = ({ data, setData, errors, setErrors }) => {
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const validTypes =
        name === "profile_picture"
          ? ["image/jpeg", "image/png"]
          : ["application/pdf"];
      if (validTypes.includes(file.type)) {
        setData({ ...data, [name]: file });
        setErrors({ ...errors, [name]: null });
      } else {
        setErrors({ ...errors, [name]: "Invalid file type" });
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="profile_picture">Profile Picture (JPEG or PNG)</Label>
      <Input
        id="profile_picture"
        name="profile_picture"
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
      />
      {errors.profile_picture && (
        <p className="text-red-500 text-sm">{errors.profile_picture}</p>
      )}
      <Label htmlFor="resume">Resume (PDF)</Label>
      <Input
        id="resume"
        name="resume"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      {errors.resume && <p className="text-red-500 text-sm">{errors.resume}</p>}
    </div>
  );
};

const ReviewSubmit = ({ data }) => {
  const [bankAccounts, setBankAccounts] = useState([
    { bank_name: "", account_number: "" },
  ]);

  const addBankAccount = () => {
    setBankAccounts([...bankAccounts, { bank_name: "", account_number: "" }]);
  };

  const handleBankAccountChange = (index, field, value) => {
    const newBankAccounts = [...bankAccounts];
    newBankAccounts[index][field] = value;
    setBankAccounts(newBankAccounts);
  };

  const printPreview = () => {
    const printContent = `
      <h2>Employee Onboarding Summary</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>Job Title:</strong> ${data.job_title}</p>
      <p><strong>Department:</strong> ${data.department}</p>
      <p><strong>Date of Joining:</strong> ${data.date_of_joining}</p>
      <p><strong>Salary:</strong> ${data.salary}</p>
      ${
        data.probation_period
          ? `<p><strong>Probation Period:</strong> ${data.probation_period} months</p>`
          : ""
      }
      <h3>Bank Accounts:</h3>
      ${bankAccounts
        .map(
          (account, index) => `
        <p><strong>Account ${index + 1}:</strong></p>
        <p>Bank Name: ${account.bank_name}</p>
        <p>Account Number: ${account.account_number}</p>
      `
        )
        .join("")}
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Print Preview</title></head><body>"
    );
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Review Your Information</h3>
      <p>
        <strong>Name:</strong> {data.name}
      </p>
      <p>
        <strong>Email:</strong> {data.email}
      </p>
      <p>
        <strong>Phone:</strong> {data.phone}
      </p>
      <p>
        <strong>Address:</strong> {data.address}
      </p>
      <p>
        <strong>Job Title:</strong> {data.job_title}
      </p>
      <p>
        <strong>Department:</strong> {data.department}
      </p>
      <p>
        <strong>Date of Joining:</strong> {data.date_of_joining}
      </p>
      <p>
        <strong>Salary:</strong> {data.salary}
      </p>
      {data.probation_period && (
        <p>
          <strong>Probation Period:</strong> {data.probation_period} months
        </p>
      )}

      <h4 className="font-semibold mt-4">Bank Accounts</h4>
      {bankAccounts.map((account, index) => (
        <div key={index} className="space-y-2">
          <Input
            placeholder="Bank Name"
            value={account.bank_name}
            onChange={(e) =>
              handleBankAccountChange(index, "bank_name", e.target.value)
            }
          />
          <Input
            placeholder="Account Number"
            value={account.account_number}
            onChange={(e) =>
              handleBankAccountChange(index, "account_number", e.target.value)
            }
          />
        </div>
      ))}
      <Button onClick={addBankAccount}>Add Bank Account</Button>
      <Button onClick={printPreview}>Print Preview</Button>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    job_title: "",
    department: "",
    date_of_joining: "",
    salary: "",
    profile_picture: null,
    resume: null,
  });
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};
    const fieldsToValidate =
      {
        1: ["name", "email", "phone", "address"],
        2: ["job_title", "department", "date_of_joining", "salary"],
        3: ["profile_picture", "resume"],
      }[step] || [];

    fieldsToValidate.forEach((field) => {
      const error = validateField(data[field], field);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (validateStep()) {
      console.log("Form submitted:", data);
      // Here you would typically send the data to a server
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Employee Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={(step / 4) * 100} className="mb-4" />
          {step === 1 && (
            <PersonalInfo
              data={data}
              setData={setData}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {step === 2 && (
            <JobDetails
              data={data}
              setData={setData}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {step === 3 && (
            <DocumentUpload
              data={data}
              setData={setData}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {step === 4 && <ReviewSubmit data={data} />}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && <Button onClick={prevStep}>Previous</Button>}
          {step < 4 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Submit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Submission</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to submit the form?</p>
                <Button onClick={handleSubmit}>Confirm</Button>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
