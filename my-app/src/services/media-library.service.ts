import { API_URL } from "./api";

export interface MediaAsset {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";
  category?: string;
  title?: string;
  description?: string;
  featured?: boolean;
  trending?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaLibraryResponse {
  data?: MediaAsset[];
  items?: MediaAsset[];
  total?: number;
  page?: number;
  limit?: number;
}

export const mediaLibraryAPI = {
  async getAssets(searchQuery?: string, page: number = 1, limit: number = 20) {
    const token = localStorage.getItem("access_token");
    try {
      let url = `${API_URL}/media-library?page=${page}&limit=${limit}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { data: [] };
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch media assets");
      }

      return response.json();
    } catch (error) {
      console.error("getAssets error:", error);
      throw error;
    }
  },

  async getAssetsByType(type: string, page: number = 1, limit: number = 50) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API_URL}/media-library/type/${type}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { data: [] };
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch media by type");
      }

      return response.json();
    } catch (error) {
      console.error("getAssetsByType error:", error);
      throw error;
    }
  },

  async getAssetsByCategory(
    category: string,
    page: number = 1,
    limit: number = 50
  ) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API_URL}/media-library/category/${category}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { data: [] };
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch media by category");
      }

      return response.json();
    } catch (error) {
      console.error("getAssetsByCategory error:", error);
      throw error;
    }
  },

  async getFeaturedAssets(type?: string, limit: number = 20) {
    const token = localStorage.getItem("access_token");
    try {
      let url = `${API_URL}/media-library/featured?limit=${limit}`;
      if (type) {
        url += `&type=${type}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { data: [] };
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch featured assets");
      }

      return response.json();
    } catch (error) {
      console.error("getFeaturedAssets error:", error);
      throw error;
    }
  },

  async getTrendingAssets(type?: string, limit: number = 20) {
    const token = localStorage.getItem("access_token");
    try {
      let url = `${API_URL}/media-library/trending?limit=${limit}`;
      if (type) {
        url += `&type=${type}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { data: [] };
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch trending assets");
      }

      return response.json();
    } catch (error) {
      console.error("getTrendingAssets error:", error);
      throw error;
    }
  },

  async getRandomAssets(type?: string, limit: number = 10) {
    const token = localStorage.getItem("access_token");
    try {
      let url = `${API_URL}/media-library/random?limit=${limit}`;
      if (type) {
        url += `&type=${type}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { data: [] };
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch random assets");
      }

      return response.json();
    } catch (error) {
      console.error("getRandomAssets error:", error);
      throw error;
    }
  },

  async searchByTag(tag: string, page: number = 1, limit: number = 50) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API_URL}/media-library/tag/${tag}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { data: [] };
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to search by tag");
      }

      return response.json();
    } catch (error) {
      console.error("searchByTag error:", error);
      throw error;
    }
  },

  async getAllTags() {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/media-library/tags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return [];
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch tags");
      }

      return response.json();
    } catch (error) {
      console.error("getAllTags error:", error);
      throw error;
    }
  },

  async getCategories() {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/media-library/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return [];
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch categories");
      }

      return response.json();
    } catch (error) {
      console.error("getCategories error:", error);
      throw error;
    }
  },

  async getAssetById(id: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/media-library/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch asset");
      }

      return response.json();
    } catch (error) {
      console.error("getAssetById error:", error);
      throw error;
    }
  },
};
