import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialEvents = [
  {
    id: 1,
    name: "Summer Concert",
    date: "2023-07-15",
    location: "Central Park",
    rsvps: 0,
  },
  {
    id: 2,
    name: "Tech Conference",
    date: "2023-08-20",
    location: "Convention Center",
    rsvps: 0,
  },
  {
    id: 3,
    name: "Food Festival",
    date: "2023-09-10",
    location: "Downtown Square",
    rsvps: 0,
  },
];

function RSVPForm({ eventId, onRSVP }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendees, setAttendees] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRSVP(eventId, { name, email, attendees: parseInt(attendees) });
    setName("");
    setEmail("");
    setAttendees(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="attendees">Number of Attendees</Label>
        <Input
          id="attendees"
          type="number"
          min="1"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Confirm RSVP</Button>
    </form>
  );
}

function EventCard({ event, onRSVP }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>
          {event.date} at {event.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Total RSVPs: {event.rsvps}</p>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button>RSVP</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>RSVP for {event.name}</DialogTitle>
            </DialogHeader>
            <RSVPForm eventId={event.id} onRSVP={onRSVP} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

function UserRSVPs({ rsvps, onEdit, onCancel }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your RSVPs</CardTitle>
      </CardHeader>
      <CardContent>
        {rsvps.map((rsvp) => (
          <div key={rsvp.eventId} className="mb-4 p-4 border rounded">
            <h3 className="font-bold">{rsvp.eventName}</h3>
            <p>Attendees: {rsvp.attendees}</p>
            <div className="mt-2">
              <Button onClick={() => onEdit(rsvp)} className="mr-2">
                Edit
              </Button>
              <Button
                onClick={() => onCancel(rsvp.eventId)}
                variant="destructive"
              >
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [events, setEvents] = useState(initialEvents);
  const [userRSVPs, setUserRSVPs] = useState([]);

  const handleRSVP = (eventId, rsvpData) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, rsvps: event.rsvps + rsvpData.attendees }
          : event
      )
    );
    setUserRSVPs((prevRSVPs) => [
      ...prevRSVPs,
      {
        ...rsvpData,
        eventId,
        eventName: events.find((e) => e.id === eventId).name,
      },
    ]);
  };

  const handleEditRSVP = (rsvp) => {
    // For simplicity, we'll just remove the old RSVP and open the form to create a new one
    handleCancelRSVP(rsvp.eventId);
  };

  const handleCancelRSVP = (eventId) => {
    const rsvp = userRSVPs.find((r) => r.eventId === eventId);
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, rsvps: event.rsvps - rsvp.attendees }
          : event
      )
    );
    setUserRSVPs((prevRSVPs) => prevRSVPs.filter((r) => r.eventId !== eventId));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Event RSVP Tracker</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          {events.map((event) => (
            <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your RSVPs</h2>
          <UserRSVPs
            rsvps={userRSVPs}
            onEdit={handleEditRSVP}
            onCancel={handleCancelRSVP}
          />
        </div>
      </div>
    </div>
  );
}
