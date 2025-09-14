import { Issue, UserLocation } from '@/types';
import { IssuesAPI } from '@/api/issues';
import { ISSUE_STATUSES } from '@/config/constants';

// backend: this contains business logic for issues
// the IssuesAPI calls will be replaced with your http requests
export class IssueService {
  // this creates a new issue report
  // the photo will be base64 string that you need to save as file
  static createIssue(data: {
    title: string;
    description: string;
    category: string;
    photo?: string; // this is base64 image data
    userLocation: UserLocation; // gps coordinates
    address?: string;
  }): Issue {
    // you can generate uuid instead of timestamp for id
    const issue: Issue = {
      id: Date.now().toString(), // replace with uuid
      title: data.title.trim(),
      description: data.description.trim(),
      photo: data.photo, // save this base64 as image file
      coordinates: data.userLocation, //store lat/lng in database
      status: ISSUE_STATUSES.SUBMITTED, // default status for new issues
      category: data.category,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      address: data.address?.trim(),
    };

    // this will call your POST /api/issues endpoint
    IssuesAPI.create(issue);
    return issue;
  }

  static getAllIssues(): Issue[] {
    return IssuesAPI.getAll();
  }

  static updateIssueStatus(id: string, status: Issue['status']): void {
    IssuesAPI.updateStatus(id, status);
  }

  static deleteIssue(id: string): void {
    IssuesAPI.delete(id);
  }

  static getIssuesByStatus(status: Issue['status']): Issue[] {
    return this.getAllIssues().filter(issue => issue.status === status);
  }

  static getStatusCounts() {
    const issues = this.getAllIssues();
    return {
      submitted: issues.filter(i => i.status === ISSUE_STATUSES.SUBMITTED).length,
      in_progress: issues.filter(i => i.status === ISSUE_STATUSES.IN_PROGRESS).length,
      completed: issues.filter(i => i.status === ISSUE_STATUSES.COMPLETED).length,
    };
  }

  static getNextStatus(currentStatus: Issue['status']): Issue['status'] {
    switch (currentStatus) {
      case ISSUE_STATUSES.SUBMITTED:
        return ISSUE_STATUSES.IN_PROGRESS;
      case ISSUE_STATUSES.IN_PROGRESS:
        return ISSUE_STATUSES.COMPLETED;
      default:
        return currentStatus;
    }
  }
}