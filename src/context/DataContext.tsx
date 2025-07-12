import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './AuthContext';

export interface SwapRequest {
  id: string;
  requesterId: string;
  receiverId: string;
  skillOffered: string;
  skillWanted: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  rating?: number;
  feedback?: string;
}

interface DataContextType {
  users: User[];
  swapRequests: SwapRequest[];
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => void;
  deleteSwapRequest: (id: string) => void;
  searchUsers: (skill?: string) => User[];
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    location: 'New York, NY',
    profilePhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    skillsOffered: ['Graphic Design', 'Photoshop', 'Illustrator'],
    skillsWanted: ['Web Development', 'React'],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    isAdmin: false,
    rating: 4.8,
    bio: 'Creative designer with 5+ years of experience in visual communication.',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    location: 'San Francisco, CA',
    profilePhoto: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    skillsOffered: ['Web Development', 'React', 'Node.js'],
    skillsWanted: ['UI/UX Design', 'Photoshop'],
    availability: ['Weekdays', 'Evenings'],
    isPublic: true,
    isAdmin: false,
    rating: 4.9,
    bio: 'Full-stack developer passionate about creating amazing user experiences.',
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    location: 'Austin, TX',
    profilePhoto: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    skillsOffered: ['Data Analysis', 'Excel', 'Python'],
    skillsWanted: ['Machine Learning', 'SQL'],
    availability: ['Weekends'],
    isPublic: true,
    isAdmin: false,
    rating: 4.7,
    bio: 'Data analyst helping businesses make data-driven decisions.',
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    location: 'Seattle, WA',
    profilePhoto: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150',
    skillsOffered: ['Digital Marketing', 'SEO', 'Content Writing'],
    skillsWanted: ['Graphic Design', 'Video Editing'],
    availability: ['Evenings', 'Weekends'],
    isPublic: true,
    isAdmin: false,
    rating: 4.6,
    bio: 'Marketing specialist with expertise in digital growth strategies.',
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);

  useEffect(() => {
    // Initialize with mock data if no data exists
    const savedUsers = localStorage.getItem('users');
    if (!savedUsers) {
      localStorage.setItem('users', JSON.stringify(mockUsers));
      setUsers(mockUsers);
    } else {
      setUsers(JSON.parse(savedUsers));
    }

    const savedRequests = localStorage.getItem('swapRequests');
    if (savedRequests) {
      setSwapRequests(JSON.parse(savedRequests));
    }
  }, []);

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const createSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    const updatedRequests = [...swapRequests, newRequest];
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));
  };

  const updateSwapRequest = (id: string, updates: Partial<SwapRequest>) => {
    const updatedRequests = swapRequests.map(req =>
      req.id === id ? { ...req, ...updates } : req
    );
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));
  };

  const deleteSwapRequest = (id: string) => {
    const updatedRequests = swapRequests.filter(req => req.id !== id);
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));
  };

  const searchUsers = (skill?: string) => {
    if (!skill) return users.filter(user => user.isPublic);
    
    return users.filter(user => 
      user.isPublic && (
        user.skillsOffered.some(s => s.toLowerCase().includes(skill.toLowerCase())) ||
        user.skillsWanted.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      )
    );
  };

  const banUser = (userId: string) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, isPublic: false } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const unbanUser = (userId: string) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, isPublic: true } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <DataContext.Provider value={{
      users,
      swapRequests,
      createSwapRequest,
      updateSwapRequest,
      deleteSwapRequest,
      searchUsers,
      banUser,
      unbanUser,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}