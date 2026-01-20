# Drag Racing Game Design Document

## Overview
A persistent "Daily Drag" game where the player pilots a Top Fuel dragster against a computer opponent. The game emphasizes reaction times, perfect shifting, and consistency.

## Layout & Interface
The game area mimics a 3-column arcade cabinet or simulation setup.

### Left Column: Settings
1.  **Difficulty Mode** (Dropdown/Toggle):
    *   **Easy**: Computer has average reaction times (0.150s+), early/late shifts, and moderate top speed (300mph).
    *   **Hard**: Computer has sharp reaction times (0.050s+), near-perfect shifts, and competitive top speed (325mph).
    *   **Pro**: Computer is elite. 0.000s-0.040s reaction times, perfect shifts, max top speed (335mph+).
2.  **Tree Type** (Toggle):
    *   **Sportsman (Standard)**: Three amber lights flash consecutively (0.5s apart) before Green.
    *   **Pro**: All three amber lights flash simultaneously (0.4s delay) before Green.
3.  **Sound** (Toggle): On/Off.

### Center Column: Cockpit (The View)
*   **Visual Style**: Minimalist, First-person driver's seat.
*   **Elements**:
    *   **Windscreen**: View of the track, the Christmas Tree (lights) in the center/distance, finish line timing boards.
    *   **Steering Yoke**: "Butterfly" style top fuel wheel.
    *   **Dashboard**:
        *   **Tachometer**: Large central gauge. Critical for the shift point.
        *   **Shift Light**: Bright RED toggle that illuminates at optimal RPM.
        *   **Speedometer**: Digital or Analog readout.
    *   **Feedback**:
        *   **Message Overlay**: "STAGED", "READY", "WIN", "LOSE", "RED LIGHT".

### Right Column: Controls (Interaction)
Stacked vertical buttons for touch/mouse users.

1.  **Pre-Stage**: Rolls the car forward (simulated) to trigger the top blue bulb on the tree.
2.  **Stage**: Rolls further to trigger the second yellow bulb.
3.  **Throttle**: (Visual indicator mainly, as "Enter" key is the primary trigger).
4.  **Shift**: (Visual indicator for the single gear shift).

## Gameplay Mechanics

### 1. The Sequence
1.  **Idle**: Engine rumbling audio. User selects difficulty/tree.
2.  **Pre-Stage**: Application of "Pre-Stage" button. Top bulb lit.
3.  **Stage**: Application of "Stage" button. Bottom bulb lit.
4.  **Random Delay**: Once both player and computer (auto) are staged, a random timer (2.5s - 3.5s) runs.
5.  **The Tree**: Lights drop based on selection (Pro vs Sportsman).
6.  **Launch**: Player hits **ENTER** (Desktop) or **GAS Button** (Mobile).
    *   **Reaction Time (RT)**: Difference between Green Light and Launch.
    *   **Red Light**: If RT is negative (launched before green). Automatic Loss.
7.  **The Run**: audio roars.
    *   Car accelerates automatically based on physics curve.
    *   **Shift Point**: Around 3.5s - 4.0s into the run (approx 280mph), the Tach hits redline and Shift Light glows.
    *   **Shift Input**: Player hits **SPACE** (Desktop) or **SHIFT Button** (Mobile).
    *   **Perfect Shift**: Hitting input within <100ms of the light.
    *   **Late/Early Shift**: Penalty to acceleration/top speed.
8.  **Finish**: Cross 1000ft (standard Top Fuel distance) or 1/4 mile.
    *   **Scoreboard**: Shows ET (Elapsed Time) and Speed (MPH).
    *   **Win Light**: Illuminates for the winner.

### 2. Physics & Scoring
*   **ET Calculation**:
    *   Base ET (assuming perfect run): e.g., 3.70s.
    *   Penalties: +0.01s for every 10ms off the perfect shift.
*   **Winning**:
    *   Winner is First to Cross line.
    *   Math: `Reaction Time + Elapsed Time = Total Time`. Lowest Total Time wins.
*   **High Score**:
    *   Save "Best ET" to local storage.
    *   Display "New Personal Best!" if beaten.

## Project Phases

### Phase 1: Foundation & UI
*   Construct the 3-column Grid layout.
*   Build static components: `ChristmasTree`, `Cockpit`, `ControlPanel`.
*   Establish global game state (Redux/Context or simple React state).

### Phase 2: The Logic (Engine)
*   **State Machine**: Implement the precise flow of Pre-Stage -> Stage -> Delay -> Lights.
*   **Reaction Timer**: High-precision measurement of the Launch trigger.
*   **Computer Opponent**: Basic randomized bot that sets a "Target Total Time" based on difficulty.

### Phase 3: Physics & Shifting
*   **Run Simulation**: Create the logic that calculates current distance/speed over time.
*   **Shift Mechanic**: The "Mini-game" within the game.
    *   Visual cue (Tach needle rising).
    *   Input capture and localized diff calculation (Expected vs Actual time).
*   **Result Calculation**: Combine RT + Run simulation to determine winner.

### Phase 4: Audio/Visuals
*   **Animations**: CSS/Canvas animations for the tree falling and the tachometer.
*   **Sound**: Integrating `Howler.js` (or similar) for:
    *   `idle_loop.mp3`
    *   `stage_clunk.mp3`
    *   `launch_roar.mp3`
    *   `win_cheer.mp3`

### Phase 5: Polish
*   Mobile responsive adjustments (ensure buttons are thumb-reachable).
*   "Race Again" flow.
*   Local Storage persistence.
