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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const countries = [
  { name: "USA", states: ["California", "New York", "Texas"] },
  { name: "Canada", states: ["Ontario", "Quebec", "British Columbia"] },
  { name: "UK", states: ["England", "Scotland", "Wales"] },
];

const PersonalInfoStep = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
    </div>
    <div>
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
    </div>
    <div>
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        minLength={8}
      />
    </div>
  </div>
);

const AddressStep = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="country">Country</Label>
      <Select
        value={formData.country}
        onValueChange={(value) =>
          setFormData({ ...formData, country: value, state: "" })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.name} value={country.name}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    {formData.country && (
      <div>
        <Label htmlFor="state">State</Label>
        <Select
          value={formData.state}
          onValueChange={(value) => setFormData({ ...formData, state: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {countries
              .find((c) => c.name === formData.country)
              .states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    )}
    <div>
      <Label htmlFor="address">Address</Label>
      <Input
        id="address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        required
      />
    </div>
    <div>
      <Label htmlFor="postalCode">Postal Code</Label>
      <Input
        id="postalCode"
        value={formData.postalCode}
        onChange={(e) =>
          setFormData({ ...formData, postalCode: e.target.value })
        }
        required
      />
    </div>
  </div>
);

const ReviewStep = ({ formData }) => (
  <div className="space-y-4">
    <p>
      <strong>Name:</strong> {formData.name}
    </p>
    <p>
      <strong>Email:</strong> {formData.email}
    </p>
    <p>
      <strong>Country:</strong> {formData.country}
    </p>
    <p>
      <strong>State:</strong> {formData.state}
    </p>
    <p>
      <strong>Address:</strong> {formData.address}
    </p>
    <p>
      <strong>Postal Code:</strong> {formData.postalCode}
    </p>
  </div>
);

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    state: "",
    address: "",
    postalCode: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.password.length >= 8;
      case 2:
        return (
          formData.country &&
          formData.state &&
          formData.address &&
          formData.postalCode
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      setSubmitted(true);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: "",
      email: "",
      password: "",
      country: "",
      state: "",
      address: "",
      postalCode: "",
    });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Registration</CardTitle>
          <CardDescription>Complete the form to register</CardDescription>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <>
              <div className="mb-4 bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
              {step === 1 && (
                <PersonalInfoStep
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              {step === 2 && (
                <AddressStep formData={formData} setFormData={setFormData} />
              )}
              {step === 3 && <ReviewStep formData={formData} />}
            </>
          ) : (
            <Alert>
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your registration has been submitted.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!submitted ? (
            <>
              {step > 1 && (
                <Button onClick={() => setStep(step - 1)} variant="outline">
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit}>Submit</Button>
              )}
            </>
          ) : (
            <Button onClick={resetForm} className="w-full">
              Register Another User
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
