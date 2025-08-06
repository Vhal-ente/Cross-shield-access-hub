import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  role?: { name: string };
}

interface RequestActionModalProps {
  open: boolean;
  mode: "reassign" | "process";
  users?: User[];
  onClose: () => void;
  onSubmit: (payload: { assignedToId?: number; status?: string }) => void;
}

const RequestActionModal: React.FC<RequestActionModalProps> = ({
  open,
  mode,
  users = [],
  onClose,
  onSubmit,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleSubmit = () => {
    if (mode === "reassign" && !selectedUserId) {
      toast.error("Please select a user to reassign");
      return;
    }
    if (mode === "process" && !selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    const payload = mode === "reassign" 
      ? { assignedToId: selectedUserId }
      : { status: selectedStatus };

    onSubmit(payload);
    setSelectedUserId(null);
    setSelectedStatus("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "reassign" ? "Reassign Request" : "Process Request"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {mode === "reassign" ? (
            <div>
              <Label htmlFor="user-select">Assign to User</Label>
              {Array.isArray(users) && users.length > 0 ? (
                <Select
                  onValueChange={(value) => setSelectedUserId(Number(value))}
                  value={selectedUserId?.toString() || ""}
                >
                  <SelectTrigger id="user-select">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} {user.role?.name ? `(${user.role.name})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-gray-500">No users available</p>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="status-select">Update Status</Label>
              <Select
                onValueChange={setSelectedStatus}
                value={selectedStatus}
              >
                <SelectTrigger id="status-select">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mode === "reassign" ? !selectedUserId || !Array.isArray(users) || users.length === 0 : !selectedStatus}
          >
            {mode === "reassign" ? "Reassign" : "Process"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestActionModal;