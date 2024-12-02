import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";

const countries = [
  { name: "USA", states: ["California", "Texas", "Florida"] },
  { name: "Canada", states: ["Ontario", "Quebec", "British Columbia"] },
  { name: "UK", states: ["England", "Scotland", "Wales"] },
];

function App() {
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
  const [errors, setErrors] = useState({});

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const validate = () => {
    let tempErrors = {};
    if (step === 1) {
      tempErrors = {
        name: !formData.name ? "Name is required" : "",
        email: !/\S+@\S+\.\S+/.test(formData.email) ? "Email is invalid" : "",
        password:
          formData.password.length < 8
            ? "Password must be at least 8 characters"
            : "",
      };
    } else if (step === 2) {
      tempErrors = {
        country: !formData.country ? "Country is required" : "",
        state: !formData.state ? "State is required" : "",
        address: !formData.address ? "Address is required" : "",
        postalCode: !formData.postalCode ? "Postal Code is required" : "",
      };
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (step === 3) {
        alert("Registration successful!");
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
      } else {
        nextStep();
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const ProgressBar = ({ step }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${(step - 1) * 50}%` }}
      ></div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>User Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar step={step} />
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className="mb-4">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="mb-4">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  >
                    <SelectItem value="">Select a country</SelectItem>
                    {countries.map((country, idx) => (
                      <SelectItem key={idx} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="state">State</Label>
                  <Select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1"
                    required
                    disabled={!formData.country}
                  >
                    <SelectItem value="">Select a state</SelectItem>
                    {formData.country &&
                      countries
                        .find((c) => c.name === formData.country)
                        ?.states.map((state, idx) => (
                          <SelectItem key={idx} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                  </Select>
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </>
            )}
            {step === 3 && (
              <div>
                <h3 className="font-bold mb-2">Review Your Information:</h3>
                {Object.entries(formData).map(([key, value]) => (
                  <p key={key}>
                    <strong>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </strong>{" "}
                    {value}
                  </p>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-between">
              {step > 1 && (
                <Button type="button" onClick={prevStep} variant="outline">
                  Back
                </Button>
              )}
              <Button type="submit">{step === 3 ? "Submit" : "Next"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
