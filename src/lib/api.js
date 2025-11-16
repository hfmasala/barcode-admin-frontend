import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'https://rohanshaw-dashboard-admin-backend.hf.space/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- IMPORTANT ---
// Interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// NEW: Helper function to download files
export const downloadFile = async (url, filename) => {
  try {
    const response = await api.get(url, {
      responseType: 'blob', // Important: tell axios to expect binary data
    });

    // Create a new URL for the blob object
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', filename); // Set the filename for download
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(fileURL);

  } catch (error) {
    console.error('File download error:', error);
    throw new Error('Failed to download file.');
  }
};

export default api;