/* ========================================
   Drone Fuel Calculator - Warning System
   ======================================== */

const WarningSystem = (function() {
  'use strict';

  // Warning type constants
  const WARNING_TYPES = {
    INFO: 'info',
    CAUTION: 'caution',
    WARNING: 'warning',
    ERROR: 'error'
  };

  // Warning icons
  const WARNING_ICONS = {
    info: 'ℹ️',
    caution: '⚠️',
    warning: '⚠️',
    error: '❌'
  };

  /**
   * Check for high fuel load
   * @param {number} totalFuel - Total fuel required in kg
   * @returns {Object|null} Warning object or null
   */
  function checkHighFuelLoad(totalFuel) {
    if (totalFuel > 50) {
      return {
        type: WARNING_TYPES.CAUTION,
        message: `High fuel load detected (${totalFuel.toFixed(2)} kg). Verify drone capacity and operational limitations.`
      };
    }
    return null;
  }

  /**
   * Check for excessive reserve fuel
   * @param {number} reserveFuel - Reserve fuel in kg
   * @param {number} flightFuel - Flight fuel in kg
   * @returns {Object|null} Warning object or null
   */
  function checkExcessiveReserve(reserveFuel, flightFuel) {
    if (reserveFuel > flightFuel && flightFuel > 0) {
      return {
        type: WARNING_TYPES.CAUTION,
        message: 'Reserve fuel exceeds flight fuel. Review fuel planning to ensure operational efficiency.'
      };
    }
    return null;
  }

  /**
   * Check for low reserve time
   * @param {number} finalReserve - Final reserve time in hours
   * @returns {Object|null} Warning object or null
   */
  function checkLowReserve(finalReserve) {
    if (finalReserve < 0.3 && finalReserve >= 0) {
      return {
        type: WARNING_TYPES.WARNING,
        message: `Final reserve below recommended minimum (${finalReserve.toFixed(2)} hrs). Consider increasing to at least 0.3 hours.`
      };
    }
    return null;
  }

  /**
   * Check for extended flight time
   * @param {number} flightTime - Flight time in hours
   * @returns {Object|null} Warning object or null
   */
  function checkExtendedFlight(flightTime) {
    if (flightTime > 8 && flightTime <= 12) {
      return {
        type: WARNING_TYPES.INFO,
        message: `Extended flight duration detected (${flightTime.toFixed(2)} hrs). Ensure operational feasibility and crew requirements.`
      };
    }
    return null;
  }

  /**
   * Check for excessive flight time
   * @param {number} flightTime - Flight time in hours
   * @returns {Object|null} Warning object or null
   */
  function checkExcessiveFlightTime(flightTime) {
    if (flightTime > 12) {
      return {
        type: WARNING_TYPES.CAUTION,
        message: `Flight time exceeds typical operational limits (${flightTime.toFixed(2)} hrs). Verify mission requirements and constraints.`
      };
    }
    return null;
  }

  /**
   * Check for zero reserve fuel
   * @param {number} finalReserve - Final reserve time in hours
   * @param {number} holding - Holding time in hours
   * @param {number} contingency - Contingency time in hours
   * @returns {Object|null} Warning object or null
   */
  function checkZeroReserve(finalReserve, holding, contingency) {
    const totalReserve = (finalReserve || 0) + (holding || 0) + (contingency || 0);
    if (totalReserve === 0) {
      return {
        type: WARNING_TYPES.WARNING,
        message: 'No reserve fuel allocated. This is not recommended for safe flight operations.'
      };
    }
    return null;
  }

  /**
   * Check for very high fuel rate consumption
   * @param {number} totalFuel - Total fuel in kg
   * @param {number} flightTime - Flight time in hours
   * @returns {Object|null} Warning object or null
   */
  function checkHighFuelRate(totalFuel, flightTime) {
    if (flightTime > 0) {
      const effectiveRate = totalFuel / flightTime;
      if (effectiveRate > 10) {
        return {
          type: WARNING_TYPES.INFO,
          message: `High effective fuel consumption rate (${effectiveRate.toFixed(2)} kg/hr). Review calculation inputs.`
        };
      }
    }
    return null;
  }

  /**
   * Check for very long distance
   * @param {number} distance - Distance in km
   * @returns {Object|null} Warning object or null
   */
  function checkLongDistance(distance) {
    if (distance > 1000) {
      return {
        type: WARNING_TYPES.INFO,
        message: `Long distance mission detected (${distance.toFixed(2)} km). Verify drone range and operational parameters.`
      };
    }
    return null;
  }

  /**
   * Check for speed concerns
   * @param {number} speed - Speed in m/s
   * @returns {Object|null} Warning object or null
   */
  function checkSpeedConcerns(speed) {
    if (speed > 0 && speed < 3) {
      return {
        type: WARNING_TYPES.INFO,
        message: `Very low cruise speed detected (${speed.toFixed(2)} m/s). Verify speed input is correct.`
      };
    }
    if (speed > 60) {
      return {
        type: WARNING_TYPES.INFO,
        message: `High cruise speed detected (${speed.toFixed(2)} m/s). Verify speed input and drone capabilities.`
      };
    }
    return null;
  }

  /**
   * Evaluate all warnings for given inputs and outputs
   * @param {Object} inputs - Calculation inputs
   * @param {Object} outputs - Calculation outputs
   * @returns {Array} Array of warning objects
   */
  function evaluateWarnings(inputs, outputs) {
    const warnings = [];

    // Check all warning conditions
    const checks = [
      checkHighFuelLoad(outputs.totalFuel),
      checkExcessiveReserve(outputs.reserveFuel, outputs.flightFuel),
      checkLowReserve(inputs.finalReserve),
      checkExtendedFlight(inputs.flightTime),
      checkExcessiveFlightTime(inputs.flightTime),
      checkZeroReserve(inputs.finalReserve, inputs.holding, inputs.contingency),
      checkHighFuelRate(outputs.totalFuel, inputs.flightTime),
      checkLongDistance(inputs.distance),
      checkSpeedConcerns(inputs.speed)
    ];

    // Filter out null values and add to warnings array
    checks.forEach(warning => {
      if (warning) {
        warnings.push(warning);
      }
    });

    return warnings;
  }

  /**
   * Render warnings in the DOM
   * @param {string} tabId - Tab identifier (tabA or tabB)
   * @param {Array} warnings - Array of warning objects
   */
  function renderWarnings(tabId, warnings) {
    const suffix = tabId.slice(-1).toUpperCase();
    const warningsSection = document.getElementById(`warnings${suffix}`);

    if (!warningsSection) return;

    // Clear existing warnings
    warningsSection.innerHTML = '';

    // If no warnings, hide section
    if (!warnings || warnings.length === 0) {
      warningsSection.classList.remove('has-warnings');
      return;
    }

    // Show section
    warningsSection.classList.add('has-warnings');

    // Create warning elements
    warnings.forEach(warning => {
      const alertDiv = document.createElement('div');
      alertDiv.className = `warning-alert ${warning.type}`;
      alertDiv.setAttribute('role', 'alert');

      // Create icon span
      const iconSpan = document.createElement('span');
      iconSpan.className = 'warning-icon';
      iconSpan.textContent = WARNING_ICONS[warning.type] || '⚠️';
      iconSpan.setAttribute('aria-hidden', 'true');

      // Create message div
      const messageDiv = document.createElement('div');
      messageDiv.className = 'warning-message';
      messageDiv.textContent = warning.message;

      // Append elements
      alertDiv.appendChild(iconSpan);
      alertDiv.appendChild(messageDiv);
      warningsSection.appendChild(alertDiv);
    });
  }

  /**
   * Clear warnings for a tab
   * @param {string} tabId - Tab identifier
   */
  function clearWarnings(tabId) {
    renderWarnings(tabId, []);
  }

  // Public API
  return {
    evaluateWarnings,
    renderWarnings,
    clearWarnings,
    WARNING_TYPES
  };
})();

// Make available globally
window.WarningSystem = WarningSystem;
