import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map } from "@/components/Map";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Issue } from "@/types";
import { IssuesAPI } from "@/api/issues"; // 👈 new import
import {
  MapPin,
  List,
  Map as MapIcon,
  AlertCircle,
  Loader2,
  LogOut,
  CheckCircle,
  Clock,
  Play,
  Sun,
  Moon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { location, error: geoError, loading: geoLoading } = useGeolocation();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("map");
  const [focusedIssue, setFocusedIssue] = useState<Issue | null>(null);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  // ✅ Fetch issues from backend
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const data = await IssuesAPI.getAll();
        setIssues(data);
      } catch (err) {
        console.error("Error fetching issues:", err);
        toast({
          title: "Error",
          description: "Could not load issues",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [toast]);

  // ✅ Update status via API
  const handleStatusUpdate = async (issueId: string, newStatus: Issue["status"]) => {
    try {
      const updated = await IssuesAPI.updateStatus(issueId, newStatus);
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, status: updated.status } : i))
      );
      toast({
        title: "Status Updated",
        description: `Issue status changed to ${newStatus.replace("_", " ")}`,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Error",
        description: "Could not update status",
        variant: "destructive",
      });
    }
  };

  const handleFocusIssue = (issue: Issue) => {
    setFocusedIssue(issue);
    setActiveTab("map");
  };

  const getStatusColor = (status: Issue["status"]) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-500";
      case "in_progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getNextStatus = (currentStatus: Issue["status"]) => {
    switch (currentStatus) {
      case "submitted":
        return "in_progress";
      case "in_progress":
        return "completed";
      default:
        return currentStatus;
    }
  };

  const getStatusIcon = (status: Issue["status"]) => {
    switch (status) {
      case "submitted":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const statusCounts = {
    submitted: issues.filter((i) => i.status === "submitted").length,
    in_progress: issues.filter((i) => i.status === "in_progress").length,
    completed: issues.filter((i) => i.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-dark border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-primary">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Manage community issues
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Location Status */}
              {geoLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Getting location...
                </div>
              )}
              {geoError && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">Location error</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full glow-primary"></div>
                  Location active
                </div>
              )}

              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading issues...</span>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="glass-dark border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="text-2xl font-bold">{statusCounts.submitted}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-dark border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">{statusCounts.in_progress}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-dark border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{statusCounts.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 glass-dark">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <MapIcon className="h-4 w-4" />
                Map View
              </TabsTrigger>
              <TabsTrigger value="issues" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                All Issues ({issues.length})
              </TabsTrigger>
            </TabsList>

            {/* Map View */}
            <TabsContent value="map" className="space-y-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
                <div className="lg:col-span-3">
                  <Map
                    issues={issues}
                    userLocation={location}
                    focusedIssue={focusedIssue}
                    className="h-full"
                  />
                </div>
                <div className="lg:col-span-1">
                  <Card className="glass-dark border-border h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Issues</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {issues.slice(0, 5).map((issue) => (
                        <div
                          key={issue.id}
                          className="p-3 rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => handleFocusIssue(issue)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              className={`${getStatusColor(issue.status)} text-white`}
                            >
                              {issue.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm">{issue.title}</h4>
                          <p className="text-xs text-muted-foreground">{issue.category}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Issues List */}
            <TabsContent value="issues">
              <div className="space-y-4">
                {issues.map((issue) => (
                  <Card key={issue.id} className="glass-dark border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge
                              className={`${getStatusColor(issue.status)} text-white flex items-center gap-1`}
                            >
                              {getStatusIcon(issue.status)}
                              {issue.status.replace("_", " ")}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {issue.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
                          <p className="text-muted-foreground mb-3">{issue.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Reported: {new Date(issue.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFocusIssue(issue)}
                          >
                            View on Map
                          </Button>
                          {issue.status !== "completed" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(issue.id, getNextStatus(issue.status))
                              }
                            >
                              <Play className="h-4 w-4 mr-1" />
                              {issue.status === "submitted"
                                ? "Start Progress"
                                : "Mark Complete"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {issues.length === 0 && (
                  <Card className="glass-dark border-border">
                    <CardContent className="p-12 text-center">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Issues Found</h3>
                      <p className="text-muted-foreground">
                        No community issues have been reported yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
