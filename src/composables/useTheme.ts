import { readonly, ref } from "vue";
import Cookies from "js-cookie";

type ThemeMode = "light" | "dark";

const THEME_COOKIE = "admin-theme";
const theme = ref<ThemeMode>("light");
let initialized = false;

function applyTheme(mode: ThemeMode) {
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function initializeTheme() {
  if (initialized) return;
  initialized = true;

  const cookieValue = Cookies.get(THEME_COOKIE) as ThemeMode | undefined;
  if (cookieValue === "light" || cookieValue === "dark") {
    theme.value = cookieValue;
  } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    theme.value = "dark";
  }

  applyTheme(theme.value);
}

export function useTheme() {
  initializeTheme();

  function setMode(mode: ThemeMode) {
    theme.value = mode;
    Cookies.set(THEME_COOKIE, mode, { expires: 365 });
    applyTheme(mode);
  }

  function toggleTheme() {
    setMode(theme.value === "dark" ? "light" : "dark");
  }

  return {
    theme: readonly(theme),
    toggleTheme,
    setMode,
  };
}
