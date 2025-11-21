/* ========================================
   Drone Fuel Calculator - Tab Management
   ======================================== */

const TabManager = (function() {
  'use strict';

  const STORAGE_KEY = 'drone-fuel-calc';
  let activeTab = 'tabA';
  let debounceTimer = null;

  /**
   * Get data from localStorage
   * @returns {Object} Stored data or empty object
   */
  function getStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to parse localStorage:', e);
      return {};
    }
  }

  /**
   * Save data to localStorage (debounced)
   * @param {Object} data - Data to save
   */
  function saveStorage(data) {
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Debounce save by 500ms
    debounceTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
        // Handle quota exceeded or other errors
        if (e.name === 'QuotaExceededError') {
          alert('Storage quota exceeded. Some data may not be saved.');
        }
      }
    }, 500);
  }

  /**
   * Get tab state from storage
   * @param {string} tabId - Tab identifier (tabA or tabB)
   * @returns {Object} Tab state or empty object
   */
  function getTabState(tabId) {
    const storage = getStorage();
    return storage[tabId] || {};
  }

  /**
   * Save tab state to storage
   * @param {string} tabId - Tab identifier
   * @param {Object} state - State to save
   */
  function saveTabState(tabId, state) {
    const storage = getStorage();
    storage[tabId] = {
      ...storage[tabId],
      ...state,
      lastModified: new Date().toISOString()
    };
    saveStorage(storage);
  }

  /**
   * Get active tab ID
   * @returns {string} Active tab identifier
   */
  function getActiveTab() {
    return activeTab;
  }

  /**
   * Switch to a different tab
   * @param {string} tabId - Tab identifier to switch to
   */
  function switchTab(tabId) {
    // Deactivate all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    // Activate selected tab
    const tabBtn = document.querySelector(`[data-tab="${tabId}"]`);
    const tabContent = document.getElementById(tabId);

    if (tabBtn && tabContent) {
      tabBtn.classList.add('active');
      tabBtn.setAttribute('aria-selected', 'true');
      tabContent.classList.add('active');
      activeTab = tabId;

      // Save active tab to storage
      const storage = getStorage();
      storage.activeTab = tabId;
      saveStorage(storage);

      // Load tab state
      loadTabState(tabId);
    }
  }

  /**
   * Get tab name from storage or default
   * @param {string} tabId - Tab identifier
   * @returns {string} Tab name
   */
  function getTabName(tabId) {
    const state = getTabState(tabId);
    return state.name || (tabId === 'tabA' ? 'Calculation A' : 'Calculation B');
  }

  /**
   * Set tab name
   * @param {string} tabId - Tab identifier
   * @param {string} name - New tab name
   */
  function setTabName(tabId, name) {
    // Update UI
    const tabBtn = document.querySelector(`[data-tab="${tabId}"] .tab-name`);
    if (tabBtn) {
      tabBtn.textContent = name;
    }

    // Save to storage
    saveTabState(tabId, { name });
  }

  /**
   * Load tab state from storage and populate form
   * @param {string} tabId - Tab identifier
   */
  function loadTabState(tabId) {
    const state = getTabState(tabId);

    if (!state.inputs) return;

    // Get form element
    const form = document.getElementById(`form${tabId.slice(-1).toUpperCase()}`);
    if (!form) return;

    // Populate inputs
    Object.keys(state.inputs).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input && state.inputs[key] !== null && state.inputs[key] !== undefined) {
        input.value = state.inputs[key];
      }
    });

    // Trigger calculation to update outputs
    if (window.App && window.App.handleCalculation) {
      window.App.handleCalculation(tabId);
    }
  }

  /**
   * Save tab inputs to storage
   * @param {string} tabId - Tab identifier
   * @param {Object} inputs - Input values to save
   */
  function saveTabInputs(tabId, inputs) {
    saveTabState(tabId, { inputs });
  }

  /**
   * Save tab outputs to storage
   * @param {string} tabId - Tab identifier
   * @param {Object} outputs - Output values to save
   */
  function saveTabOutputs(tabId, outputs) {
    saveTabState(tabId, { outputs });
  }

  /**
   * Clear tab state
   * @param {string} tabId - Tab identifier
   */
  function clearTab(tabId) {
    // Clear from storage
    const storage = getStorage();
    if (storage[tabId]) {
      // Keep the tab name
      const name = storage[tabId].name;
      storage[tabId] = name ? { name } : {};
      saveStorage(storage);
    }

    // Clear form
    const form = document.getElementById(`form${tabId.slice(-1).toUpperCase()}`);
    if (form) {
      form.reset();

      // Reset to default values
      const finalReserveInput = form.querySelector('[name="finalReserve"]');
      if (finalReserveInput) {
        finalReserveInput.value = '0.5';
      }
    }

    // Clear outputs
    const suffix = tabId.slice(-1).toUpperCase();
    document.getElementById(`flightFuel${suffix}`).textContent = '0.00';
    document.getElementById(`variableReserve${suffix}`).textContent = '0.00';
    document.getElementById(`reserveFuel${suffix}`).textContent = '0.00';
    document.getElementById(`totalFuel${suffix}`).textContent = '0.00';

    // Clear warnings
    const warningsSection = document.getElementById(`warnings${suffix}`);
    if (warningsSection) {
      warningsSection.innerHTML = '';
      warningsSection.classList.remove('has-warnings');
    }

    // Clear calculated flight time indicator
    const calculatedIndicator = document.getElementById(`flightTime${suffix}-calculated`);
    if (calculatedIndicator) {
      calculatedIndicator.textContent = '';
    }
  }

  /**
   * Initialize tab system
   */
  function init() {
    // Load saved active tab
    const storage = getStorage();
    if (storage.activeTab) {
      activeTab = storage.activeTab;
    }

    // Set tab names from storage
    ['tabA', 'tabB'].forEach(tabId => {
      const name = getTabName(tabId);
      const tabBtn = document.querySelector(`[data-tab="${tabId}"] .tab-name`);
      if (tabBtn) {
        tabBtn.textContent = name;
      }
    });

    // Setup tab click handlers
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabId = btn.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

    // Setup tab name editing (double-click to edit)
    document.querySelectorAll('.tab-name').forEach(nameEl => {
      nameEl.addEventListener('dblclick', () => {
        nameEl.setAttribute('contenteditable', 'true');
        nameEl.focus();

        // Select all text
        const range = document.createRange();
        range.selectNodeContents(nameEl);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      });

      nameEl.addEventListener('blur', () => {
        nameEl.setAttribute('contenteditable', 'false');
        const tabBtn = nameEl.closest('.tab-btn');
        const tabId = tabBtn.getAttribute('data-tab');
        const newName = nameEl.textContent.trim();

        if (newName) {
          setTabName(tabId, newName);
        } else {
          // Restore original name if empty
          nameEl.textContent = getTabName(tabId);
        }
      });

      nameEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          nameEl.blur();
        } else if (e.key === 'Escape') {
          // Restore original name and cancel edit
          const tabBtn = nameEl.closest('.tab-btn');
          const tabId = tabBtn.getAttribute('data-tab');
          nameEl.textContent = getTabName(tabId);
          nameEl.blur();
        }
      });
    });

    // Setup clear button handlers
    document.querySelectorAll('.clear-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        if (confirm('Clear all inputs and outputs for this calculation?')) {
          clearTab(tabId);
        }
      });
    });

    // Activate initial tab
    switchTab(activeTab);
  }

  /**
   * Check if both tabs have calculations
   * @returns {boolean} True if both tabs have outputs
   */
  function bothTabsHaveCalculations() {
    const storageA = getTabState('tabA');
    const storageB = getTabState('tabB');

    return !!(
      storageA.outputs &&
      storageB.outputs &&
      storageA.outputs.totalFuel > 0 &&
      storageB.outputs.totalFuel > 0
    );
  }

  /**
   * Update compare button state
   */
  function updateCompareButton() {
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
      compareBtn.disabled = !bothTabsHaveCalculations();
    }
  }

  // Public API
  return {
    init,
    getActiveTab,
    switchTab,
    getTabName,
    setTabName,
    getTabState,
    saveTabState,
    saveTabInputs,
    saveTabOutputs,
    clearTab,
    loadTabState,
    bothTabsHaveCalculations,
    updateCompareButton
  };
})();

// Make available globally
window.TabManager = TabManager;
