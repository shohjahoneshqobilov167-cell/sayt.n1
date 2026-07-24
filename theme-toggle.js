// Light/Dark theme switching helper

(function() {
  const THEME_KEY = 'level_test_theme';
  
  // Get active theme
  function getTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Set theme to HTML node
  const activeTheme = getTheme();
  document.documentElement.setAttribute('data-theme', activeTheme);
  
  // Once the page finishes loading, wire up UI triggers
  document.addEventListener('DOMContentLoaded', () => {
    const togglers = document.querySelectorAll('.theme-toggle');
    
    togglers.forEach(btn => {
      // Sync initial icon state
      updateToggleIcon(btn, getTheme());
      
      btn.addEventListener('click', () => {
        const current = getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        
        localStorage.setItem(THEME_KEY, next);
        document.documentElement.setAttribute('data-theme', next);
        
        // Update all togglers in page
        document.querySelectorAll('.theme-toggle').forEach(b => {
          updateToggleIcon(b, next);
        });
      });
    });
  });
  
  // Helper to adjust icon based on active theme
  function updateToggleIcon(btn, theme) {
    if (theme === 'dark') {
      // Show sun icon for switching to light mode
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      btn.setAttribute('aria-label', 'Light mode-ga o\'tish');
    } else {
      // Show moon icon for switching to dark mode
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      btn.setAttribute('aria-label', 'Dark mode-ga o\'tish');
    }
  }
})();

