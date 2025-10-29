// --- CONFIGURATION ---
// IMPORTANT: Use the relative path to ensure connectivity in sandboxed environments.

// --- API FETCH UTILITY (Integrated into Provider for centralized handling) ---
export const apiFetch = async (endpoint, options = {}) => {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal: AbortSignal.timeout(10000), 
    };

    const finalOptions = { ...defaultOptions, ...options };
    if (finalOptions.body && typeof finalOptions.body !== 'string') {
        finalOptions.body = JSON.stringify(finalOptions.body);
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, finalOptions);
        
        if (response.status === 204) {
             return { status: 204, data: null, success: true, message: 'Operation successful' };
        }
        
        const contentType = response.headers.get("content-type");
        const data = (contentType && contentType.includes("application/json")) ? await response.json() : await response.text();

        if (!response.ok) {
            const message = data.message || (typeof data === 'string' ? data : `HTTP error! Status: ${response.status}`);
            const error = new Error(message);
            error.status = response.status;
            throw error;
        }

        return { status: response.status, data: data.data, success: data.success, message: data.message };
    } catch (error) {
        if (error.name === 'TypeError' || error.name === 'AbortError') {
             throw { status: 503, message: `Connection failed. Check if backend is running and accessible.` };
        }
        const status = error.status || 500;
        const message = error.message || 'An unexpected internal error occurred.';
        throw { status, message };
    }
};
