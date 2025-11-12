import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Heart,
  BookmarkMinus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export interface ProspectList {
  id: string;
  name: string;
  prospects: string[];
  createdAt: string;
}

export default function WishlistProspects() {
  const { toast } = useToast();

  const [lists, setLists] = useState<ProspectList[]>(() => {
    try {
      const raw = localStorage.getItem("prospect:lists");
      return raw ? (JSON.parse(raw) as ProspectList[]) : [];
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<ProspectList | null>(null);
  const [editedListName, setEditedListName] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("prospect:lists", JSON.stringify(lists));
    } catch {}
  }, [lists]);

  const filteredLists = useMemo(() => {
    return lists.filter((list) =>
      list.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [lists, searchTerm]);

  const handleView = (list: ProspectList) => {
    setSelectedList(list);
    setViewDialogOpen(true);
  };

  const handleEditStart = (list: ProspectList) => {
    setSelectedList(list);
    setEditedListName(list.name);
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedList) return;

    if (!editedListName.trim()) {
      toast({
        title: "Error",
        description: "List name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === selectedList.id
          ? { ...list, name: editedListName.trim() }
          : list,
      ),
    );

    toast({
      title: "Success",
      description: `List renamed to "${editedListName.trim()}"`,
    });

    setEditDialogOpen(false);
    setSelectedList(null);
    setEditedListName("");
  };

  const handleDeleteStart = (list: ProspectList) => {
    setSelectedList(list);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedList) return;

    setLists((prevLists) =>
      prevLists.filter((list) => list.id !== selectedList.id),
    );

    toast({
      title: "Success",
      description: `List "${selectedList.name}" deleted`,
    });

    setDeleteAlertOpen(false);
    setSelectedList(null);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return "Unknown";
    }
  };

  if (lists.length === 0) {
    return (
      <TooltipProvider>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/find-prospect">
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Heart className="w-6 h-6 mr-3 text-valasys-orange" />
                  Wishlist Prospects
                </h1>
                <div className="text-sm text-gray-600 mt-1">
                  Your saved lists will appear here
                </div>
              </div>
            </div>

            <Card className="shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gradient-to-r from-valasys-orange/10 to-orange-50 rounded-full">
                    <BookmarkMinus className="w-12 h-12 text-valasys-orange" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      No Lists Yet
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      Create your first list by adding prospects to a new list
                      on the Prospect Results page. Your lists will be saved
                      here for easy access.
                    </p>
                  </div>
                  <Link to="/prospect-results">
                    <Button className="bg-valasys-orange hover:bg-valasys-orange/90 text-white mt-4">
                      <Search className="w-4 h-4 mr-2" />
                      Find Prospects
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/find-prospect">
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Heart className="w-6 h-6 mr-3 text-valasys-orange" />
                  Wishlist Prospects
                </h1>
                <div className="text-sm text-gray-600 mt-1">
                  Manage your saved prospect lists
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search lists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lists Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Lists</CardTitle>
                <Badge variant="secondary" className="bg-gray-100">
                  {filteredLists.length} List
                  {filteredLists.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-1/3">Name of List</TableHead>
                      <TableHead className="w-1/4">No of Records</TableHead>
                      <TableHead className="w-1/4">Created Date</TableHead>
                      <TableHead className="w-16 text-right pr-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLists.length > 0 ? (
                      filteredLists.map((list) => (
                        <TableRow key={list.id}>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {list.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {list.prospects.length} prospect
                              {list.prospects.length !== 1 ? "s" : ""}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {formatDate(list.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleView(list)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditStart(list)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteStart(list)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-gray-500"
                        >
                          No lists found matching "{searchTerm}"
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View List Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedList?.name}</DialogTitle>
              <DialogDescription>
                Contains {selectedList?.prospects.length || 0} prospect
                {selectedList?.prospects.length !== 1 ? "s" : ""} • Created{" "}
                {selectedList && formatDate(selectedList.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-3">
                  Prospects in this list:
                </h4>
                {selectedList && selectedList.prospects.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedList.prospects.map((prospectId, index) => (
                      <div
                        key={prospectId}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                      >
                        <span className="text-sm text-gray-700">
                          {index + 1}. ID: {prospectId}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No prospects in this list
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit List Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit List Name</DialogTitle>
              <DialogDescription>
                Change the name of your list
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  List Name
                </label>
                <Input
                  value={editedListName}
                  onChange={(e) => setEditedListName(e.target.value)}
                  placeholder="Enter list name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEditSave();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false);
                  setEditedListName("");
                  setSelectedList(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSave}
                className="bg-valasys-orange hover:bg-valasys-orange/90"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete List</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the list "{selectedList?.name}"?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardLayout>
    </TooltipProvider>
  );
}
