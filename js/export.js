/* ========================================
   Drone Fuel Calculator - Export & Print
   ======================================== */

const ExportManager = (function() {
  'use strict';

  /**
   * Format calculation data as text
   * @param {string} tabId - Tab identifier
   * @returns {string} Formatted text
   */
  function formatAsText(tabId) {
    const state = TabManager.getTabState(tabId);
    const tabName = TabManager.getTabName(tabId);
    const timestamp = new Date().toLocaleString();

    if (!state.inputs || !state.outputs) {
      return 'No calculation data available.';
    }

    let text = `DRONE FUEL CALCULATOR - ${tabName.toUpperCase()}\n`;
    text += `Generated: ${timestamp}\n`;
    text += `${'='.repeat(60)}\n\n`;

    text += `INPUTS:\n`;
    text += `${'─'.repeat(60)}\n`;
    text += `Distance:          ${state.inputs.distance ? state.inputs.distance.toFixed(2) + ' km' : 'Not specified'}\n`;
    if (state.inputs.speed && state.inputs.speed > 0) {
      text += `Cruise Speed:      ${state.inputs.speed.toFixed(2)} km/h\n`;
    }
    text += `Flight Time:       ${state.inputs.flightTime.toFixed(2)} hours\n`;
    text += `Final Reserve:     ${state.inputs.finalReserve.toFixed(2)} hours\n`;
    text += `Holding:           ${state.inputs.holding.toFixed(2)} hours\n`;
    text += `Contingency:       ${state.inputs.contingency.toFixed(2)} hours\n\n`;

    text += `OUTPUTS:\n`;
    text += `${'─'.repeat(60)}\n`;
    text += `Flight Fuel:       ${state.outputs.flightFuel.toFixed(2)} kg\n`;
    text += `Variable Reserve:  ${state.outputs.variableReserve.toFixed(2)} kg  (10%)\n`;
    text += `Reserve Fuel:      ${state.outputs.reserveFuel.toFixed(2)} kg\n`;
    text += `${'─'.repeat(60)}\n`;
    text += `TOTAL FUEL:        ${state.outputs.totalFuel.toFixed(2)} kg\n`;
    text += `${'='.repeat(60)}\n\n`;

    text += `PARAMETERS:\n`;
    text += `${'─'.repeat(60)}\n`;
    text += `Fuel Rate:         ${FuelCalculator.getConfig().FUEL_RATE} kg/hr\n\n`;

    text += `DISCLAIMER:\n`;
    text += `This calculator is for planning purposes only. Always verify\n`;
    text += `calculations and adhere to operational procedures and regulations.\n`;

    return text;
  }

  /**
   * Copy calculation to clipboard
   * @param {string} tabId - Tab identifier
   */
  async function copyToClipboard(tabId) {
    const text = formatAsText(tabId);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Copied to clipboard!', 'success');
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      showNotification('Failed to copy to clipboard', 'error');
    }
  }

  /**
   * Download calculation as JSON
   * @param {string} tabId - Tab identifier
   */
  function downloadJSON(tabId) {
    const state = TabManager.getTabState(tabId);
    const tabName = TabManager.getTabName(tabId);

    if (!state.inputs || !state.outputs) {
      showNotification('No calculation data to export', 'error');
      return;
    }

    const data = {
      calculationName: tabName,
      timestamp: new Date().toISOString(),
      inputs: state.inputs,
      outputs: state.outputs,
      config: {
        fuelRate: FuelCalculator.getConfig().FUEL_RATE,
        variableReservePercent: FuelCalculator.getConfig().VARIABLE_RESERVE_PERCENT
      }
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `drone-fuel-calc-${tabName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Downloaded as JSON', 'success');
  }

  /**
   * Print calculation
   * @param {string} tabId - Tab identifier
   */
  function printCalculation(tabId) {
    // Ensure the correct tab is active for printing
    const currentActive = TabManager.getActiveTab();

    if (currentActive !== tabId) {
      TabManager.switchTab(tabId);
    }

    // Add print-specific metadata
    const header = document.querySelector('.app-header');
    if (header) {
      header.setAttribute('data-print-date', new Date().toLocaleString());
    }

    // Add tab name to form for printing
    const form = document.getElementById(`form${tabId.slice(-1).toUpperCase()}`);
    if (form) {
      form.setAttribute('data-tab-name', TabManager.getTabName(tabId));
    }

    // Delay print to ensure rendering
    setTimeout(() => {
      window.print();
    }, 100);
  }

  /**
   * Format comparison data as text
   * @returns {string} Formatted comparison text
   */
  function formatComparisonAsText() {
    const comparison = ComparisonMode.getCurrentComparison();
    if (!comparison) {
      return 'No comparison data available.';
    }

    const timestamp = new Date().toLocaleString();

    let text = `DRONE FUEL CALCULATOR - COMPARISON\n`;
    text += `Generated: ${timestamp}\n`;
    text += `${'='.repeat(80)}\n\n`;

    // Column headers
    text += `${'Parameter'.padEnd(25)}${comparison.names.a.padEnd(25)}${comparison.names.b}\n`;
    text += `${'─'.repeat(80)}\n\n`;

    text += `INPUTS:\n`;
    text += `Distance (km)`.padEnd(25);
    text += `${comparison.inputs.distance.a.toFixed(2)}`.padEnd(25);
    text += `${comparison.inputs.distance.b.toFixed(2)}`.padEnd(25);
    text += `(${comparison.inputs.distance.diff.formatted})\n`;

    if (comparison.inputs.speed.a > 0 || comparison.inputs.speed.b > 0) {
      text += `Speed (km/h)`.padEnd(25);
      text += `${comparison.inputs.speed.a.toFixed(2)}`.padEnd(25);
      text += `${comparison.inputs.speed.b.toFixed(2)}`.padEnd(25);
      text += `(${comparison.inputs.speed.diff.formatted})\n`;
    }

    text += `Flight Time (hrs)`.padEnd(25);
    text += `${comparison.inputs.flightTime.a.toFixed(2)}`.padEnd(25);
    text += `${comparison.inputs.flightTime.b.toFixed(2)}`.padEnd(25);
    text += `(${comparison.inputs.flightTime.diff.formatted})\n`;

    text += `Final Reserve (hrs)`.padEnd(25);
    text += `${comparison.inputs.finalReserve.a.toFixed(2)}`.padEnd(25);
    text += `${comparison.inputs.finalReserve.b.toFixed(2)}`.padEnd(25);
    text += `(${comparison.inputs.finalReserve.diff.formatted})\n`;

    text += `Holding (hrs)`.padEnd(25);
    text += `${comparison.inputs.holding.a.toFixed(2)}`.padEnd(25);
    text += `${comparison.inputs.holding.b.toFixed(2)}`.padEnd(25);
    text += `(${comparison.inputs.holding.diff.formatted})\n`;

    text += `Contingency (hrs)`.padEnd(25);
    text += `${comparison.inputs.contingency.a.toFixed(2)}`.padEnd(25);
    text += `${comparison.inputs.contingency.b.toFixed(2)}`.padEnd(25);
    text += `(${comparison.inputs.contingency.diff.formatted})\n\n`;

    text += `OUTPUTS:\n`;
    text += `Flight Fuel (kg)`.padEnd(25);
    text += `${comparison.outputs.flightFuel.a.toFixed(2)}`.padEnd(25);
    text += `${comparison.outputs.flightFuel.b.toFixed(2)}`.padEnd(25);
    text += `(${comparison.outputs.flightFuel.diff.formatted})\n`;

    text += `Variable Reserve (kg)`.padEnd(25);
    text += `${comparison.outputs.variableReserve.a.toFixed(2)}`.padEnd(25);
    text += `${comparison.outputs.variableReserve.b.toFixed(2)}`.padEnd(25);
    text += `(${comparison.outputs.variableReserve.diff.formatted})\n`;

    text += `Reserve Fuel (kg)`.padEnd(25);
    text += `${comparison.outputs.reserveFuel.a.toFixed(2)}`.padEnd(25);
    text += `${comparison.outputs.reserveFuel.b.toFixed(2)}`.padEnd(25);
    text += `(${comparison.outputs.reserveFuel.diff.formatted})\n`;

    text += `${'─'.repeat(80)}\n`;
    text += `TOTAL FUEL (kg)`.padEnd(25);
    text += `${comparison.outputs.totalFuel.a.toFixed(2)}`.padEnd(25);
    text += `${comparison.outputs.totalFuel.b.toFixed(2)}`.padEnd(25);
    text += `(${comparison.outputs.totalFuel.diff.formatted})\n`;

    text += `${'='.repeat(80)}\n\n`;

    text += `DISCLAIMER:\n`;
    text += `This calculator is for planning purposes only. Always verify\n`;
    text += `calculations and adhere to operational procedures and regulations.\n`;

    return text;
  }

  /**
   * Copy comparison to clipboard
   */
  async function copyComparison() {
    const text = formatComparisonAsText();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showNotification('Comparison copied to clipboard!', 'success');
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Comparison copied to clipboard!', 'success');
      }
    } catch (err) {
      console.error('Failed to copy comparison:', err);
      showNotification('Failed to copy comparison', 'error');
    }
  }

  /**
   * Print comparison
   */
  function printComparison() {
    // Comparison view should already be visible
    if (!ComparisonMode.isActive()) {
      showNotification('Please open comparison view first', 'error');
      return;
    }

    // Add print metadata
    const header = document.querySelector('.app-header');
    if (header) {
      header.setAttribute('data-print-date', new Date().toLocaleString());
    }

    // Delay print to ensure rendering
    setTimeout(() => {
      window.print();
    }, 100);
  }

  /**
   * Show notification message
   * @param {string} message - Message to display
   * @param {string} type - Type of notification (success, error, info)
   */
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '6px',
      backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
      color: 'white',
      fontWeight: '500',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: '10000',
      animation: 'slideIn 0.3s ease',
      maxWidth: '300px'
    });

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  /**
   * Initialize export manager
   */
  function init() {
    // Setup copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        copyToClipboard(tabId);
      });
    });

    // Setup download buttons
    document.querySelectorAll('.download-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        downloadJSON(tabId);
      });
    });

    // Setup print buttons
    document.querySelectorAll('.print-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        printCalculation(tabId);
      });
    });

    // Add animation styles for notifications
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Public API
  return {
    init,
    copyToClipboard,
    downloadJSON,
    printCalculation,
    copyComparison,
    printComparison,
    showNotification
  };
})();

// Make available globally
window.ExportManager = ExportManager;
