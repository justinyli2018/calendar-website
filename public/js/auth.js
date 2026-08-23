import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { auth } from "./firebase-init.js";

const authView = document.getElementById("auth-view");
const appShell = document.getElementById("app-shell");
const authForm = document.getElementById("auth-form");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authError = document.getElementById("auth-error");
const authSubmit = document.getElementById("auth-submit");
const authToggle = document.getElementById("auth-toggle");
const signOutButton = document.getElementById("sign-out-button");

let mode = "sign-in";

function applyMode() {
  authError.textContent = "";
  if (mode === "sign-in") {
    authSubmit.textContent = "Sign In";
    authToggle.textContent = "Need an account? Sign up";
  } else {
    authSubmit.textContent = "Create Account";
    authToggle.textContent = "Already have an account? Sign in";
  }
}

authToggle.addEventListener("click", () => {
  mode = mode === "sign-in" ? "sign-up" : "sign-in";
  applyMode();
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authError.textContent = "";
  const email = authEmail.value.trim();
  const password = authPassword.value;

  try {
    if (mode === "sign-in") {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }
    authForm.reset();
  } catch (error) {
    authError.textContent = error.message;
  }
});

signOutButton.addEventListener("click", () => {
  signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  const signedIn = Boolean(user);
  authView.classList.toggle("hidden", signedIn);
  appShell.classList.toggle("hidden", !signedIn);
  window.dispatchEvent(new CustomEvent("authchange", { detail: { user } }));
});

applyMode();
