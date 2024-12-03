import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

const Sidebar = ({ activeTab, setActiveTab }) => (
  <div className="w-64 bg-gray-100 dark:bg-gray-800 h-screen p-4">
    <nav>
      {["Home", "Profile", "Settings"].map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? "default" : "ghost"}
          className="w-full justify-start mb-2"
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </Button>
      ))}
    </nav>
  </div>
);

const Post = ({ user, content, timestamp }) => {
  const [liked, setLiked] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader className="flex items-center">
        <Avatar className="mr-2">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user}`}
          />
          <AvatarFallback>{user[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold">{user}</h3>
          <p className="text-sm text-gray-500">{timestamp}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" onClick={() => setLiked(!liked)}>
          {liked ? "❤️ Liked" : "🤍 Like"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Feed = () => {
  const posts = [
    {
      user: "Alice",
      content: "Just had a great day!",
      timestamp: "2 hours ago",
    },
    {
      user: "Bob",
      content: "Check out this cool photo!",
      timestamp: "4 hours ago",
    },
    {
      user: "Charlie",
      content: "Anyone up for a game night?",
      timestamp: "6 hours ago",
    },
  ];

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <Post key={index} {...post} />
      ))}
    </div>
  );
};

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    bio: "I love coding and building cool stuff!",
    twitter: "@johndoe",
    github: "johndoe",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Edit Profile</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <Input name="name" value={profile.name} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1">Bio</label>
            <Textarea name="bio" value={profile.bio} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1">Twitter</label>
            <Input
              name="twitter"
              value={profile.twitter}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1">GitHub</label>
            <Input
              name="github"
              value={profile.github}
              onChange={handleChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

const SettingsPage = ({ darkMode, setDarkMode }) => {
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showEmail: false,
  });

  const handlePrivacyChange = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting],
    });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Settings</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between">
            <span>Public Profile</span>
            <Switch
              checked={privacySettings.publicProfile}
              onCheckedChange={() => handlePrivacyChange("publicProfile")}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Show Email</span>
            <Switch
              checked={privacySettings.showEmail}
              onCheckedChange={() => handlePrivacyChange("showEmail")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`flex ${darkMode ? "dark" : ""}`}>
      <div className="hidden sm:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1 p-4 bg-white dark:bg-gray-900 min-h-screen">
        <div className="sm:hidden mb-4">
          <select
            className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {["Home", "Profile", "Settings"].map((tab) => (
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>
        </div>
        {activeTab === "Home" && <Feed />}
        {activeTab === "Profile" && <ProfilePage />}
        {activeTab === "Settings" && (
          <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />
        )}
      </div>
    </div>
  );
}
