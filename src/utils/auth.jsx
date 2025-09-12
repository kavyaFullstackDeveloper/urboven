
export function login(user) {
  localStorage.setItem("user", JSON.stringify(user));
}


export function logout() {
  localStorage.removeItem("user");
}


export function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}


export function isLoggedIn() {
  return !!getUser();
}
