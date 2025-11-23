/* ========================================
   Drone Fuel Calculator - Calculation Engine
   ======================================== */

const FuelCalculator = (function() {
  'use strict';

  // Configuration Constants
  const CONFIG = {
    FUEL_RATE: 1.4, // kg/hr
    VARIABLE_RESERVE_PERCENT: 0.10, // 10%
    MIN_DISTANCE: 0.01,
    MAX_DISTANCE: 10000,
    MIN_SPEED: 0.01,
    MAX_SPEED: 140, // m/s (approximately 500 km/h)
    MIN_FLIGHT_TIME: 0.01,
    MAX_FLIGHT_TIME: 24,
    MIN_RESERVE: 0,
    MAX_FINAL_RESERVE: 5,
    MAX_HOLDING: 10,
    MAX_CONTINGENCY: 5
  };

  /**
   * Round fuel UP to 1 decimal place (client requirement)
   * @param {number} num - Number to round
   * @returns {number} Rounded number
   */
  function roundFuelUp(num) {
    if (isNaN(num) || !isFinite(num)) {
      return 0;
    }
    // Round UP to 1 decimal place
    return Math.ceil(num * 10) / 10;
  }

  /**
   * Round number to 2 decimal places (for non-fuel values like time)
   * @param {number} num - Number to round
   * @returns {number} Rounded number
   */
  function roundTo2(num) {
    if (isNaN(num) || !isFinite(num)) {
      return 0;
    }
    return Math.round(num * 100) / 100;
  }

  /**
   * Calculate flight time from distance and speed
   * @param {number} distance - Distance in km
   * @param {number} speed - Speed in m/s
   * @returns {number} Flight time in hours
   */
  function calculateFlightTime(distance, speed) {
    if (!distance || !speed || speed <= 0) {
      return 0;
    }
    // Convert: distance (km) / (speed (m/s) * 3.6) = time (hours)
    // Formula: 1 m/s = 3.6 km/h, so speed_kmh = speed_ms * 3.6
    return distance / (speed * 3.6);
  }

  /**
   * Calculate flight fuel based on flight time
   * @param {number} flightTime - Flight time in hours
   * @returns {number} Flight fuel in kg
   */
  function calculateFlightFuel(flightTime) {
    if (!flightTime || flightTime <= 0) {
      return 0;
    }
    return flightTime * CONFIG.FUEL_RATE;
  }

  /**
   * Calculate variable reserve (10% of flight fuel)
   * @param {number} flightFuel - Flight fuel in kg
   * @returns {number} Variable reserve in kg
   */
  function calculateVariableReserve(flightFuel) {
    return flightFuel * CONFIG.VARIABLE_RESERVE_PERCENT;
  }

  /**
   * Calculate reserve fuel from time allocations
   * @param {number} finalReserve - Final reserve time in hours
   * @param {number} holding - Holding time in hours
   * @param {number} contingency - Contingency time in hours
   * @returns {number} Reserve fuel in kg
   */
  function calculateReserveFuel(finalReserve, holding, contingency) {
    const totalReserveTime = (finalReserve || 0) + (holding || 0) + (contingency || 0);
    return totalReserveTime * CONFIG.FUEL_RATE;
  }

  /**
   * Validate a single input value
   * @param {string} fieldName - Name of the field
   * @param {number} value - Value to validate
   * @param {number} min - Minimum allowed value
   * @param {number} max - Maximum allowed value
   * @param {boolean} required - Is this field required?
   * @returns {Object} Validation result {valid: boolean, error: string}
   */
  function validateInput(fieldName, value, min, max, required = false) {
    // Check if required and empty
    if (required && (value === null || value === undefined || value === '')) {
      return {
        valid: false,
        error: `${fieldName} is required`
      };
    }

    // If optional and empty, it's valid
    if (!required && (value === null || value === undefined || value === '')) {
      return { valid: true, error: '' };
    }

    // Convert to number
    const numValue = parseFloat(value);

    // Check if it's a valid number
    if (isNaN(numValue)) {
      return {
        valid: false,
        error: `${fieldName} must be a valid number`
      };
    }

    // Check minimum
    if (numValue < min) {
      return {
        valid: false,
        error: `${fieldName} must be at least ${min}`
      };
    }

    // Check maximum
    if (numValue > max) {
      return {
        valid: false,
        error: `${fieldName} cannot exceed ${max}`
      };
    }

    return { valid: true, error: '' };
  }

  /**
   * Validate all inputs for calculation
   * @param {Object} inputs - Input values
   * @returns {Object} Validation result {valid: boolean, errors: Object}
   */
  function validateInputs(inputs) {
    const errors = {};
    let valid = true;

    // Validate distance (optional)
    const distanceValidation = validateInput(
      'Distance',
      inputs.distance,
      CONFIG.MIN_DISTANCE,
      CONFIG.MAX_DISTANCE,
      false
    );
    if (!distanceValidation.valid) {
      errors.distance = distanceValidation.error;
      valid = false;
    }

    // Validate speed (optional)
    const speedValidation = validateInput(
      'Cruise Speed',
      inputs.speed,
      CONFIG.MIN_SPEED,
      CONFIG.MAX_SPEED,
      false
    );
    if (!speedValidation.valid) {
      errors.speed = speedValidation.error;
      valid = false;
    }

    // Validate flight time (required)
    const flightTimeValidation = validateInput(
      'Flight Time',
      inputs.flightTime,
      CONFIG.MIN_FLIGHT_TIME,
      CONFIG.MAX_FLIGHT_TIME,
      true
    );
    if (!flightTimeValidation.valid) {
      errors.flightTime = flightTimeValidation.error;
      valid = false;
    }

    // Validate final reserve (required)
    const finalReserveValidation = validateInput(
      'Final Reserve',
      inputs.finalReserve,
      CONFIG.MIN_RESERVE,
      CONFIG.MAX_FINAL_RESERVE,
      true
    );
    if (!finalReserveValidation.valid) {
      errors.finalReserve = finalReserveValidation.error;
      valid = false;
    }

    // Validate holding (optional)
    if (inputs.holding !== null && inputs.holding !== undefined && inputs.holding !== '') {
      const holdingValidation = validateInput(
        'Holding',
        inputs.holding,
        CONFIG.MIN_RESERVE,
        CONFIG.MAX_HOLDING,
        false
      );
      if (!holdingValidation.valid) {
        errors.holding = holdingValidation.error;
        valid = false;
      }
    }

    // Validate contingency (optional)
    if (inputs.contingency !== null && inputs.contingency !== undefined && inputs.contingency !== '') {
      const contingencyValidation = validateInput(
        'Contingency',
        inputs.contingency,
        CONFIG.MIN_RESERVE,
        CONFIG.MAX_CONTINGENCY,
        false
      );
      if (!contingencyValidation.valid) {
        errors.contingency = contingencyValidation.error;
        valid = false;
      }
    }

    return { valid, errors };
  }

  /**
   * Main calculation function
   * @param {Object} inputs - Input values {distance, speed, flightTime, finalReserve, holding, contingency}
   * @returns {Object} Calculation results or error
   */
  function calculate(inputs) {
    // Validate inputs
    const validation = validateInputs(inputs);
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    // Parse inputs
    const distance = parseFloat(inputs.distance) || 0;
    const speed = parseFloat(inputs.speed) || 0;
    let flightTime = parseFloat(inputs.flightTime) || 0;
    const finalReserve = parseFloat(inputs.finalReserve) || 0;
    const holding = parseFloat(inputs.holding) || 0;
    const contingency = parseFloat(inputs.contingency) || 0;

    // Calculate flight time from distance and speed if provided
    let calculatedFlightTime = null;
    if (distance > 0 && speed > 0) {
      calculatedFlightTime = calculateFlightTime(distance, speed);
      // If user hasn't entered flight time manually, use calculated
      if (!inputs.flightTime || parseFloat(inputs.flightTime) === 0) {
        flightTime = calculatedFlightTime;
      }
    }

    // Calculate fuel components (all rounded UP to 1 decimal place per client requirement)
    const flightFuel = roundFuelUp(calculateFlightFuel(flightTime));
    const variableReserve = roundFuelUp(calculateVariableReserve(flightFuel));
    const reserveFuel = roundFuelUp(calculateReserveFuel(finalReserve, holding, contingency));
    const totalFuel = roundFuelUp(flightFuel + variableReserve + reserveFuel);

    // Return results
    return {
      success: true,
      inputs: {
        distance: roundTo2(distance),
        speed: roundTo2(speed),
        flightTime: roundTo2(flightTime),
        finalReserve: roundTo2(finalReserve),
        holding: roundTo2(holding),
        contingency: roundTo2(contingency)
      },
      outputs: {
        flightFuel: flightFuel,
        variableReserve: variableReserve,
        reserveFuel: reserveFuel,
        totalFuel: totalFuel
      },
      metadata: {
        fuelRate: CONFIG.FUEL_RATE,
        calculatedFlightTime: calculatedFlightTime ? roundTo2(calculatedFlightTime) : null,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Get configuration constants
   * @returns {Object} Configuration object
   */
  function getConfig() {
    return { ...CONFIG };
  }

  // Public API
  return {
    calculate,
    calculateFlightTime,
    calculateFlightFuel,
    calculateVariableReserve,
    calculateReserveFuel,
    validateInputs,
    getConfig,
    roundTo2
  };
})();

// Make available globally
window.FuelCalculator = FuelCalculator;
