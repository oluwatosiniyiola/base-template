import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "default.jpg",
    activityLog: [
      "Logged in at 10:30 AM",
      "Updated profile at 10:35 AM",
      "Changed settings at 10:40 AM",
    ],
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleProfileUpdate = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const Sidebar = ({ isMobile }) => {
    const items = ["Dashboard", "Settings", "Profile", "Logout"];
    return (
      <div
        className={`bg-slate-100 dark:bg-slate-800 p-4 ${
          isMobile ? "w-full" : "w-64 min-h-screen"
        }`}
      >
        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Navigate</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items.map((item) => (
                <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <nav>
            {items.map((item) => (
              <div key={item} className="mb-2">
                {item}
              </div>
            ))}
          </nav>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar isMobile={true} />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl">Welcome back, {user.name}</h1>
          <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-4"
            />
            <div>
              <p>{user.name}</p>
              <p>{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={user.name}
                onChange={(e) => handleProfileUpdate("name", e.target.value)}
              />
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => handleProfileUpdate("email", e.target.value)}
              />
              <Label>Profile Picture</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleProfileUpdate(
                    "profilePicture",
                    URL.createObjectURL(e.target.files[0])
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {user.activityLog.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
