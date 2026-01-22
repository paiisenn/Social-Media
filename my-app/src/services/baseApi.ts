import { API_URL } from "./api";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            const hasToken = !!localStorage.getItem('access_token');
            if (hasToken) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                // Notify other parts of the app to update UI to guest mode
                // User stays on the current page in guest mode
                window.dispatchEvent(new Event('auth-change'));
            }
        }
        // Don't throw error or redirect - let page continue in guest mode
        // Only return the response so caller can handle 401 if needed
        return response;
    }

    return response;
}
