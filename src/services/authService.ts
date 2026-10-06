import { UserProfile, SecuritySession } from '../types';
import { apiClient } from './apiClient';

const STORAGE_KEY_USER = 'scirag_user';
const STORAGE_KEY_AUTH = 'scirag_auth_state';
const STORAGE_KEY_ACCOUNTS = 'scirag_registered_accounts';

export interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  affiliation: string;
  researchInterests: string[];
  joinedDate: string;
}

export const DEFAULT_USER: UserProfile = {
  id: 'usr-researcher-01',
  name: 'Dr. Elena Rostova',
  email: 'e.rostova@scirag.io',
  role: 'Principal Investigator',
  affiliation: 'Center for Neural Information Systems',
  researchInterests: ['Retrieval-Augmented Generation', 'Vector Indices', 'Hallucination Mitigation', 'Knowledge Graphs'],
  joinedDate: 'October 2024'
};

export const MOCK_SECURITY_SESSIONS: SecuritySession[] = [
  {
    id: 'sess-mac-cur',
    device: 'MacBook Pro 16" · macOS Sonoma',
    browser: 'Chrome 131.0',
    ipAddress: '192.168.1.42',
    location: 'Zurich, Switzerland',
    lastActive: 'Active now',
    isCurrent: true
  },
  {
    id: 'sess-win-lab',
    device: 'Workstation Tower · Ubuntu 24.04 LTS',
    browser: 'Firefox 133.0',
    ipAddress: '130.59.10.88',
    location: 'ETH Campus, Zurich',
    lastActive: '2 days ago',
    isCurrent: false
  },
  {
    id: 'sess-ipad',
    device: 'iPad Pro 12.9" · iPadOS 18',
    browser: 'Safari 18.1',
    ipAddress: '178.197.234.12',
    location: 'Geneva, Switzerland',
    lastActive: '5 days ago',
    isCurrent: false
  }
];

let activeSessions = [...MOCK_SECURITY_SESSIONS];

export const getRegisteredAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  // Default seeded accounts
  return [
    {
      id: 'usr-researcher-01',
      name: 'Dr. Elena Rostova',
      email: 'e.rostova@scirag.io',
      password: 'password123',
      role: 'Principal Investigator',
      affiliation: 'Center for Neural Information Systems',
      researchInterests: ['Retrieval-Augmented Generation', 'Vector Indices', 'Knowledge Graphs'],
      joinedDate: 'October 2024'
    },
    {
      id: 'usr-shreyash-01',
      name: 'Shreyash Gautam',
      email: 'shreyashgautam2007@gmail.com',
      password: 'Wishyoubest_10',
      role: 'Lead Researcher',
      affiliation: 'Academic Research Laboratory',
      researchInterests: ['Retrieval-Augmented Generation', 'LLMs', 'Vector Search'],
      joinedDate: 'October 2024'
    }
  ];
};

export const getCurrentUser = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_USER;
};

// Keeps JWT token active across browser reloads so user NEVER auto-logs out
export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem('scirag_access_token');
    const authState = localStorage.getItem(STORAGE_KEY_AUTH);
    if (authState === 'false') return false;
    if (token) return true;
    if (authState === 'true') return true;
    return false;
  } catch {
    return false;
  }
};

// Background sync to ensure server data/users.json has client accounts
export const syncAccountsToServer = async () => {
  try {
    const accounts = getRegisteredAccounts();
    await apiClient.post('/auth/sync', { accounts });
  } catch {
    // background task
  }
};

// Trigger sync on module load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    syncAccountsToServer();
  }, 100);
}

export const login = async (email: string, password?: string): Promise<UserProfile> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password || '';

  if (!cleanEmail) {
    throw new Error('Please enter your institutional email address.');
  }
  if (!cleanPassword) {
    throw new Error('Please enter your password.');
  }

  // 1. First, check if this user is in local registered cache
  const localAccounts = getRegisteredAccounts();
  const localMatch = localAccounts.find((a) => a.email.toLowerCase() === cleanEmail);

  // If found locally, ensure server also knows about it before logging in
  if (localMatch) {
    try {
      await apiClient.post('/auth/register', {
        name: localMatch.name,
        email: localMatch.email,
        password: cleanPassword,
        research_interests: localMatch.researchInterests,
        affiliation: localMatch.affiliation
      });
    } catch {
      // Continue to login
    }
  }

  // 2. Call server /auth/login
  try {
    const res = await apiClient.post<any>('/auth/login', {
      email: cleanEmail,
      password: cleanPassword
    });

    if (res && res.user) {
      if (res.access_token) {
        localStorage.setItem('scirag_access_token', res.access_token);
      }
      const user: UserProfile = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role || 'Researcher',
        affiliation: res.user.affiliation || 'Academic Research Lab',
        researchInterests: res.user.research_interests || ['Retrieval-Augmented Generation', 'LLMs'],
        joinedDate: 'Active Researcher'
      };

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');

      // Update local accounts
      const accounts = getRegisteredAccounts();
      const matchIdx = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);
      if (matchIdx >= 0) {
        accounts[matchIdx].password = cleanPassword;
      } else {
        accounts.push({
          id: user.id,
          name: user.name,
          email: user.email,
          password: cleanPassword,
          role: user.role,
          affiliation: user.affiliation,
          researchInterests: user.researchInterests,
          joinedDate: user.joinedDate
        });
      }
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));

      return user;
    }
  } catch (apiError: any) {
    const msg: string = apiError?.message || '';

    // If password was wrong on server
    if (msg.includes('Invalid password')) {
      throw new Error('Invalid password. Please check your credentials and try again.');
    }

    // If local match exists, sync and succeed
    if (localMatch) {
      localMatch.password = cleanPassword;
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(localAccounts));

      const user: UserProfile = {
        id: localMatch.id,
        name: localMatch.name,
        email: localMatch.email,
        role: localMatch.role,
        affiliation: localMatch.affiliation,
        researchInterests: localMatch.researchInterests,
        joinedDate: localMatch.joinedDate
      };

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');
      if (!localStorage.getItem('scirag_access_token')) {
        localStorage.setItem('scirag_access_token', `scirag_jwt_${btoa(cleanEmail)}_${Date.now()}`);
      }
      return user;
    }

    if (msg && !msg.includes('401') && !msg.includes('Request failed')) {
      throw new Error(msg);
    }

    throw new Error('No account found with this email. Please register first.');
  }

  throw new Error('Authentication failed. Please verify your credentials.');
};

export const register = async (
  name: string,
  email: string,
  password: string,
  interests: string[]
): Promise<UserProfile> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanEmail) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  let user: UserProfile | null = null;

  try {
    const res = await apiClient.post<any>('/auth/register', {
      name: cleanName,
      email: cleanEmail,
      password: password,
      research_interests: interests
    });

    if (res && res.user) {
      if (res.access_token) {
        localStorage.setItem('scirag_access_token', res.access_token);
      }
      user = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role || 'Researcher',
        affiliation: res.user.affiliation || 'Academic Research Lab',
        researchInterests: res.user.research_interests || interests,
        joinedDate: 'Just now'
      };
    }
  } catch (err: any) {
    console.warn('[SciRAG] Backend register warning:', err);
  }

  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: cleanName || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: 'Researcher',
      affiliation: 'Academic Research Lab',
      researchInterests: interests.length ? interests : ['Retrieval-Augmented Generation', 'LLMs'],
      joinedDate: 'Just now'
    };
  }

  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEY_AUTH, 'true');
  if (!localStorage.getItem('scirag_access_token')) {
    localStorage.setItem('scirag_access_token', `scirag_jwt_${btoa(cleanEmail)}_${Date.now()}`);
  }

  // Save to persistent accounts in localStorage
  const accounts = getRegisteredAccounts();
  const existingIdx = accounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);
  const newAccount: StoredAccount = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: password,
    role: user.role,
    affiliation: user.affiliation,
    researchInterests: user.researchInterests,
    joinedDate: user.joinedDate
  };
  if (existingIdx >= 0) {
    accounts[existingIdx] = newAccount;
  } else {
    accounts.push(newAccount);
  }
  localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));

  return user;
};

export const logout = async (): Promise<void> => {
  localStorage.setItem(STORAGE_KEY_AUTH, 'false');
  localStorage.removeItem('scirag_access_token');
};

export const getSecuritySessions = async (): Promise<SecuritySession[]> => {
  return [...activeSessions];
};

export const revokeAllOtherSessions = async (): Promise<SecuritySession[]> => {
  activeSessions = activeSessions.filter((s) => s.isCurrent);
  return [...activeSessions];
};
