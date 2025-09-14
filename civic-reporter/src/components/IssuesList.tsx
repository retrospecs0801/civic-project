import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { Issue } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface IssuesListProps {
  issues: Issue[];
 onDeleteIssue: (id: string) => void;  // string, not number
  onFocusIssue: (issue: Issue) => void;
  className?: string;
}

export const IssuesList: React.FC<IssuesListProps> = ({
  issues,
  onDeleteIssue,
  onFocusIssue,
  className,
}) => {
  const { t } = useTranslation();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return t('submitted');
      case 'in_progress':
        return t('inProgress');
      case 'completed':
        return t('completed');
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <AlertTriangle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (issues.length === 0) {
    return (
      <Card className={`glass-dark border-border ${className}`}>
        <CardHeader>
          <CardTitle>{t('myIssues')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No issues reported yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass-dark border-border ${className}`}>
      <CardHeader>
        <CardTitle>{t('myIssues')} ({issues.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="glass border border-border rounded-lg p-4 transition-all-smooth hover:border-primary/50"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-foreground line-clamp-1">
                  {issue.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {issue.category}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
                  {getStatusIcon(issue.status)}
                  <span className="ml-1">{getStatusText(issue.status)}</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteIssue(issue.id)}  // no error now
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {issue.photo && (           // made changes...
                            <img
                  src={typeof issue.photo === "string" ? issue.photo : URL.createObjectURL(issue.photo)}
                  alt={issue.title}
                  className="w-32 h-32 object-cover rounded"
                />
            )}

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {issue.description}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {issue.coordinates?.lat !== undefined && issue.coordinates?.lng !== undefined
                  ? `${Number(issue.coordinates.lat).toFixed(4)}, ${Number(issue.coordinates.lng).toFixed(4)}`
                  : t("locationUnavailable" as any)}    
              </span>
              <span>{formatDate(issue.timestamp)}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onFocusIssue(issue)}
              className="w-full mt-3 glass-dark"
            >
              {t('viewOnMap')}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
