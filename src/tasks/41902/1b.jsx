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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    job_title: "",
    department: "",
    date_of_joining: "",
    salary: "",
    profile_picture: null,
    resume: null,
    bank_accounts: [{ account_number: "", bank_name: "" }],
  });
  const [errors, setErrors] = useState({});

  const steps = [
    "Personal Information",
    "Job Details",
    "Document Upload",
    "Review & Submit",
  ];

  const validateStep = () => {
    let newErrors = {};
    switch (step) {
      case 1:
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Valid email is required";
        if (!formData.phone_number || formData.phone_number.length !== 10)
          newErrors.phone_number = "10-digit phone number is required";
        break;
      case 2:
        if (!formData.job_title) newErrors.job_title = "Job title is required";
        if (!formData.salary || isNaN(formData.salary))
          newErrors.salary = "Salary must be a number";
        break;
      case 3:
        if (!formData.profile_picture)
          newErrors.profile_picture = "Profile picture is required";
        if (!formData.resume) newErrors.resume = "Resume is required";
        break;
      // Add more cases for other steps if needed
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (
      file &&
      ((type === "profile_picture" && file.type.startsWith("image/")) ||
        (type === "resume" && file.type === "application/pdf"))
    ) {
      setFormData((prev) => ({ ...prev, [type]: file }));
    } else {
      setErrors((prev) => ({ ...prev, [type]: "Invalid file type" }));
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      if (step < steps.length) {
        setStep(step + 1);
      } else {
        alert("Form submitted successfully!");
        // Here you would typically send data to a server
      }
    }
  };

  const addBankAccount = () => {
    setFormData((prev) => ({
      ...prev,
      bank_accounts: [
        ...prev.bank_accounts,
        { account_number: "", bank_name: "" },
      ],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Progress value={(step / steps.length) * 100} className="mb-4" />
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{steps[step - 1]}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <PersonalInfo
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          )}
          {step === 2 && (
            <JobDetails
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          )}
          {step === 3 && (
            <DocumentUpload
              formData={formData}
              handleFileChange={handleFileChange}
              errors={errors}
            />
          )}
          {step === 4 && <Review formData={formData} />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          {step < steps.length ? (
            <Button onClick={handleSubmit}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function PersonalInfo({ formData, handleChange, errors }) {
  return (
    <div>
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="mb-2"
      />
      {errors.name && (
        <p className="text-red-500 text-xs italic">{errors.name}</p>
      )}
      {/* Similar fields for email, phone, address */}
    </div>
  );
}

function JobDetails({ formData, handleChange, errors }) {
  const showProbation = formData.salary && parseInt(formData.salary) < 30000;
  return (
    <div>
      <Label htmlFor="job_title">Job Title</Label>
      <Input
        id="job_title"
        name="job_title"
        value={formData.job_title}
        onChange={handleChange}
      />
      {errors.job_title && (
        <p className="text-red-500 text-xs italic">{errors.job_title}</p>
      )}
      {showProbation && <p>Probation period applicable</p>}
      {/* Other job details fields */}
      <div>
        <Button onClick={addBankAccount}>Add Bank Account</Button>
        {formData.bank_accounts.map((acc, idx) => (
          <div key={idx}>
            <Input
              placeholder="Account Number"
              name={`bank_accounts[${idx}].account_number`}
              onChange={handleChange}
            />
            <Input
              placeholder="Bank Name"
              name={`bank_accounts[${idx}].bank_name`}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentUpload({ formData, handleFileChange, errors }) {
  return (
    <div>
      <Label>Profile Picture</Label>
      <Input
        type="file"
        onChange={(e) => handleFileChange(e, "profile_picture")}
        accept="image/*"
      />
      {errors.profile_picture && (
        <p className="text-red-500 text-xs italic">{errors.profile_picture}</p>
      )}
      {/* Resume upload similar to profile picture */}
    </div>
  );
}

function Review({ formData }) {
  return (
    <div>
      {/* Display summary of formData */}
      <Button onClick={() => window.print()}>Print Preview</Button>
    </div>
  );
}

export default App;
