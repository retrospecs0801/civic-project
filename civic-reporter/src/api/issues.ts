// issues.ts
import { Issue, IssueInput } from "@/types";
import { API_BASE } from "@/config/constants";

export class IssuesAPI {
  // GET /api/issues
  static async getAll(): Promise<Issue[]> {
    const response = await fetch(`${API_BASE}/issues/`);
    if (!response.ok) throw new Error("Failed to fetch issues");

    const data = await response.json();

    return data.map((issue: any) => ({
      ...issue,
      id: String(issue.id), // 🔹 normalize id to string
      coordinates: {
        lat: Number(issue.latitude),
        lng: Number(issue.longitude),
      },
    }));
  }

  // POST /api/issues
  static async create(issue: IssueInput): Promise<Issue> {
    const formData = new FormData();
    formData.append("title", issue.title);
    formData.append("description", issue.description);
    formData.append("category", issue.category);
    formData.append("status", issue.status);

    formData.append("latitude", issue.coordinates.lat.toString());
    formData.append("longitude", issue.coordinates.lng.toString());

    if (issue.photo instanceof File) {
      formData.append("image", issue.photo); // backend expects "image"
    }

    const response = await fetch(`${API_BASE}/issues/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to create issue");

    const created = await response.json();
    return {
      ...created,
      id: String(created.id), // 🔹 normalize here too
      coordinates: {
        lat: Number(created.latitude),
        lng: Number(created.longitude),
      },
    };
  }

  // PUT /api/issues/:id
  static async update(id: string, updates: Partial<IssueInput>): Promise<Issue> {
    const formData = new FormData();

    if (updates.title) formData.append("title", updates.title);
    if (updates.description) formData.append("description", updates.description);
    if (updates.category) formData.append("category", updates.category);
    if (updates.status) formData.append("status", updates.status);

    if (updates.coordinates) {
      formData.append("latitude", updates.coordinates.lat.toString());
      formData.append("longitude", updates.coordinates.lng.toString());
    }

    if (updates.photo instanceof File) {
      formData.append("image", updates.photo);
    }

    const response = await fetch(`${API_BASE}/issues/${Number(id)}/`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to update issue");

    const updated = await response.json();
    return {
      ...updated,
      id: String(updated.id),
      coordinates: {
        lat: Number(updated.latitude),
        lng: Number(updated.longitude),
      },
    };
  }

  // DELETE /api/issues/:id
  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/issues/${Number(id)}/`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete issue");
  }
      // POST /api/issues/:id/status/
        static async updateStatus(id: string, status: Issue["status"]): Promise<Issue> {
          const formData = new FormData();
          formData.append("status", status);

          const response = await fetch(`${API_BASE}/issues/${Number(id)}/status/`, {
            method: "POST", // 🔹 changed from PATCH → POST
            body: formData,
          });

          if (!response.ok) throw new Error("Failed to update issue status");

          const updated = await response.json();
          return {
            ...updated,
            id: String(updated.id),
            coordinates: {
              lat: Number(updated.latitude),
              lng: Number(updated.longitude),
            },
          };
        }
}
