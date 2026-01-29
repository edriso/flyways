import axios from 'axios';

const BASE_URL = import.meta.env.VITE_AMADEUS_BASE_URL || 'https://test.api.amadeus.com';
const CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

let token = null;
// Learning Tip ✨:
// tokenPromise prevents multiple simultaneous token requests when multiple API calls
// happen concurrently before a token is cached. Without it, if 5 requests fire at once,
// all 5 would trigger separate token fetch requests, wasting API calls and potentially
// hitting rate limits. With tokenPromise, all concurrent requests wait for the same
// promise, ensuring only one token request is made.
// 
// Can it be removed? Technically yes, but it's a best practice to keep it. Even with
// React Query handling request deduplication, this prevents unnecessary token requests
// at the axios interceptor level, which is more efficient.
let tokenPromise = null;

async function getToken() {
  if (token) return token;
  
  // If a token request is already in progress, return the existing promise
  // so all concurrent requests share the same token fetch
  if (tokenPromise) return tokenPromise;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Amadeus API credentials are missing. Please set VITE_AMADEUS_CLIENT_ID and VITE_AMADEUS_CLIENT_SECRET in your .env file.');
  }

  tokenPromise = axios
    .post(
      `${BASE_URL}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    )
    .then((response) => {
      token = response.data.access_token;
      tokenPromise = null;
      return token;
    })
    .catch((error) => {
      tokenPromise = null;
      console.error('Failed to get Amadeus token:', error.response?.data || error.message);
      throw error;
    });

  return tokenPromise;
}

export const axiosInstance = axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!config.url?.includes('/v1/security/oauth2/token')) {
      config.headers.Authorization = `Bearer ${await getToken()}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Clear token on 401 to trigger refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      token = null;
    }
    return Promise.reject(error);
  }
);
