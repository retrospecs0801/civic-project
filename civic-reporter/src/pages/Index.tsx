import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IssueForm } from '@/components/IssueForm';
import { IssuesList } from '@/components/IssuesList';
import { Map } from '@/components/Map';
import { useGeolocation } from '@/hooks/useGeolocation';
import { IssuesAPI } from '@/api/issues';
import { Issue, IssueInput } from '@/types';
import { 
  MapPin, Plus, List, Map as MapIcon, 
  AlertCircle, Loader2, RefreshCw, 
  LogOut, Sun, Moon 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';

interface IndexProps {
  onLogout?: () => void;
}

const Index = ({ onLogout }: IndexProps) => {
  const { location, error, loading: geoLoading } = useGeolocation();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('map');
  const [focusedIssue, setFocusedIssue] = useState<Issue | null>(null);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [mapKey, setMapKey] = useState(0);

  // Fetch issues from backend on mount
  useEffect(() => {
    IssuesAPI.getAll()
      .then(data => setIssues(data))
      .catch(err => console.error("Error fetching issues:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmitIssue = (issue: Issue) => {
    const issueInput = {
      title: issue.title,
      description: issue.description,
      category: issue.category,
      status: issue.status,
      coordinates: {
        lat: Number(issue.coordinates.lat.toFixed(6)),
        lng: Number(issue.coordinates.lng.toFixed(6))
      },
      photo: issue.photo,
      address: issue.address
    };

    IssuesAPI.create(issueInput)
      .then(newIssue => {
        setIssues(prev => [...prev, newIssue]);
        setActiveTab('map');
        setFocusedIssue(newIssue);
      })
      .catch((error) => {
        console.error('API Error:', error);
        toast({ title: "Error", description: "Failed to submit issue. Make sure backend is running." });
      });
  };

  const handleDeleteIssue = (id: string) => {
    IssuesAPI.delete(id)
      .then(() => {
        setIssues(prev => prev.filter(i => String(i.id) !== id));
        toast({ title: "Issue Deleted", description: "The issue has been removed." });
      })
      .catch(() => {
        toast({ title: "Error", description: "Failed to delete issue. Make sure backend is running." });
      });
  };

  const handleFocusIssue = (issue: Issue) => {
    setFocusedIssue(issue);
    setActiveTab('map');
  };

  const handleRefreshLocation = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-dark border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center glow-primary">
                <MapPin className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Civic Reporter</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Report & track community issues
                </p>
              </div>
            </div>
            
            {/* Location / Theme / Logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              {onLogout && (
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              )}
              <div className="flex items-center gap-1 sm:gap-2">
                {geoLoading && (
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span className="hidden sm:inline">Getting location...</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                    <span className="text-xs sm:text-sm text-destructive hidden sm:inline">Location error</span>
                    <Button variant="outline" size="sm" onClick={handleRefreshLocation}>
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 glass-dark h-12 sm:h-10">
            <TabsTrigger value="map" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <MapIcon className="h-4 w-4" /> <span className="hidden sm:inline">Map</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Report</span>
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <List className="h-4 w-4" /> Issues ({issues.length})
            </TabsTrigger>
          </TabsList>

          {/* Always render map but show/hide based on active tab */}
          <div className={`${activeTab === 'map' ? 'block' : 'hidden'}`}>
            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6 h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)]">
              <div className="lg:col-span-3 h-64 sm:h-80 lg:h-full">
                <Map key={mapKey} issues={issues} userLocation={location} focusedIssue={focusedIssue} className="h-full" />
              </div>
              <div className="lg:col-span-1 flex-1 lg:h-full">
                <IssuesList issues={issues} onDeleteIssue={handleDeleteIssue} onFocusIssue={handleFocusIssue} />
              </div>
            </div>
          </div>

          {/* Report Issue */}
          <div className={`${activeTab === 'report' ? 'block' : 'hidden'}`}>
            <IssueForm onSubmit={handleSubmitIssue} userLocation={location} />
          </div>

          {/* Issues List */}
          <div className={`${activeTab === 'issues' ? 'block' : 'hidden'}`}>
            <IssuesList issues={issues} onDeleteIssue={handleDeleteIssue} onFocusIssue={handleFocusIssue} />
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
