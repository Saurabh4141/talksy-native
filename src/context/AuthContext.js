import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Context
 */
const AuthContext = createContext(null);

/**
 * Provider
 */
export function AuthProvider({ children }) {
  /**
   * State
   */
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  /**
   * Restore auth session
   */
  useEffect(() => {
    restoreSession();
  }, []);

  /**
   * Restore persisted auth
   */
  async function restoreSession() {
    try {
      const storedToken = await AsyncStorage.getItem('access_token');

      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);

        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.log('restoreSession error:', err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Login
   */
  async function login({ token, user }) {
    try {
      /**
       * Persist storage
       */
      await AsyncStorage.setItem('access_token', token);

      await AsyncStorage.setItem('user', JSON.stringify(user));

      /**
       * Update state
       */
      setToken(token);

      setUser(user);
    } catch (err) {
      console.log('login error:', err);

      throw err;
    }
  }

  /**
   * Logout
   */
  async function logout() {
    try {
      /**
       * Clear storage
       */
      await AsyncStorage.removeItem('access_token');

      await AsyncStorage.removeItem('user');

      /**
       * Reset state
       */
      setToken(null);

      setUser(null);
    } catch (err) {
      console.log('logout error:', err);
    }
  }

  /**
   * Update user
   */
  async function updateUser(updatedUser) {
    try {
      await AsyncStorage.setItem(
        'user',
        JSON.stringify(updatedUser),
      );

      setUser(updatedUser);
    } catch (err) {
      console.log('updateUser error:', err);

      throw err;
    }
  }

  /**
   * Memoized value
   */
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      authenticated: !!token,
      login,
      logout,
      updateUser,
    }),
    [user, token, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };