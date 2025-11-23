/* ========================================
   Drone Fuel Calculator - Theme Switcher
   ======================================== */

const ThemeManager = (function() {
  'use strict';

  const STORAGE_KEY = 'drone-calc-theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  /**
   * Get stored theme preference or system preference
   * @returns {string} Theme name ('light' or 'dark')
   */
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME_DARK;
    }

    return THEME_LIGHT;
  }

  /**
   * Apply theme to document
   * @param {string} theme - Theme name ('light' or 'dark')
   */
  function applyTheme(theme) {
    if (theme === THEME_DARK) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Save preference
    localStorage.setItem(STORAGE_KEY, theme);

    // Update toggle button
    updateToggleButton(theme);
  }

  /**
   * Update toggle button appearance
   * @param {string} theme - Current theme
   */
  function updateToggleButton(theme) {
    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');

    if (!icon || !label) return;

    if (theme === THEME_DARK) {
      icon.textContent = '☀️';
      label.textContent = 'Light';
    } else {
      icon.textContent = '🌙';
      label.textContent = 'Dark';
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.hasAttribute('data-theme') ? THEME_DARK : THEME_LIGHT;
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(newTheme);
  }

  /**
   * Initialize theme manager
   */
  function init() {
    // Apply stored/preferred theme immediately
    const preferredTheme = getPreferredTheme();
    applyTheme(preferredTheme);

    // Setup toggle button
    const toggleButton = document.getElementById('themeToggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
        }
      });
    }

    console.log('Theme Manager initialized:', preferredTheme);
  }

  // Public API
  return {
    init,
    toggleTheme,
    applyTheme,
    getPreferredTheme
  };
})();

// Initialize theme immediately (before DOM ready to prevent flash)
if (document.readyState === 'loading') {
  // Apply theme immediately from storage to prevent flash
  const storedTheme = localStorage.getItem('drone-calc-theme');
  if (storedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  document.addEventListener('DOMContentLoaded', ThemeManager.init);
} else {
  ThemeManager.init();
}

// Make available globally
window.ThemeManager = ThemeManager;
