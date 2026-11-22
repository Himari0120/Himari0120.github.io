
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Firebase ConsoleのfirebaseConfigの値を入力
const firebaseConfig = {
  apiKey: "AIzaSyAHBBSLoY7MXm5tsRutRB1apWiypzHI7xI",
  authDomain: "otoku-navigation-operator.firebaseapp.com",
  projectId: "otoku-navigation-operator",
  appId: "1:622260066513:web:d2ac3bf03562918a5f4df0",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export const initializeAuth = {
  async initialize() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();

        resolve({
          authenticated: !!user,
          user: user ? {
            email: user.email,
            uid: user.uid
          } : null,
          status: user ? "AUTHENTICATED" : "UNAUTHENTICATED"
        });
      });
    });
  },

  async login(email, password) {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      user: result.user
    };
  },

  async logout() {
    await signOut(auth);

    return {
      success: true,
      status: "UNAUTHENTICATED"
    };
  },

  isAuthenticated() {
    return !!auth.currentUser;
  },

  getStatus() {
    return auth.currentUser
      ? "AUTHENTICATED"
      : "UNAUTHENTICATED";
  },

  getCurrentUser() {
    return auth.currentUser;
  }
};
