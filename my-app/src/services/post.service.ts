import { API_URL } from "./api";

export interface CreatePostDto {
    content: string;
    mediaUrls?: string[];
    privacy?: "public" | "friends" | "private";
    feeling?: string;
    location?: string;
    gifUrl?: string;
    taggedUserIds?: string[];
}

export const postAPI = {
    async createPost(data: CreatePostDto) {
        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: data.content,
                    mediaUrls: data.mediaUrls || [],
                    privacy: data.privacy ? data.privacy.toUpperCase() : "PUBLIC",
                    feeling: data.feeling,
                    location: data.location,
                    gifUrl: data.gifUrl,
                    taggedUserIds: data.taggedUserIds
                }),
            });

            // Handle token expiration (401)
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to create post';
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error) {
            console.error('createPost error:', error);
            throw error;
        }
    },

    async getPosts(page = 1, limit = 10) {
        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch(`${API_URL}/posts?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            // Handle token expiration (401)
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                // Return empty array so page can show guest mode instead of crashing
                return { data: [] };
            }

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to fetch posts';
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                console.error(`API Error (${response.status}):`, errorMessage);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('getPosts error:', error);
            throw error;
        }
    },

    async getUserPosts(userId: string, page = 1, limit = 10) {
        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch(`${API_URL}/posts/user/${userId}?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            // Handle token expiration (401)
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                // Return empty array so page can show guest mode instead of crashing
                return { data: [] };
            }

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to fetch user posts';
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                console.error(`API Error (${response.status}):`, errorMessage);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('getUserPosts error:', error);
            throw error;
        }
    },

    async updatePost(postId: string, data: { content: string }) {
        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            // Handle token expiration (401)
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to update post';
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                console.error(`API Error (${response.status}):`, errorMessage);
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('updatePost error:', error);
            throw error;
        }
    },

    async deletePost(postId: string) {
        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            // Handle token expiration (401)
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to delete post';
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                console.error(`API Error (${response.status}):`, errorMessage);
                throw new Error(errorMessage);
            }

            return { success: true };
        } catch (error) {
            console.error('deletePost error:', error);
            throw error;
        }
    },

    async addComment(postId: string, content: string) {
        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content }),
            });

            // Handle token expiration (401)
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to add comment';
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                console.error(`API Error (${response.status}):`, errorMessage);
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('addComment error:', error);
            throw error;
        }
    },

    async getComments(postId: string) {
        const token = localStorage.getItem("access_token");
        try {
            // Since backend doesn't have a dedicated getComments endpoint,
            // we'll fetch the post details which includes comments
            const response = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                return [];
            }

            if (!response.ok) {
                // If post not found or error, return empty array
                return [];
            }

            const post = await response.json();
            return post.comments || [];
        } catch (error) {
            console.error('getComments error:', error);
            return [];
        }
    },

    async deleteComment(commentId: string) {
        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch(`${API_URL}/posts/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            // Handle token expiration (401)
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to delete comment';
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                console.error(`API Error (${response.status}):`, errorMessage);
                throw new Error(errorMessage);
            }

            return { success: true };
        } catch (error) {
            console.error('deleteComment error:', error);
            throw error;
        }
    },

    async toggleReaction(postId: string, reactionType: string) {
        const token = localStorage.getItem("access_token");

        if (!token || token === "undefined" || token === "null") {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('auth-change'));
            }
            throw new Error('Vui lòng đăng nhập để thực hiện chức năng này.');
        }

        try {
            const requestBody = { type: reactionType };

            const response = await fetch(`${API_URL}/posts/${postId}/reactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody),
            });

            // Handle token expiration (401)
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to toggle reaction';
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                console.error(`API Error (${response.status}):`, errorMessage);
                console.error(`Response body:`, errorText);
                throw new Error(errorMessage);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('toggleReaction error:', error);
            throw error;
        }
    },

    async toggleCommentReaction(commentId: string, reactionType: string) {
        const token = localStorage.getItem("access_token");

        if (!token || token === "undefined" || token === "null") {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('auth-change'));
            }
            throw new Error('Vui lòng đăng nhập để thực hiện chức năng này.');
        }

        try {
            const requestBody = { type: reactionType };

            const response = await fetch(`${API_URL}/posts/comments/${commentId}/reactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody),
            });

            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to toggle comment reaction');
            }

            return response.json();
        } catch (error) {
            console.error('toggleCommentReaction error:', error);
            throw error;
        }
    },

    async searchByHashtag(hashtag: string, page = 1, limit = 20) {
        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch(`${API_URL}/posts/hashtag/${hashtag}?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                return { data: [] };
            }

            if (!response.ok) {
                return { data: [] };
            }

            return response.json();
        } catch (error) {
            console.error('searchByHashtag error:', error);
            return { data: [] };
        }
    },

    // --- Saved Posts (Frontend Persistence logic) ---
    async getSavedPosts() {
        if (typeof window === 'undefined') return [];

        const savedIds = JSON.parse(localStorage.getItem('saved_posts_ids') || '[]');
        if (savedIds.length === 0) return [];

        try {
            // Fetch multiple posts (using current getPosts as a workaround to find matches)
            const allPosts = await this.getPosts(1, 100);
            const postsData = allPosts.data || allPosts;

            return postsData.filter((p: any) => savedIds.includes(p.id));
        } catch (error) {
            console.error('getSavedPosts error:', error);
            return [];
        }
    },

    async toggleSavePost(postId: string) {
        if (typeof window === 'undefined') return false;

        const savedIds = JSON.parse(localStorage.getItem('saved_posts_ids') || '[]');
        const isSaved = savedIds.includes(postId);

        let newSavedIds;
        if (isSaved) {
            newSavedIds = savedIds.filter((id: string) => id !== postId);
        } else {
            newSavedIds = [...savedIds, postId];
        }

        localStorage.setItem('saved_posts_ids', JSON.stringify(newSavedIds));
        return !isSaved;
    },

    isPostSaved(postId: string) {
        if (typeof window === 'undefined') return false;
        const savedIds = JSON.parse(localStorage.getItem('saved_posts_ids') || '[]');
        return savedIds.includes(postId);
    },

    // --- Reaction Persistence (Frontend-only workaround) ---
    async setLocalReaction(postId: string, reactionType: string | null) {
        if (typeof window === 'undefined') return;
        const reactions = JSON.parse(localStorage.getItem('local_reactions') || '{}');
        reactions[postId] = reactionType || "NONE";
        localStorage.setItem('local_reactions', JSON.stringify(reactions));
    },

    getLocalReaction(postId: string): string | null {
        if (typeof window === 'undefined') return null;
        const reactions = JSON.parse(localStorage.getItem('local_reactions') || '{}');
        const val = reactions[postId];
        if (val === "NONE") return "NONE"; // Return special string to indicate explicit no-reaction
        return val || null;
    }
};
