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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

function App() {
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

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePhone = (phone) => {
    return /^\d{3}-\d{3}-\d{4}$/.test(phone);
  };

  const validateForm = () => {
    switch (step) {
      case 1:
        return (
          formData.name &&
          validateEmail(formData.email) &&
          validatePhone(formData.phone)
        );
      case 2:
        return (
          formData.username &&
          formData.password &&
          formData.password === formData.confirmPassword
        );
      case 3:
        return formData.plan !== "";
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfo onChange={handleChange} values={formData} />;
      case 2:
        return <Credentials onChange={handleChange} values={formData} />;
      case 3:
        return <PlanSelection onChange={handleChange} values={formData} />;
      case 4:
        return (
          <Review
            formData={formData}
            onSubmit={() => alert("Registration Complete!")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <Card className="w-full max-w-md p-4 sm:p-6">
        <CardHeader>
          <CardTitle>Registration - Step {step} of 4</CardTitle>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={step === 1}>
            Previous
          </Button>
          <Button onClick={nextStep} disabled={!validateForm()}>
            {step === 4 ? "Submit" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function PersonalInfo({ onChange, values }) {
  return (
    <div>
      <Input
        type="text"
        name="name"
        placeholder="Name"
        onChange={onChange}
        value={values.name}
        required
      />
      <Input
        type="email"
        name="email"
        placeholder="Email"
        onChange={onChange}
        value={values.email}
        className="mt-2"
        required
      />
      <Input
        type="tel"
        name="phone"
        placeholder="Phone (XXX-XXX-XXXX)"
        onChange={onChange}
        value={values.phone}
        className="mt-2"
        required
      />
    </div>
  );
}

function Credentials({ onChange, values }) {
  return (
    <div>
      <Input
        type="text"
        name="username"
        placeholder="Username"
        onChange={onChange}
        value={values.username}
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        onChange={onChange}
        value={values.password}
        className="mt-2"
        required
      />
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        onChange={onChange}
        value={values.confirmPassword}
        className="mt-2"
        required
      />
    </div>
  );
}

function PlanSelection({ onChange, values }) {
  return (
    <RadioGroup
      onValueChange={(value) => onChange({ target: { name: "plan", value } })}
      defaultValue={values.plan}
      className="space-y-2"
    >
      <RadioGroupItem value="free" id="free">
        Free
      </RadioGroupItem>
      <RadioGroupItem value="basic" id="basic">
        Basic - $5/month
      </RadioGroupItem>
      <RadioGroupItem value="premium" id="premium">
        Premium - $10/month
      </RadioGroupItem>
    </RadioGroup>
  );
}

function Review({ formData, onSubmit }) {
  return (
    <div>
      <p>Name: {formData.name}</p>
      <p>Email: {formData.email}</p>
      <p>Phone: {formData.phone}</p>
      <p>Username: {formData.username}</p>
      <p>Plan: {formData.plan}</p>
      <Checkbox className="mt-4">I agree to the terms and conditions</Checkbox>
      <Button onClick={onSubmit} className="mt-4 w-full">
        Confirm
      </Button>
    </div>
  );
}

export default App;
