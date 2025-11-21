# Getting Started - Drone Fuel Calculator

Quick guide to using your drone fuel calculator.

## Overview

This calculator helps you determine total fuel requirements for drone flights, including flight fuel, variable reserves, and contingency fuel based on ICAO-style fuel planning principles.

## Basic Usage

### 1. Choose a Tab
- **Calculation A** and **Calculation B** let you run two independent calculations
- Click a tab to switch between them
- Double-click tab name to rename it

### 2. Enter Flight Parameters

**Required Inputs:**
- **Flight Time** (hours) - How long the flight will take

**Optional Inputs:**
- **Distance** (km) - Trip distance
- **Cruise Speed** (km/h) - Average flight speed
  - If both distance and speed are entered, flight time is auto-calculated
- **Final Reserve** (hours) - Safety reserve (default: 0.5 hrs)
- **Holding** (hours) - Time to hold/loiter if needed
- **Contingency** (hours) - Extra contingency time

### 3. Review Results

The calculator automatically shows:
- **Flight Fuel** - Fuel needed for the flight
- **Variable Reserve** - 10% of flight fuel (standard practice)
- **Reserve Fuel** - Fuel for reserves, holding, and contingency
- **Total Fuel Required** - Sum of all above (highlighted in blue)

### 4. Check Warnings

Color-coded alerts appear if:
- 🔵 **Info** - Informational notices
- 🟡 **Caution** - Review recommended
- 🟠 **Warning** - Action may be needed
- 🔴 **Error** - Invalid input

## Advanced Features

### Auto-Calculate Flight Time

**Scenario:** You know the distance and cruise speed, but not flight time.

1. Enter **Distance** (e.g., 180 km)
2. Enter **Cruise Speed** (e.g., 90 km/h)
3. **Flight Time** auto-calculates (180 ÷ 90 = 2.0 hours)
4. You can override by manually entering a different flight time

### Compare Two Calculations

1. Complete calculations in both **Tab A** and **Tab B**
2. Click **Compare** button (top right)
3. View side-by-side comparison with differences
4. On mobile, comparison stacks vertically
5. Click **Exit Comparison** to return

### Export Your Calculation

**Copy to Clipboard:**
- Click **Copy** button
- Formatted text is copied
- Paste into emails, documents, etc.

**Download as JSON:**
- Click **Download JSON** button
- Save calculation data
- Can be archived or imported later (if feature added)

**Print:**
- Click **Print** button
- Print-optimized layout
- Includes all inputs, outputs, and warnings

### Clear and Start Over

- Click **Clear** button to reset current tab
- Confirms before clearing to prevent accidents
- Tab name is preserved

## Tips

### 1. Use Both Tabs for Comparison
- Run different scenarios in each tab
- Compare fuel requirements
- Choose the optimal plan

### 2. Save Time with Auto-Calculate
- Enter distance and speed first
- Let the calculator figure out flight time
- Adjust manually if needed

### 3. Set Appropriate Reserves
- **Minimum recommended:** 0.3 hours final reserve
- **Standard:** 0.5 hours (default)
- **Conservative:** 1.0 hours or more
- Consider weather, terrain, and operational complexity

### 4. Double-Check Your Math
- Calculator uses: Fuel Rate = 1.4 kg/hr
- Verify this matches your drone
- If different, you'll need to adjust the code (see README)

### 5. Data Persists
- Your calculations are saved automatically
- Close and reopen - data is still there
- Uses browser localStorage (local only, not synced)

## Calculation Formula

```
Fuel Rate: 1.4 kg/hr (configurable in code)

Flight Fuel = Flight Time × Fuel Rate
Variable Reserve = Flight Fuel × 10%
Reserve Fuel = (Final Reserve + Holding + Contingency) × Fuel Rate
Total Fuel Required = Flight Fuel + Variable Reserve + Reserve Fuel
```

### Example

**Inputs:**
- Distance: 180 km
- Speed: 90 km/h
- Flight Time: 2.0 hours (auto-calculated)
- Final Reserve: 0.5 hours
- Holding: 0 hours
- Contingency: 0 hours

**Outputs:**
- Flight Fuel: 2.0 × 1.4 = **2.80 kg**
- Variable Reserve: 2.80 × 0.10 = **0.28 kg**
- Reserve Fuel: 0.5 × 1.4 = **0.70 kg**
- **Total Fuel: 3.78 kg**

## Warning Conditions

The calculator warns you about:

| Warning | Condition | Type |
|---------|-----------|------|
| High fuel load | Total > 50 kg | Caution |
| Excessive reserve | Reserve > Flight fuel | Caution |
| Low reserve | Final reserve < 0.3 hrs | Warning |
| Extended flight | Flight time > 8 hrs | Info |
| Excessive flight | Flight time > 12 hrs | Caution |
| Zero reserve | No reserves allocated | Warning |
| High fuel rate | Effective rate > 10 kg/hr | Info |
| Long distance | Distance > 1000 km | Info |
| Speed concerns | Speed < 10 or > 200 km/h | Info |

## Keyboard Shortcuts

- **Tab** - Navigate between inputs
- **Enter** - Move to next field
- **Double-click tab name** - Edit tab name
- **Esc** (when editing name) - Cancel edit

## Mobile Usage

On mobile devices:
- Larger touch targets for easy tapping
- Tabs stack vertically for easy selection
- Comparison mode stacks vertically
- Export buttons go full-width
- All features fully functional

## Browser Compatibility

Works on:
- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Need Help?

- Check the **README.md** for more details
- Review **docs/deployment.md** for hosting info
- All calculations are client-side (nothing sent to server)
- Your data never leaves your device

## Safety Notice

⚠️ **Important:** This calculator is for planning purposes only. Always verify calculations and adhere to operational procedures, safety regulations, and aviation authority requirements.

---

Happy calculating! ✈️
