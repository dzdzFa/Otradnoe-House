import { ref, computed } from "vue";

const user = ref(null);
const token = ref(localStorage.getItem("otradnoe_token") || null);

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const currentUser = computed(() => user.value);

  const initialize = () => {
    const storedToken = localStorage.getItem("otradnoe_token");
    const storedUser = localStorage.getItem("otradnoe_user");
    if (storedToken && storedUser) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
      } catch (error) {
        logout();
      }
    }
  };

  const login = async (credentials) => {
    try {
      const users = JSON.parse(localStorage.getItem("otradnoe_users") || "[]");
      const foundUser = users.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password,
      );

      if (foundUser) {
        const newToken = "demo_token_" + Date.now();
        token.value = newToken;
        user.value = foundUser;
        localStorage.setItem("otradnoe_token", newToken);
        localStorage.setItem("otradnoe_user", JSON.stringify(foundUser));
        return { success: true, user: foundUser };
      } else {
        throw new Error("Неверный email или пароль");
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem("otradnoe_users") || "[]");
      const existingUser = users.find((u) => u.email === userData.email);

      if (existingUser) {
        throw new Error("Пользователь с таким email уже существует");
      }

      const newUser = {
        id: Date.now(),
        ...userData,
        createdAt: new Date().toISOString(),
        role: "user",
      };

      users.push(newUser);
      localStorage.setItem("otradnoe_users", JSON.stringify(users));

      const newToken = "demo_token_" + Date.now();
      token.value = newToken;
      user.value = newUser;
      localStorage.setItem("otradnoe_token", newToken);
      localStorage.setItem("otradnoe_user", JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("otradnoe_token");
    localStorage.removeItem("otradnoe_user");
  };

  const checkAuth = () => {
    const storedToken = localStorage.getItem("otradnoe_token");
    const storedUser = localStorage.getItem("otradnoe_user");
    if (storedToken && storedUser) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
        return true;
      } catch (error) {
        logout();
        return false;
      }
    }
    return false;
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    currentUser,
    initialize,
    login,
    register,
    logout,
    checkAuth,
  };
}
