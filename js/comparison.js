/* ========================================
   Drone Fuel Calculator - Comparison Mode
   ======================================== */

const ComparisonMode = (function() {
  'use strict';

  let isComparisonActive = false;

  /**
   * Calculate difference between two values
   * @param {number} valueA - First value
   * @param {number} valueB - Second value
   * @returns {Object} Difference information
   */
  function calculateDifference(valueA, valueB) {
    const absolute = valueB - valueA;
    const percent = valueA !== 0 ? ((absolute / valueA) * 100) : 0;

    return {
      absolute: FuelCalculator.roundTo2(absolute),
      percent: FuelCalculator.roundTo2(percent),
      formatted: formatDifference(absolute, percent)
    };
  }

  /**
   * Format difference for display
   * @param {number} absolute - Absolute difference
   * @param {number} percent - Percentage difference
   * @returns {string} Formatted string
   */
  function formatDifference(absolute, percent) {
    const sign = absolute >= 0 ? '+' : '';
    const absRounded = FuelCalculator.roundTo2(absolute);
    const pctRounded = FuelCalculator.roundTo2(percent);
    return `${sign}${absRounded} (${sign}${pctRounded}%)`;
  }

  /**
   * Compare two calculations
   * @param {Object} stateA - State of calculation A
   * @param {Object} stateB - State of calculation B
   * @returns {Object} Comparison data
   */
  function compareCalculations(stateA, stateB) {
    if (!stateA.outputs || !stateB.outputs) {
      return null;
    }

    const comparison = {
      names: {
        a: stateA.name || 'Calculation A',
        b: stateB.name || 'Calculation B'
      },
      inputs: {},
      outputs: {}
    };

    // Compare inputs
    const inputFields = ['distance', 'speed', 'flightTime', 'finalReserve', 'holding', 'contingency'];
    inputFields.forEach(field => {
      const valA = stateA.inputs?.[field] || 0;
      const valB = stateB.inputs?.[field] || 0;

      comparison.inputs[field] = {
        a: valA,
        b: valB,
        diff: calculateDifference(valA, valB)
      };
    });

    // Compare outputs
    const outputFields = ['flightFuel', 'variableReserve', 'reserveFuel', 'totalFuel'];
    outputFields.forEach(field => {
      const valA = stateA.outputs?.[field] || 0;
      const valB = stateB.outputs?.[field] || 0;

      comparison.outputs[field] = {
        a: valA,
        b: valB,
        diff: calculateDifference(valA, valB)
      };
    });

    return comparison;
  }

  /**
   * Render comparison row
   * @param {string} label - Label for the row
   * @param {number} value - Value to display
   * @param {string} unit - Unit of measurement
   * @param {Object} diff - Difference object (optional)
   * @returns {HTMLElement} Row element
   */
  function createComparisonRow(label, value, unit, diff = null) {
    const row = document.createElement('div');
    row.className = 'comparison-row';

    const labelDiv = document.createElement('div');
    labelDiv.className = 'comparison-label';
    labelDiv.textContent = label;

    const valueDiv = document.createElement('div');
    valueDiv.className = 'comparison-value';
    valueDiv.textContent = `${value.toFixed(2)} ${unit}`;

    row.appendChild(labelDiv);
    row.appendChild(valueDiv);

    // Add difference if provided
    if (diff && (diff.absolute !== 0)) {
      const diffDiv = document.createElement('div');
      diffDiv.className = 'comparison-value difference';
      diffDiv.textContent = diff.formatted;
      diffDiv.style.gridColumn = '1 / -1';
      diffDiv.style.textAlign = 'right';
      diffDiv.style.marginTop = '4px';

      row.appendChild(diffDiv);
    }

    return row;
  }

  /**
   * Render comparison view
   * @param {Object} comparison - Comparison data
   */
  function renderComparison(comparison) {
    if (!comparison) {
      alert('Unable to compare calculations. Please ensure both tabs have valid calculations.');
      return;
    }

    // Update titles
    document.getElementById('comparisonTitleA').textContent = comparison.names.a;
    document.getElementById('comparisonTitleB').textContent = comparison.names.b;

    // Render Column A
    const columnA = document.getElementById('comparisonDataA');
    columnA.innerHTML = '';

    // Inputs for A
    const inputsSectionA = document.createElement('div');
    inputsSectionA.innerHTML = '<h4 style="margin-top: 16px; margin-bottom: 8px; font-size: 14px; color: #64748b;">Inputs</h4>';
    inputsSectionA.appendChild(createComparisonRow('Distance', comparison.inputs.distance.a, 'km'));
    if (comparison.inputs.speed.a > 0) {
      inputsSectionA.appendChild(createComparisonRow('Cruise Speed', comparison.inputs.speed.a, 'km/h'));
    }
    inputsSectionA.appendChild(createComparisonRow('Flight Time', comparison.inputs.flightTime.a, 'hrs'));
    inputsSectionA.appendChild(createComparisonRow('Final Reserve', comparison.inputs.finalReserve.a, 'hrs'));
    inputsSectionA.appendChild(createComparisonRow('Holding', comparison.inputs.holding.a, 'hrs'));
    inputsSectionA.appendChild(createComparisonRow('Contingency', comparison.inputs.contingency.a, 'hrs'));
    columnA.appendChild(inputsSectionA);

    // Outputs for A
    const outputsSectionA = document.createElement('div');
    outputsSectionA.innerHTML = '<h4 style="margin-top: 16px; margin-bottom: 8px; font-size: 14px; color: #64748b;">Outputs</h4>';
    outputsSectionA.appendChild(createComparisonRow('Flight Fuel', comparison.outputs.flightFuel.a, 'kg'));
    outputsSectionA.appendChild(createComparisonRow('Variable Reserve', comparison.outputs.variableReserve.a, 'kg'));
    outputsSectionA.appendChild(createComparisonRow('Reserve Fuel', comparison.outputs.reserveFuel.a, 'kg'));

    const totalRowA = createComparisonRow('Total Fuel', comparison.outputs.totalFuel.a, 'kg');
    totalRowA.style.fontWeight = 'bold';
    totalRowA.style.backgroundColor = '#dbeafe';
    totalRowA.style.padding = '12px 8px';
    totalRowA.style.marginTop = '8px';
    totalRowA.style.borderRadius = '4px';
    outputsSectionA.appendChild(totalRowA);
    columnA.appendChild(outputsSectionA);

    // Render Column B with differences
    const columnB = document.getElementById('comparisonDataB');
    columnB.innerHTML = '';

    // Inputs for B
    const inputsSectionB = document.createElement('div');
    inputsSectionB.innerHTML = '<h4 style="margin-top: 16px; margin-bottom: 8px; font-size: 14px; color: #64748b;">Inputs</h4>';
    inputsSectionB.appendChild(createComparisonRow('Distance', comparison.inputs.distance.b, 'km', comparison.inputs.distance.diff));
    if (comparison.inputs.speed.b > 0 || comparison.inputs.speed.a > 0) {
      inputsSectionB.appendChild(createComparisonRow('Cruise Speed', comparison.inputs.speed.b, 'km/h', comparison.inputs.speed.diff));
    }
    inputsSectionB.appendChild(createComparisonRow('Flight Time', comparison.inputs.flightTime.b, 'hrs', comparison.inputs.flightTime.diff));
    inputsSectionB.appendChild(createComparisonRow('Final Reserve', comparison.inputs.finalReserve.b, 'hrs', comparison.inputs.finalReserve.diff));
    inputsSectionB.appendChild(createComparisonRow('Holding', comparison.inputs.holding.b, 'hrs', comparison.inputs.holding.diff));
    inputsSectionB.appendChild(createComparisonRow('Contingency', comparison.inputs.contingency.b, 'hrs', comparison.inputs.contingency.diff));
    columnB.appendChild(inputsSectionB);

    // Outputs for B
    const outputsSectionB = document.createElement('div');
    outputsSectionB.innerHTML = '<h4 style="margin-top: 16px; margin-bottom: 8px; font-size: 14px; color: #64748b;">Outputs</h4>';
    outputsSectionB.appendChild(createComparisonRow('Flight Fuel', comparison.outputs.flightFuel.b, 'kg', comparison.outputs.flightFuel.diff));
    outputsSectionB.appendChild(createComparisonRow('Variable Reserve', comparison.outputs.variableReserve.b, 'kg', comparison.outputs.variableReserve.diff));
    outputsSectionB.appendChild(createComparisonRow('Reserve Fuel', comparison.outputs.reserveFuel.b, 'kg', comparison.outputs.reserveFuel.diff));

    const totalRowB = createComparisonRow('Total Fuel', comparison.outputs.totalFuel.b, 'kg', comparison.outputs.totalFuel.diff);
    totalRowB.style.fontWeight = 'bold';
    totalRowB.style.backgroundColor = '#dbeafe';
    totalRowB.style.padding = '12px 8px';
    totalRowB.style.marginTop = '8px';
    totalRowB.style.borderRadius = '4px';
    outputsSectionB.appendChild(totalRowB);
    columnB.appendChild(outputsSectionB);
  }

  /**
   * Show comparison view
   */
  function showComparison() {
    // Get both tab states
    const stateA = TabManager.getTabState('tabA');
    const stateB = TabManager.getTabState('tabB');

    // Compare calculations
    const comparison = compareCalculations(stateA, stateB);

    if (!comparison) {
      return;
    }

    // Render comparison
    renderComparison(comparison);

    // Hide tab content and show comparison view
    document.querySelectorAll('.tab-content').forEach(el => {
      el.classList.remove('active');
    });

    const comparisonView = document.getElementById('comparisonView');
    comparisonView.classList.remove('hidden');

    isComparisonActive = true;

    // Store comparison data for export
    window.currentComparison = comparison;
  }

  /**
   * Hide comparison view and return to tabs
   */
  function hideComparison() {
    const comparisonView = document.getElementById('comparisonView');
    comparisonView.classList.add('hidden');

    // Show active tab
    const activeTab = TabManager.getActiveTab();
    const tabContent = document.getElementById(activeTab);
    if (tabContent) {
      tabContent.classList.add('active');
    }

    isComparisonActive = false;

    // Clear stored comparison
    window.currentComparison = null;
  }

  /**
   * Toggle comparison view
   */
  function toggleComparison() {
    if (isComparisonActive) {
      hideComparison();
    } else {
      showComparison();
    }
  }

  /**
   * Check if comparison is active
   * @returns {boolean}
   */
  function isActive() {
    return isComparisonActive;
  }

  /**
   * Get current comparison data
   * @returns {Object|null}
   */
  function getCurrentComparison() {
    return window.currentComparison || null;
  }

  /**
   * Initialize comparison mode
   */
  function init() {
    // Setup compare button
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
      compareBtn.addEventListener('click', showComparison);
    }

    // Setup close comparison button
    const closeBtn = document.getElementById('closeComparisonBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', hideComparison);
    }

    // Setup copy comparison button
    const copyComparisonBtn = document.querySelector('.copy-comparison-btn');
    if (copyComparisonBtn) {
      copyComparisonBtn.addEventListener('click', () => {
        if (window.ExportManager) {
          window.ExportManager.copyComparison();
        }
      });
    }

    // Setup print comparison button
    const printComparisonBtn = document.querySelector('.print-comparison-btn');
    if (printComparisonBtn) {
      printComparisonBtn.addEventListener('click', () => {
        if (window.ExportManager) {
          window.ExportManager.printComparison();
        }
      });
    }
  }

  // Public API
  return {
    init,
    showComparison,
    hideComparison,
    toggleComparison,
    isActive,
    compareCalculations,
    getCurrentComparison
  };
})();

// Make available globally
window.ComparisonMode = ComparisonMode;
