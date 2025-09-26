'use client';

import { useState, useEffect } from 'react';
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '@/lib/api';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAdminUser(selectedUser.id);
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      setIsDeleteAlertOpen(false);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        await updateAdminUser(formData.id, formData);
        toast({
          title: "Success",
          description: "User updated successfully.",
        });
      } else {
        await createAdminUser(formData);
        toast({
          title: "Success",
          description: "User created successfully.",
        });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user.",
        variant: "destructive",
      });
    }
  };

  const handleCreate = () => {
    setSelectedUser({});
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={handleCreate}>Create User</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.user_username}</TableCell>
              <TableCell>{user.user_fullname}</TableCell>
              <TableCell>{user.user_email}</TableCell>
              <TableCell>{user.user_level}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(user)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(user)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UserForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={selectedUser}
        onSave={handleSave}
      />

      {/* Delete Confirmation Alert */}
      <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAlertOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserForm({ open, onOpenChange, user, onSave }) {
  const [formData, setFormData] = useState({ ...user });

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formData.id ? 'Edit User' : 'Create User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="user_username">Username</Label>
            <Input id="user_username" name="user_username" value={formData.user_username || ''} onChange={handleChange} />
          </div>
          {!formData.id && (
            <div>
              <Label htmlFor="user_password">Password</Label>
              <Input id="user_password" name="user_password" type="password" value={formData.user_password || ''} onChange={handleChange} />
            </div>
          )}
          <div>
            <Label htmlFor="user_fullname">Full Name</Label>
            <Input id="user_fullname" name="user_fullname" value={formData.user_fullname || ''} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="user_email">Email</Label>
            <Input id="user_email" name="user_email" type="email" value={formData.user_email || ''} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="user_level">Level</Label>
            <Select name="user_level" value={formData.user_level || 'Pengguna'} onValueChange={(value) => setFormData(prev => ({ ...prev, user_level: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Pengguna">Pengguna</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
