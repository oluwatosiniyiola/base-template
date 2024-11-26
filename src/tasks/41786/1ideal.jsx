import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ContactForm = ({ addContact }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      setError("All fields are required");
      return;
    }
    addContact({ name, phone, email });
    setName("");
    setPhone("");
    setEmail("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="123-456-7890"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">Add Contact</Button>
    </form>
  );
};

const ContactItem = ({ contact, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{contact.name}</h3>
            <p className="text-sm text-gray-600">{contact.phone}</p>
            <p className="text-sm text-gray-600">{contact.email}</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete this contact?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(contact);
                    setIsOpen(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

const ContactGroup = ({ letter, contacts, onDelete }) => {
  return (
    <AccordionItem value={letter}>
      <AccordionTrigger>{letter}</AccordionTrigger>
      <AccordionContent>
        {contacts.map((contact) => (
          <ContactItem
            key={contact.email}
            contact={contact}
            onDelete={onDelete}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const storedContacts = localStorage.getItem("contacts");
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (newContact) => {
    setContacts(
      [...contacts, newContact].sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  const deleteContact = (contactToDelete) => {
    setContacts(contacts.filter((c) => c.email !== contactToDelete.email));
  };

  const groupedContacts = contacts.reduce((acc, contact) => {
    const letter = contact.name[0].toUpperCase();
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(contact);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactForm addContact={addContact} />
          <Accordion type="single" collapsible className="mt-6">
            {Object.entries(groupedContacts)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, contacts]) => (
                <ContactGroup
                  key={letter}
                  letter={letter}
                  contacts={contacts}
                  onDelete={deleteContact}
                />
              ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
