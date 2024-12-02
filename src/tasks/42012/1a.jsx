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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const initialContacts = [
  {
    id: 1,
    name: "Alice Smith",
    phone: "(123) 456-7890",
    email: "alice@example.com",
    address: "123 Main St",
  },
  {
    id: 2,
    name: "Bob Johnson",
    phone: "(234) 567-8901",
    email: "bob@example.com",
    address: "456 Elm St",
  },
  {
    id: 3,
    name: "Charlie Brown",
    phone: "(345) 678-9012",
    email: "charlie@example.com",
    address: "789 Oak St",
  },
];

export default function App() {
  const [contacts, setContacts] = useState(initialContacts);
  const [groupedContacts, setGroupedContacts] = useState({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    groupContacts();
  }, [contacts]);

  const groupContacts = () => {
    const grouped = contacts.reduce((acc, contact) => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(contact);
      return acc;
    }, {});
    setGroupedContacts(grouped);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone))
      errors.phone = "Invalid phone format. Use (XXX) XXX-XXXX";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email format";
    if (!formData.address.trim()) errors.address = "Address is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (currentContact) {
        setContacts(
          contacts.map((c) =>
            c.id === currentContact.id ? { ...formData, id: c.id } : c
          )
        );
        setIsEditDialogOpen(false);
      } else {
        setContacts([...contacts, { ...formData, id: Date.now() }]);
        setIsAddDialogOpen(false);
      }
      setFormData({ name: "", phone: "", email: "", address: "" });
    }
  };

  const handleEdit = (contact) => {
    setCurrentContact(contact);
    setFormData(contact);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (contact) => {
    setCurrentContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setContacts(contacts.filter((c) => c.id !== currentContact.id));
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contact Management</h1>
      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
        Add Contact
      </Button>

      <Accordion type="single" collapsible className="w-full">
        {Object.entries(groupedContacts).map(([letter, groupContacts]) => (
          <AccordionItem value={letter} key={letter}>
            <AccordionTrigger>{letter}</AccordionTrigger>
            <AccordionContent>
              {groupContacts.map((contact) => (
                <Card key={contact.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>{contact.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Phone: {contact.phone}</p>
                    <p>Email: {contact.email}</p>
                    <p>Address: {contact.address}</p>
                    <div className="mt-2">
                      <Button
                        onClick={() => handleEdit(contact)}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(contact)}
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentContact ? "Edit Contact" : "Add Contact"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
                {formErrors.name && (
                  <p className="text-red-500 col-span-4">{formErrors.name}</p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
                {formErrors.phone && (
                  <p className="text-red-500 col-span-4">{formErrors.phone}</p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
                {formErrors.email && (
                  <p className="text-red-500 col-span-4">{formErrors.email}</p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
                {formErrors.address && (
                  <p className="text-red-500 col-span-4">
                    {formErrors.address}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this contact?</p>
          <DialogFooter>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
