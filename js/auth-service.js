// js/auth-service.js

/**
 * Authenticates a user with email and password.
 * Replace the placeholder promise with Firebase/Supabase SDK calls later.
 */
export async function loginUser(email, password) {
  console.log("Authenticating user:", email);

  // Simulated API call (replace with SDK authentication)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password.length >= 6) {
        resolve({ success: true, email });
      } else {
        reject(new Error("Invalid email or password (minimum 6 characters)."));
      }
    }, 800);
  });
}

/**
 * Triggers a password reset link to the provided email.
 */
export async function resetPassword(email) {
  console.log("Sending password reset email to:", email);

  // Simulated API call (replace with SDK reset trigger)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email) {
        resolve({ success: true });
      } else {
        reject(new Error("Please enter a valid email address."));
      }
    }, 800);
  });
}
