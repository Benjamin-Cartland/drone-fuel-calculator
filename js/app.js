/* ========================================
   Drone Fuel Calculator - Main Application
   ======================================== */

const App = (function() {
  'use strict';

  let calculationTimeouts = {};

  /**
   * Get form inputs for a tab
   * @param {string} tabId - Tab identifier
   * @returns {Object} Input values
   */
  function getFormInputs(tabId) {
    const form = document.getElementById(`form${tabId.slice(-1).toUpperCase()}`);
    if (!form) return null;

    return {
      distance: parseFloat(form.querySelector('[name="distance"]').value) || 0,
      speed: parseFloat(form.querySelector('[name="speed"]').value) || 0,
      flightTime: parseFloat(form.querySelector('[name="flightTime"]').value) || 0,
      finalReserve: parseFloat(form.querySelector('[name="finalReserve"]').value) || 0,
      holding: parseFloat(form.querySelector('[name="holding"]').value) || 0,
      contingency: parseFloat(form.querySelector('[name="contingency"]').value) || 0
    };
  }

  /**
   * Update output displays
   * @param {string} tabId - Tab identifier
   * @param {Object} outputs - Output values
   */
  function updateOutputs(tabId, outputs) {
    const suffix = tabId.slice(-1).toUpperCase();

    document.getElementById(`flightFuel${suffix}`).textContent = outputs.flightFuel.toFixed(2);
    document.getElementById(`variableReserve${suffix}`).textContent = outputs.variableReserve.toFixed(2);
    document.getElementById(`reserveFuel${suffix}`).textContent = outputs.reserveFuel.toFixed(2);
    document.getElementById(`totalFuel${suffix}`).textContent = outputs.totalFuel.toFixed(2);
  }

  /**
   * Clear output displays
   * @param {string} tabId - Tab identifier
   */
  function clearOutputs(tabId) {
    const suffix = tabId.slice(-1).toUpperCase();

    document.getElementById(`flightFuel${suffix}`).textContent = '0.00';
    document.getElementById(`variableReserve${suffix}`).textContent = '0.00';
    document.getElementById(`reserveFuel${suffix}`).textContent = '0.00';
    document.getElementById(`totalFuel${suffix}`).textContent = '0.00';
  }

  /**
   * Display validation errors
   * @param {string} tabId - Tab identifier
   * @param {Object} errors - Error messages keyed by field name
   */
  function displayErrors(tabId, errors) {
    const suffix = tabId.slice(-1).toUpperCase();

    // Clear all previous errors
    const form = document.getElementById(`form${suffix}`);
    form.querySelectorAll('.error-message').forEach(el => {
      el.classList.remove('show');
      el.textContent = '';
    });

    form.querySelectorAll('.calc-input').forEach(input => {
      input.classList.remove('error');
    });

    // Display new errors
    Object.keys(errors).forEach(field => {
      const input = form.querySelector(`[name="${field}"]`);
      const errorEl = document.getElementById(`${field}${suffix}-error`);

      if (input) {
        input.classList.add('error');
      }

      if (errorEl) {
        errorEl.textContent = errors[field];
        errorEl.classList.add('show');
      }
    });
  }

  /**
   * Clear validation errors
   * @param {string} tabId - Tab identifier
   */
  function clearErrors(tabId) {
    displayErrors(tabId, {});
  }

  /**
   * Update calculated flight time indicator
   * @param {string} tabId - Tab identifier
   * @param {number|null} calculatedTime - Calculated flight time
   */
  function updateCalculatedFlightTime(tabId, calculatedTime) {
    const suffix = tabId.slice(-1).toUpperCase();
    const indicator = document.getElementById(`flightTime${suffix}-calculated`);

    if (!indicator) return;

    if (calculatedTime && calculatedTime > 0) {
      indicator.textContent = `Calculated from distance & speed: ${calculatedTime.toFixed(2)} hrs`;
      indicator.style.display = 'block';
    } else {
      indicator.textContent = '';
      indicator.style.display = 'none';
    }
  }

  /**
   * Auto-calculate flight time from distance and speed
   * @param {string} tabId - Tab identifier
   */
  function autoCalculateFlightTime(tabId) {
    const inputs = getFormInputs(tabId);
    if (!inputs) return;

    // If distance and speed are provided, calculate flight time
    if (inputs.distance > 0 && inputs.speed > 0) {
      const calculatedTime = FuelCalculator.calculateFlightTime(inputs.distance, inputs.speed);
      const suffix = tabId.slice(-1).toUpperCase();
      const flightTimeInput = document.getElementById(`flightTime${suffix}`);

      // Only auto-fill if flight time is empty or zero
      if (flightTimeInput && (!inputs.flightTime || inputs.flightTime === 0)) {
        flightTimeInput.value = calculatedTime.toFixed(2);
      }

      // Show calculated indicator
      updateCalculatedFlightTime(tabId, calculatedTime);
    } else {
      updateCalculatedFlightTime(tabId, null);
    }
  }

  /**
   * Handle calculation for a tab (debounced)
   * @param {string} tabId - Tab identifier
   */
  function handleCalculation(tabId) {
    // Clear existing timeout
    if (calculationTimeouts[tabId]) {
      clearTimeout(calculationTimeouts[tabId]);
    }

    // Debounce calculation by 300ms
    calculationTimeouts[tabId] = setTimeout(() => {
      performCalculation(tabId);
    }, 300);
  }

  /**
   * Perform the actual calculation
   * @param {string} tabId - Tab identifier
   */
  function performCalculation(tabId) {
    // Get inputs
    const inputs = getFormInputs(tabId);
    if (!inputs) return;

    // Clear previous errors
    clearErrors(tabId);

    // Perform calculation
    const result = FuelCalculator.calculate(inputs);

    if (result.success) {
      // Update outputs
      updateOutputs(tabId, result.outputs);

      // Save to storage
      TabManager.saveTabInputs(tabId, result.inputs);
      TabManager.saveTabOutputs(tabId, result.outputs);

      // Evaluate and display warnings
      const warnings = WarningSystem.evaluateWarnings(result.inputs, result.outputs);
      WarningSystem.renderWarnings(tabId, warnings);

      // Update compare button state
      TabManager.updateCompareButton();
    } else {
      // Display validation errors
      displayErrors(tabId, result.errors);

      // Clear outputs if there are errors
      clearOutputs(tabId);

      // Clear warnings
      WarningSystem.clearWarnings(tabId);
    }
  }

  /**
   * Setup input event listeners for a form
   * @param {string} tabId - Tab identifier
   */
  function setupFormListeners(tabId) {
    const form = document.getElementById(`form${tabId.slice(-1).toUpperCase()}`);
    if (!form) return;

    // Listen to all input changes
    form.querySelectorAll('.calc-input').forEach(input => {
      // Real-time calculation on input
      input.addEventListener('input', () => {
        // Auto-calculate flight time if distance or speed changes
        const inputName = input.getAttribute('name');
        if (inputName === 'distance' || inputName === 'speed') {
          autoCalculateFlightTime(tabId);
        }

        // Trigger calculation
        handleCalculation(tabId);
      });

      // Clear error styling on focus
      input.addEventListener('focus', () => {
        input.classList.remove('error');
        const suffix = tabId.slice(-1).toUpperCase();
        const errorEl = document.getElementById(`${input.name}${suffix}-error`);
        if (errorEl) {
          errorEl.classList.remove('show');
        }
      });
    });

    // Prevent form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }

  /**
   * Initialize the application
   */
  function init() {
    // Initialize all modules
    TabManager.init();
    ComparisonMode.init();
    ExportManager.init();

    // Setup form listeners for both tabs
    setupFormListeners('tabA');
    setupFormListeners('tabB');

    // Load saved states and perform initial calculations
    ['tabA', 'tabB'].forEach(tabId => {
      const state = TabManager.getTabState(tabId);
      if (state.inputs) {
        // State will be loaded by TabManager.init()
        // Trigger calculation to update displays
        setTimeout(() => {
          performCalculation(tabId);
        }, 100);
      }
    });

    // Update compare button state
    TabManager.updateCompareButton();

    console.log('Drone Fuel Calculator initialized successfully');
  }

  /**
   * Public API
   */
  return {
    init,
    handleCalculation,
    performCalculation,
    getFormInputs
  };
})();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}

// Make App available globally
window.App = App;
