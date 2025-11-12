import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Plus, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface ProspectList {
  id: string;
  name: string;
  prospects: string[];
  createdAt: string;
}

interface AddToListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prospectId: string;
  prospectName: string;
  lists: ProspectList[];
  onListCreated: (list: ProspectList) => void;
  onProspectAdded: (listId: string, prospectId: string) => void;
}

export default function AddToListDialog({
  open,
  onOpenChange,
  prospectId,
  prospectName,
  lists,
  onListCreated,
  onProspectAdded,
}: AddToListDialogProps) {
  const { toast } = useToast();

  // Add scrollbar styling
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .add-to-list-scroll::-webkit-scrollbar {
        width: 8px;
      }
      .add-to-list-scroll::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      .add-to-list-scroll::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      .add-to-list-scroll::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedListIds, setSelectedListIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateList = () => {
    if (!newListName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a list name",
        variant: "destructive",
      });
      return;
    }

    const newList: ProspectList = {
      id: `list-${Date.now()}`,
      name: newListName,
      prospects: [prospectId],
      createdAt: new Date().toISOString(),
    };

    onListCreated(newList);
    toast({
      title: "Success",
      description: `List "${newListName}" created and prospect added!`,
    });

    setNewListName("");
    setSearchTerm("");
    setShowCreateList(false);
    onOpenChange(false);
  };

  const handleToggleList = (listId: string) => {
    setSelectedListIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
      } else {
        newSet.add(listId);
      }
      return newSet;
    });
  };

  const handleAddToSelectedLists = () => {
    if (selectedListIds.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one list",
        variant: "destructive",
      });
      return;
    }

    selectedListIds.forEach((listId) => {
      onProspectAdded(listId, prospectId);
    });

    const selectedCount = selectedListIds.size;
    toast({
      title: "Success",
      description: `Prospect added to ${selectedCount} list${selectedCount > 1 ? "s" : ""}!`,
    });

    setSelectedListIds(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          // Reset state when dialog closes
          setSearchTerm("");
          setShowCreateList(false);
          setNewListName("");
          setSelectedListIds(new Set());
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Add to List
          </DialogTitle>
          <DialogDescription>
            Add <span className="font-semibold text-gray-900">{prospectName}</span> to your saved lists
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showCreateList ? (
            <>
              {/* Existing Lists */}
              {lists.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Your Lists ({lists.length})
                  </Label>

                  {/* Search Input */}
                  {lists.length > 3 && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search lists..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 text-sm"
                      />
                    </div>
                  )}

                  <ScrollArea className="h-64 border border-gray-200 rounded-lg bg-gray-50 pr-4">
                    <div className="space-y-2 p-3">
                      {filteredLists.length > 0 ? (
                        filteredLists.map((list) => {
                        const isSelected = selectedListIds.has(list.id);
                        const alreadyInList = list.prospects.includes(prospectId);

                        return (
                          <button
                            key={list.id}
                            onClick={() => !alreadyInList && handleToggleList(list.id)}
                            disabled={alreadyInList}
                            className={cn(
                              "w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left",
                              isSelected && !alreadyInList
                                ? "border-valasys-orange bg-valasys-orange/5"
                                : alreadyInList
                                  ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                                  : "border-gray-200 hover:border-gray-300",
                            )}
                          >
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{list.name}</div>
                              <div className="text-xs text-gray-500">
                                {list.prospects.length} prospect{list.prospects.length !== 1 ? "s" : ""}
                              </div>
                            </div>
                            {alreadyInList ? (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <Check className="w-4 h-4" />
                                Added
                              </div>
                            ) : isSelected ? (
                              <div className="w-5 h-5 rounded-md bg-valasys-orange flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-md border-2 border-gray-300" />
                            )}
                          </button>
                        );
                        })
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-500">No lists match "{searchTerm}"</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* No Lists Message */}
              {lists.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-600">No lists created yet</p>
                  <p className="text-xs text-gray-500 mt-1">Create your first list to get started</p>
                </div>
              )}

              {/* Create New List Button */}
              <Button
                onClick={() => setShowCreateList(true)}
                variant="outline"
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New List
              </Button>

              {/* Action Buttons */}
              {lists.length > 0 && selectedListIds.size > 0 && (
                <Button
                  onClick={handleAddToSelectedLists}
                  className="w-full bg-valasys-orange hover:bg-valasys-orange/90"
                >
                  Add to {selectedListIds.size} List{selectedListIds.size > 1 ? "s" : ""}
                </Button>
              )}
            </>
          ) : (
            <>
              {/* Create List Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="list-name" className="text-sm font-semibold text-gray-700">
                    List Name
                  </Label>
                  <Input
                    id="list-name"
                    placeholder="e.g., High Priority Leads"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="mt-2"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Create a new list to organize your prospects by categories or campaigns
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => {
                    setShowCreateList(false);
                    setNewListName("");
                    setSearchTerm("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateList}
                  className="flex-1 bg-valasys-orange hover:bg-valasys-orange/90"
                >
                  Create & Add
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
