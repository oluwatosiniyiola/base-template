import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@/components/ui";
import { Check, Edit, Trash2 } from "lucide-react";

const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
};

const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  const re = /^\(\d{3}\)\s\d{3}-\d{4}$/;
  return re.test(phone);
};

function ContactForm({
  onSubmit,
  initialValues = { name: "", phone: "", email: "", address: "" },
  isEditing = false,
}) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.phone) newErrors.phone = "Phone is required";
    else if (!validatePhone(form.phone))
      newErrors.phone = "Invalid phone format";
    if (!form.email) newErrors.email = "Email is required";
    else if (!validateEmail(form.email))
      newErrors.email = "Invalid email format";
    if (!form.address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
      setForm(initialValues);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Contact" : "Add New Contact"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">{isEditing ? "Update" : "Add"}</Button>
        </CardFooter>
      </Card>
    </form>
  );
}

function ContactList({ contacts, onEdit, onDelete }) {
  const groupedContacts = groupBy(contacts, "name");

  return (
    <div className="mt-4 space-y-4">
      {Object.keys(groupedContacts)
        .sort()
        .map((letter) => (
          <Card key={letter}>
            <CardHeader>
              <CardTitle>{letter}</CardTitle>
            </CardHeader>
            <CardContent>
              {groupedContacts[letter].map((contact) => (
                <div
                  key={contact.id}
                  className="flex justify-between items-center mb-2"
                >
                  <div>
                    <p>{contact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.phone}
                    </p>
                  </div>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(contact)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(contact)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    const savedContacts = JSON.parse(localStorage.getItem("contacts") || "[]");
    setContacts(savedContacts);
  }, []);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = (contact) => {
    setContacts((prev) => [...prev, { ...contact, id: Date.now() }]);
  };

  const handleEditContact = (updatedContact) => {
    setContacts(
      contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );
    setEditingContact(null);
  };

  const confirmDelete = (contact) => {
    setContactToDelete(contact);
    setShowDialog(true);
  };

  const handleDelete = () => {
    setContacts(contacts.filter((c) => c.id !== contactToDelete.id));
    setShowDialog(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {editingContact ? (
            <ContactForm
              onSubmit={handleEditContact}
              initialValues={editingContact}
              isEditing={true}
            />
          ) : (
            <ContactForm onSubmit={handleAddContact} />
          )}
        </div>
        <div className="sm:col-span-1">
          <ContactList
            contacts={contacts}
            onEdit={setEditingContact}
            onDelete={confirmDelete}
          />
        </div>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
