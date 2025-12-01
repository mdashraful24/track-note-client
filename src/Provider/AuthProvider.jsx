import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import auth from "../firebase/firebase.config";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();

  // Add additional scopes if needed
  provider.addScope('profile');
  provider.addScope('email');

  // Set custom parameters for the popup
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  // signIn with Google with better error handling
  const signInWithGoogle = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, provider);

      // success toast here
      toast.success("Login successful!");

      return result;
    } catch (error) {
      console.error("Error during Google sign-in:", error);

      if (error.code === "auth/popup-blocked") {
        toast.error("Popup was blocked. Please allow popups for this site.");
      } else if (error.code === "auth/popup-closed-by-user") {
        console.log("User closed the popup.");
      } else {
        toast.error(`Sign-in error: ${error.message}`);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // sign out
  const logOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Error during sign-out:", error);
      toast.error("Failed to log out.");
    } finally {
      setLoading(false);
    }
  };

  // observer
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const userInfo = {
    user,
    loading,
    signInWithGoogle,
    logOut,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
