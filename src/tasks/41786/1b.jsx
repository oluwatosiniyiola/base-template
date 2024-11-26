import React, { useState, useMemo } from "react";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const groupedContacts = useMemo(() => {
    return contacts.reduce((acc, contact) => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(contact);
      return acc;
    }, {});
  }, [contacts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: !value }));
  };

  const validateForm = () => {
    let errors = {};
    if (!newContact.name) errors.name = true;
    if (!newContact.phone) errors.phone = true;
    if (!newContact.email) errors.email = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addContact = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setContacts([...contacts, { ...newContact, id: Date.now() }]);
      setNewContact({ name: "", phone: "", email: "" });
      setFormErrors({});
    }
  };

  const deleteContact = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setContacts(contacts.filter((contact) => contact.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addContact}>
            <div className="grid gap-4 mb-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newContact.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newContact.phone}
                  onChange={handleInputChange}
                  className={formErrors.phone ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={newContact.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? "border-red-500" : ""}
                />
              </div>
            </div>
            <Button type="submit">Add Contact</Button>
          </form>
        </CardContent>
      </Card>

      {Object.entries(groupedContacts).map(([letter, groupContacts]) => (
        <ContactGroup
          key={letter}
          letter={letter}
          contacts={groupContacts}
          onDelete={deleteContact}
        />
      ))}
    </div>
  );
}

function ContactGroup({ letter, contacts, onDelete }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="mb-4">
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <CardTitle>{letter}</CardTitle>
        <Checkbox checked={isOpen} readOnly className="ml-2" />
      </CardHeader>
      {isOpen && (
        <CardContent>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex justify-between items-center mb-2"
            >
              <div>
                <div>{contact.name}</div>
                <div className="text-sm text-muted-foreground">
                  {contact.phone}
                </div>
                <div className="text-sm text-muted-foreground">
                  {contact.email}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(contact.id)}
              >
                Delete
              </Button>
            </div>
          ))}
          <Separator className="my-2" />
        </CardContent>
      )}
    </Card>
  );
}

export default function App() {
  return <ContactList />;
}
