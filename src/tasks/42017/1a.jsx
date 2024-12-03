import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Switch,
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Profile", href: "#profile" },
  { name: "Settings", href: "#settings" },
];

function Sidebar() {
  return (
    <aside className="bg-gray-100 dark:bg-gray-800 p-4 space-y-2">
      {NAV_LINKS.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {link.name}
        </a>
      ))}
    </aside>
  );
}

function Post({ content, timestamp }) {
  const [likes, setLikes] = useState(0);
  return (
    <Card className="mb-4">
      <CardHeader>
        <Avatar className="mr-2" alt="User avatar" />
        <CardTitle>User Name</CardTitle>
        <CardDescription>{timestamp}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => setLikes(likes + 1)}>Like ({likes})</Button>
      </CardFooter>
    </Card>
  );
}

function Feed() {
  return (
    <div className="p-4">
      <Post content="This is my first post!" timestamp="2 hours ago" />
      <Post
        content="Loving this new dashboard feature."
        timestamp="Yesterday"
      />
    </div>
  );
}

function Profile() {
  const [bio, setBio] = useState("Web Developer | Tech Enthusiast");
  const [socialLinks, setSocialLinks] = useState({ twitter: "", github: "" });

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Profile Picture URL" className="mb-2" />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Your Bio"
            className="w-full p-2 mb-2 border rounded"
          />
          <Input
            value={socialLinks.twitter}
            onChange={(e) =>
              setSocialLinks({ ...socialLinks, twitter: e.target.value })
            }
            placeholder="Twitter Handle"
            className="mb-2"
          />
          <Input
            value={socialLinks.github}
            onChange={(e) =>
              setSocialLinks({ ...socialLinks, github: e.target.value })
            }
            placeholder="GitHub Username"
          />
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);

  return (
    <div className="p-4">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span>Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between">
            <span>Private Account</span>
            <Switch checked={privateMode} onCheckedChange={setPrivateMode} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const PageContent = {
    home: <Feed />,
    profile: <Profile />,
    settings: <Settings />,
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar />
      <main className="flex-grow">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="m-4">
              Navigate
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {NAV_LINKS.map((link) => (
              <DropdownMenuItem
                key={link.name}
                onClick={() => setCurrentPage(link.name.toLowerCase())}
              >
                {link.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {PageContent[currentPage]}
      </main>
    </div>
  );
}
