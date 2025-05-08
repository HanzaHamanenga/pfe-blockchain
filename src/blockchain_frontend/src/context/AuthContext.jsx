import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = async (email, password) => {
    // login logigiq
    const mockUsers = [
      { email: 'ndyangaelijah@gmail.com', password: '1303@#Eli', isAdmin: true },
      { email: 'user@example.com', password: 'user123', isAdmin: false }
    ];
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      return true; 
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}