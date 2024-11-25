import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Menu } from "@/components/ui/menu";

const Sidebar = ({ isOpen, toggleSidebar }) => (
  <div
    className={`${
      isOpen ? "block" : "hidden"
    } sm:block bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } sm:relative sm:translate-x-0 transition duration-200 ease-in-out`}
  >
    <nav>
      <a
        href="#"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
      >
        Dashboard
      </a>
      <a
        href="#"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
      >
        Settings
      </a>
      <a
        href="#"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
      >
        Profile
      </a>
      <a
        href="#"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
      >
        Logout
      </a>
    </nav>
  </div>
);

const UserProfile = ({ user }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>User Profile</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center space-x-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={user.profilePicture} alt={user.name} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>
    </CardContent>
  </Card>
);

const ActivityLog = ({ activities }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Activity Log</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {activities.map((activity, index) => (
          <li key={index} className="text-sm text-gray-600">
            {activity}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const Settings = ({ user, updateUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ name, email });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Display Name
            </label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="profile-picture"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture
            </label>
            <Input type="file" id="profile-picture" className="mt-1" />
          </div>
          <Button type="submit">Update Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    profilePicture: "https://via.placeholder.com/150",
  });
  const [activities] = useState([
    "Logged in - 2 hours ago",
    "Updated settings - 1 day ago",
    "Changed profile picture - 3 days ago",
  ]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const updateUser = (newUserData) => {
    setUser({ ...user, ...newUserData });
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkTheme ? "dark bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm dark:bg-gray-800">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
              <div className="flex items-center space-x-4">
                <Switch checked={isDarkTheme} onCheckedChange={toggleTheme} />
                <span>{isDarkTheme ? "Dark" : "Light"} Theme</span>
                <Button className="sm:hidden" onClick={toggleSidebar}>
                  Menu
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <UserProfile user={user} />
              <ActivityLog activities={activities} />
              <Settings user={user} updateUser={updateUser} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
