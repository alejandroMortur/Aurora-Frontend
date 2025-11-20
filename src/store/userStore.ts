/**
 * User Global State Store
 * 
 * Jotai atom for managing user authentication state across the entire application.
 * Persists user login status and profile information globally.
 * 
 * Jotai is a lightweight state management library that provides reactive atoms
 * for managing state without the overhead of Redux or Context API.
 */

import { atom } from 'jotai';
import type { Profile } from '@/models/UserProps';

/**
 * User State Atom
 * 
 * Global reactive state for authentication and user profile.
 * Updated when:
 * - User logs in (set loggedIn=true, store user profile)
 * - User logs out (set loggedIn=false, clear user data)
 * - User profile is fetched (update user object)
 * 
 * @type {Atom<{loggedIn: boolean, user: Profile | null}>}
 * 
 * @property {boolean} loggedIn - Authentication status flag
 * @property {Profile | null} user - User profile data (null if not authenticated)
 * 
 * @example
 * // In a component:
 * import { useAtom } from 'jotai';
 * const [user, setUser] = useAtom(userStore);
 * 
 * // Check if user is logged in
 * if (user.loggedIn) {
 *   console.log("User ID:", user.user?.id);
 * }
 * 
 * // Login user
 * setUser({ loggedIn: true, user: { id: 1, email: "test@example.com", rolId: 1 } });
 * 
 * // Logout user
 * setUser({ loggedIn: false, user: null });
 */
export const userStore = atom<{ loggedIn: boolean; user: Profile | null }>({
  loggedIn: false,
  user: null,
});

