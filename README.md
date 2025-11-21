# Drone Fuel Calculator

A responsive web application for calculating drone fuel requirements for flight planning.

## Features

- **Dual Calculator Tabs** - Run two independent calculations simultaneously
- **Smart Calculations** - Automatic fuel calculation with ICAO-style fuel planning principles
- **Auto Flight Time** - Calculate flight time from distance + speed, or enter manually
- **Warning System** - Color-coded alerts for potential issues
- **Comparison Mode** - Side-by-side comparison of two calculations (responsive: side-by-side on desktop, stacked on mobile)
- **Export Options** - Copy to clipboard, download as JSON, or print
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Offline Ready** - Works without internet after first load (localStorage)
- **No Backend Required** - 100% client-side, privacy-focused

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
   - Cruise Speed (km/h) - optional (used with distance to auto-calculate flight time)
   - Flight time (hours) - required (can be auto-calculated or entered manually)
   - Final reserve (default: 0.5 hours)
   - Holding time (optional)
   - Contingency (optional)
3. **Review results**: Fuel requirements calculated automatically as you type
4. **Check warnings**: Review any alerts or cautions
5. **Compare**: Use the Compare button to view both calculations side-by-side
6. **Export**: Copy, download, or print your calculation

## Fuel Calculations

The calculator uses the following formula:

```
Fuel Rate: 1.4 kg/hr
Flight Fuel = Flight Time × Fuel Rate
Variable Reserve = Flight Fuel × 10%
Reserve Fuel = (Final Reserve + Holding + Contingency) × Fuel Rate
Total Fuel Required = Flight Fuel + Variable Reserve + Reserve Fuel
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Mobile

## Technology Stack

- HTML5
- CSS3 (Flexbox, Grid, responsive design)
- Vanilla JavaScript (ES6+, no frameworks)
- LocalStorage for persistence
- Zero dependencies

## File Structure

```
fuel_calc_app/
├── index.html           # Main application
├── css/
│   ├── main.css        # Core styles
│   ├── responsive.css  # Media queries
│   └── print.css       # Print styles
├── js/
│   ├── calculator.js   # Calculation engine
│   ├── tabs.js         # Tab management
│   ├── comparison.js   # Comparison logic
│   ├── export.js       # Export functions
│   ├── warnings.js     # Warning system
│   └── app.js          # Main initialization
├── docs/
│   ├── requirements.md # Requirements spec
│   ├── claude.md       # Implementation guide
│   └── deployment.md   # Deployment guide
└── README.md           # This file
```

## Documentation

- **[requirements.md](docs/requirements.md)** - Detailed feature requirements and specifications
- **[claude.md](docs/claude.md)** - Developer guide and architecture documentation
- **[deployment.md](docs/deployment.md)** - Hosting and deployment instructions

## Development

### Prerequisites
- Modern web browser
- Text editor
- (Optional) Local web server

### Setup
```bash
# Clone repository
git clone https://github.com/yourusername/drone-fuel-calc.git
cd drone-fuel-calc

# Open in browser
open index.html

# Or use a local server (recommended)
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Customization

To change the fuel consumption rate, edit `js/calculator.js`:

```javascript
const CONFIG = {
  FUEL_RATE: 1.4, // ← Change this value (kg/hr)
  VARIABLE_RESERVE_PERCENT: 0.10
};
```

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

### Version 1.0.0 (2025)
- Initial release
- Dual calculator tabs with independent state
- Auto-calculation of flight time from distance + speed
- Comparison mode with responsive layout
- Warning system with 9 different warning rules
- Export functionality (copy, JSON, print)
- Full responsive design
- LocalStorage persistence

## Future Enhancements

Potential features for future versions:
- Multiple drone types with different fuel rates
- Weather factor adjustments
- Unit toggle (metric/imperial)
- Historical calculation log
- PWA with offline support
- Dark mode
- Multi-language support

---

**Built for drone operators by drone operators**
