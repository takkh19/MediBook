const AUTH_KEY = "medibook-user";

export function getCurrentUser() {
  try {
    const savedUser = localStorage.getItem(AUTH_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
}