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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="flex justify-center mb-4">
      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={`w-4 h-4 rounded-full mx-1 ${
            step <= currentStep ? "bg-blue-500" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const PersonalInfoCard = ({ formData, setFormData, errors }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Please enter your details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CredentialsCard = ({ formData, setFormData, errors }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login Credentials</CardTitle>
        <CardDescription>Create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="mt-1"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SubscriptionCard = ({ formData, setFormData, errors }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>Choose your plan</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={formData.plan}
          onValueChange={(value) => setFormData({ ...formData, plan: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free">Free ($0/month)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="basic" id="basic" />
            <Label htmlFor="basic">Basic ($9.99/month)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="premium" id="premium" />
            <Label htmlFor="premium">Premium ($19.99/month)</Label>
          </div>
        </RadioGroup>
        {errors.plan && (
          <p className="text-red-500 text-sm mt-1">{errors.plan}</p>
        )}
      </CardContent>
    </Card>
  );
};

const SummaryCard = ({ formData }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Registration Summary</CardTitle>
        <CardDescription>Please review your information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {formData.name}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Phone:</strong> {formData.phone}
          </p>
          <p>
            <strong>Username:</strong> {formData.username}
          </p>
          <p>
            <strong>Subscription Plan:</strong> {formData.plan}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    plan: "",
  });
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.phone.match(/^\d{3}-\d{3}-\d{4}$/)) {
        newErrors.phone = "Invalid phone format (XXX-XXX-XXXX)";
      }
    } else if (step === 2) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.password = "Passwords do not match";
      }
    } else if (step === 3) {
      if (!formData.plan) {
        newErrors.plan = "Please select a subscription plan";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (validateStep()) {
      console.log("Form submitted:", formData);
      // Here you would typically send the data to your backend
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <StepIndicator currentStep={step} />
        {step === 1 && (
          <PersonalInfoCard
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}
        {step === 2 && (
          <CredentialsCard
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}
        {step === 3 && (
          <SubscriptionCard
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}
        {step === 4 && <SummaryCard formData={formData} />}
        <CardFooter className="flex justify-between mt-4">
          {step > 1 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="text-black border-gray-300"
            >
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Confirm Registration</Button>
          )}
        </CardFooter>
      </div>
    </div>
  );
}
