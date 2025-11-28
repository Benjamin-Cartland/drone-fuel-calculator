# Drone Fuel Calculator

A responsive web application for calculating drone fuel requirements for flight planning.

**Version:** 1.5.0 | **Developer:** Benjamin Cartland

## Features

- **Dual Calculator Tabs** - Run two independent calculations simultaneously
- **Smart Calculations** - Automatic fuel calculation with ICAO-style fuel planning principles (1.4 kg/hr)
- **Auto Flight Time** - Calculate flight time from distance + speed (m/s), or enter manually
- **Precision Fuel Display** - All fuel values displayed to 1 decimal place, rounded UP for safety
- **Dark Mode** - Toggle between light and dark themes with automatic system detection
- **Warning System** - Color-coded alerts for 9 different operational concerns
- **Comparison Mode** - Side-by-side comparison of two calculations (responsive: side-by-side on desktop, stacked on mobile)
- **Export Options** - Copy to clipboard, download as JSON, or print
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Offline Ready** - Works without internet after first load (localStorage)
- **No Backend Required** - 100% client-side, privacy-focused
- **Safari Compatible** - Tested and optimized for Safari, Chrome, Edge, and Firefox

## Quick Start

### Option 1: Open Locally
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start calculating!

### Option 2: Deploy to Cloudflare Pages
1. Create a Cloudflare account (free)
2. Connect your Git repository
3. Deploy with zero configuration
4. See `docs/deployment.md` for detailed instructions

## Usage

1. **Select a tab**: Choose "Calculation A" or "Calculation B"
2. **Enter flight parameters**:
   - Distance (km) - optional
   - Cruise Speed (m/s) - optional (used with distance to auto-calculate flight time)
   - Flight time (hours) - required (can be auto-calculated or entered manually)
   - Final reserve (minutes, default: 30 minutes)
   - Holding time (minutes, optional)
   - Contingency (minutes, optional)
3. **Review results**: Fuel requirements calculated automatically as you type (debounced 300ms)
4. **Check warnings**: Review any alerts or cautions
5. **Toggle theme**: Click the moon/sun icon to switch between light and dark modes
6. **Compare**: Use the Compare button to view both calculations side-by-side
7. **Export**: Copy, download, or print your calculation

## Fuel Calculations

The calculator uses the following formula with **round-up precision**:

```
Fuel Rate: 1.4 kg/hr
Flight Time Calculation: Distance (km) / (Speed (m/s) × 3.6) = Time (hours)
Flight Fuel = Flight Time × Fuel Rate [rounded UP to 0.1 kg]
Variable Reserve = Flight Fuel × 10% [rounded UP to 0.1 kg]
Reserve Fuel = (Final Reserve + Holding + Contingency) × Fuel Rate [rounded UP to 0.1 kg]
Total Fuel Required = Flight Fuel + Variable Reserve + Reserve Fuel [rounded UP to 0.1 kg]
```

**Display Format:** All fuel values display to 1 decimal place (e.g., "2.8 kg", "3.1 kg")
**Rounding Method:** Math.ceil() ensures all fuel values round UP for safety margins

### Example Calculation
```
Input:
  Distance: 180 km
  Speed: 25 m/s
  Flight Time: 2.00 hrs (auto-calculated: 180 / (25 × 3.6) = 2.0)
  Final Reserve: 30 mins (= 0.5 hrs)

Output:
  Flight Fuel: 2.8 kg (2.0 × 1.4 = 2.8)
  Variable Reserve: 0.3 kg (2.8 × 0.10 = 0.28 → rounds up to 0.3)
  Reserve Fuel: 0.7 kg (0.5 × 1.4 = 0.7)
  Total Fuel Required: 3.8 kg (sum rounded up)
```

## Browser Support

- Chrome/Edge: Latest 2 versions ✅
- Firefox: Latest 2 versions ✅
- Safari: Latest 2 versions ✅ (v1.2.0+ includes Safari compatibility fixes)
- Mobile browsers: iOS Safari 14+, Chrome Mobile ✅

## Technology Stack

- HTML5
- CSS3 (Flexbox, Grid, CSS Variables for theming)
- Vanilla JavaScript (ES6+, no frameworks)
- LocalStorage for persistence (theme preference, calculation state)
- Zero dependencies

## File Structure

```
fuel_calc_app/
├── index.html           # Main application
├── css/
│   ├── main.css        # Core styles + dark mode variables
│   ├── responsive.css  # Media queries
│   └── print.css       # Print styles
├── js/
│   ├── calculator.js   # Calculation engine (1.4 kg/hr, round-up logic)
│   ├── tabs.js         # Tab management + localStorage
│   ├── theme.js        # Dark mode toggle + persistence
│   ├── comparison.js   # Comparison logic
│   ├── export.js       # Export functions
│   ├── warnings.js     # Warning system (9 rules)
│   └── app.js          # Main initialization
├── assets/
│   └── logo.png        # Company logo
├── docs/
│   ├── requirements.md # Requirements spec
│   └── deployment.md   # Deployment guide
└── README.md           # This file
```

## Documentation

- **[requirements.md](docs/requirements.md)** - Detailed feature requirements and specifications
- **[deployment.md](docs/deployment.md)** - Hosting and deployment instructions

## Development

### Prerequisites
- Modern web browser
- Text editor
- (Optional) Local web server

### Setup
```bash
# Clone repository
git clone https://github.com/Benjamin-Cartland/drone-fuel-calculator.git
cd drone-fuel-calculator

# Open in browser
open index.html

# Or use a local server (recommended)
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Customization

**Change fuel consumption rate:**
Edit `js/calculator.js`:

```javascript
const CONFIG = {
  FUEL_RATE: 1.4, // ← Change this value (kg/hr)
  VARIABLE_RESERVE_PERCENT: 0.10
};
```

**Change theme colors:**
Edit `css/main.css`:

```css
:root {
  --color-primary: #2563eb;  /* Main blue */
  --color-success: #10b981;  /* Green */
  --color-warning: #f59e0b;  /* Orange */
}
```

## Dark Mode

**Version 1.3.0** includes a fully-featured dark mode:

- **Toggle button** in header (moon 🌙 = switch to dark, sun ☀️ = switch to light)
- **Automatic detection** of system preference on first visit
- **Persistent** - remembers your choice across sessions
- **Responsive** - optimized dark colors for all screen sizes
- **No flash** - theme applies before page renders

## License

This project is open source and available under the MIT License.

## Disclaimer

**Important:** This calculator is for planning purposes only. Always verify calculations and adhere to operational procedures, safety regulations, and aviation authority requirements. The authors are not responsible for any operational decisions made using this tool.

## Support

For issues, questions, or feature requests:
- Review the documentation in the `docs/` folder
- Check existing issues on GitHub
- Create a new issue with detailed information

## Version History

### Version 1.4.0 (2025-11-24)
- ⏱️ Reserve inputs changed from hours to minutes for better UX
- 📝 Final Reserve default: 30 minutes (previously 0.5 hours)
- 🎯 More intuitive for operators (30, 60 mins vs 0.5, 1.0 hrs)

### Version 1.3.0 (2025-11-23)
- ✨ Dark mode toggle with theme persistence
- 🌙 Automatic system preference detection
- 🎨 Responsive dark color scheme

### Version 1.2.0 (2025-11-23)
- 📊 Client fuel rounding requirements (1 decimal, round UP)
- 🍎 Safari compatibility fixes
- 🎨 Company logo in header
- 👤 Developer attribution in footer

### Version 1.1.0 (2025-11-22)
- 🚀 Speed units changed from km/h to m/s
- ⚡ Auto-calculation improvements
- ✅ Updated validation rules and warning thresholds

### Version 1.0.0 (2025-11-22)
- 🎉 Initial release
- ✈️ Dual calculator tabs with independent state
- 🔢 Auto-calculation of flight time from distance + speed
- 📊 Comparison mode with responsive layout
- ⚠️ Warning system with 9 different warning rules
- 📤 Export functionality (copy, JSON, print)
- 📱 Full responsive design
- 💾 LocalStorage persistence

## Future Enhancements

Potential features for future versions:
- Multiple drone types with different fuel rates
- Weather factor adjustments
- Unit toggle (metric/imperial)
- Historical calculation log
- PWA with offline support
- Multi-language support
- PDF export

---

**Built for drone operators by drone operators**
**Version 1.5.0** | Developed by Benjamin Cartland
