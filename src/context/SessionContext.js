// 'use client';

// import { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// const SessionContext = createContext();

// export const SessionProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const fetchSession = async () => {
//     try {
//       const response = await fetch('/api/auth/session');
//       const data = await response.json();
//       console.log(data.user);

//       if (response.ok && data.user) {
//         setUser(data.user);
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       console.error('Session check failed:', error);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSession();
//   }, []);

//   const login = async (email, password, role ) => {
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, role }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         await fetchSession(); // Refresh session after login
//         // Redirect based on role
//         const redirectPath = data.user.role === 'HOD' ? '/hod' : `/${data.user.role}`;
//         router.push(redirectPath);
//         return { success: true };
//       } else {
//         return { success: false, message: data.message };
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       return { success: false, message: 'Login failed. Please try again.' };
//     }
//   };

//   const logout = async () => {
//     try {
//       await fetch('/api/auth/logout', { method: 'POST' });
//       setUser(null);
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <SessionContext.Provider value={{ user, loading, login, logout, refreshSession: fetchSession }}>
//       {children}
//     </SessionContext.Provider>
//   );
// };

// export const useSession = () => {
//   const context = useContext(SessionContext);
//   if (!context) {
//     throw new Error('useSession must be used within a SessionProvider');
//   }
//   return context;
// };


'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });
      const data = await response.json();
      console.log("fetching data = ", data)
      // Support student session directly as an object
      // if (response.ok && data && data.user.role) {
      //   setUser(data.user); // data is the user (student or staff/admin)
      // } else {
      //   setUser(null);
      // }

      if (response.ok && data) {
        const userData = data.user || data; // handle both cases
        if (userData.role) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchSession(); // Refresh session after login

        // 🔄 Redirect based on role
        let redirectPath = '/dashboard'; // fallback
        if (data.user.role.toLowerCase() === 'hod') {
          redirectPath = '/hod';
        } else if (data.user.role.toLowerCase() === 'student') {
          redirectPath = '/student';
        } else if (data.user.role.toLowerCase() === 'superadmin') {
          redirectPath = '/superadmin/blogs';
        } else {
          redirectPath = `/${data.user.role}`;
        }

        router.push(redirectPath);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SessionContext.Provider
      value={{ user, loading, login, logout, refreshSession: fetchSession }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
