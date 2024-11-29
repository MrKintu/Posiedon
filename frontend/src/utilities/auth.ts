import { jwtDecode } from 'jwt-decode';

interface TokenData {
  exp: number;
  user_id: string;
  // Add other token fields as needed
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token) as TokenData;
    if (!decoded.exp) return true;
    
    // Add a 60-second buffer to handle clock skew
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTime + 60;
  } catch {
    return true;
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*)' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

export const rateLimit = () => {
  const store = new Map();
  const MAX_REQUESTS = 100;
  const TIME_WINDOW = 60 * 1000; // 1 minute

  return (userId: string): boolean => {
    const now = Date.now();
    const userRequests = store.get(userId) || [];
    
    // Remove old requests
    const validRequests = userRequests.filter((timestamp: number) => 
      now - timestamp < TIME_WINDOW
    );
    
    if (validRequests.length >= MAX_REQUESTS) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    store.set(userId, validRequests);
    return true;
  };
};

// Session storage with encryption
export const secureStorage = {
  setItem: (key: string, value: any) => {
    try {
      // Convert value to string if it's an object
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      // In production, you'd want to encrypt this data
      sessionStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  },
  
  getItem: (key: string) => {
    try {
      const value = sessionStorage.getItem(key);
      if (!value) return null;
      // In production, you'd want to decrypt this data
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },
  
  clear: () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
};
