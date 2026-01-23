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
            console.log(`Fetching posts from: ${API_URL}/posts?page=${page}&limit=${limit}`);
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
            console.log('Posts fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('getPosts error:', error);
            throw error;
        }
    },

    async getUserPosts(userId: string, page = 1, limit = 10) {
        const token = localStorage.getItem("access_token");
        try {
            console.log(`Fetching user posts from: ${API_URL}/posts/user/${userId}?page=${page}&limit=${limit}`);
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
            console.log('User posts fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('getUserPosts error:', error);
            throw error;
        }
    },

    async updatePost(postId: string, data: { content: string }) {
        const token = localStorage.getItem("access_token");
        try {
            console.log(`Updating post: ${API_URL}/posts/${postId}`);
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
            console.log('Post updated successfully:', result);
            return result;
        } catch (error) {
            console.error('updatePost error:', error);
            throw error;
        }
    },

    async deletePost(postId: string) {
        const token = localStorage.getItem("access_token");
        try {
            console.log(`Deleting post: ${API_URL}/posts/${postId}`);
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

            console.log('Post deleted successfully');
            return { success: true };
        } catch (error) {
            console.error('deletePost error:', error);
            throw error;
        }
    }
};
