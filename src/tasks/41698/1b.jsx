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
import { useForm } from "react-hook-form";

// Mock data for events
const mockEvents = [
  { id: 1, name: "Tech Conference", date: "2023-12-01", location: "Tech Park" },
  {
    id: 2,
    name: "Music Festival",
    date: "2023-12-15",
    location: "Downtown Square",
  },
];

function EventList({ events, onRsvp }) {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onRsvp={onRsvp} />
      ))}
    </div>
  );
}

function EventCard({ event, onRsvp }) {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    onRsvp({ ...data, eventId: event.id });
    setIsOpen(false);
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>
          {event.date} at {event.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsOpen(!isOpen)}>RSVP</Button>
        {isOpen && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name", { required: true })} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="attendees">Attendees</Label>
              <Input
                id="attendees"
                type="number"
                {...register("attendees", { min: 1 })}
              />
            </div>
            <Button type="submit">Confirm RSVP</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function RSVPList({ rsvps, onEdit, onCancel }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl mb-4">Your RSVPs</h2>
      {rsvps.map((rsvp) => (
        <Card key={rsvp.eventId} className="mb-2">
          <CardContent>
            <p>
              {rsvp.name} - {rsvp.email}
            </p>
            <p>Attendees: {rsvp.attendees}</p>
            <Button onClick={() => onEdit(rsvp)} className="mr-2">
              Edit
            </Button>
            <Button
              onClick={() => onCancel(rsvp.eventId)}
              variant="destructive"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [events, setEvents] = useState(mockEvents);
  const [rsvps, setRsvps] = useState([]);

  const handleRsvp = (rsvpData) => {
    setRsvps((prev) => [...prev, rsvpData]);
    // Here you would typically send this data to a server
  };

  const handleEdit = (rsvp) => {
    // Placeholder for edit functionality
    console.log("Edit RSVP:", rsvp);
  };

  const handleCancel = (eventId) => {
    setRsvps((prev) => prev.filter((rsvp) => rsvp.eventId !== eventId));
  };

  useEffect(() => {
    // Update event counts (this would be done server-side in a real app)
    const updatedEvents = events.map((event) => ({
      ...event,
      rsvpCount: rsvps.filter((r) => r.eventId === event.id).length,
    }));
    setEvents(updatedEvents);
  }, [rsvps]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Event RSVP Tracker</h1>
        <EventList events={events} onRsvp={handleRsvp} />
        <RSVPList rsvps={rsvps} onEdit={handleEdit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
