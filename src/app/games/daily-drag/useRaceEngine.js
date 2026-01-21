import { useState, useRef, useEffect, useCallback } from 'react';

// CONSTANTS
const TRACK_LENGTH_METERS = 304.8; // 1000ft (approx standard for Top Fuel now)
// const TRACK_LENGTH_METERS = 402.3; // 1/4 mile

// PHYSICS CONSTANTS (Top Fuel Approximation)
// reaching ~330mph (147 m/s) in ~3.7 seconds
const MAX_SPEED = 150; // m/s
const ACCEL_BASE = 45; // m/s^2 (approx 4.5G)
const DRAG_FACTOR = 0.15; // Air resistance increases with speed

export default function useRaceEngine({ gameState, onFinish, onRedLight }) {
    // TELEMETRY STATE
    const [speed, setSpeed] = useState(0); // mph (display)
    const [rpm, setRpm] = useState(0); // 0-10000 approx
    const [distance, setDistance] = useState(0); // meters
    const [shiftLight, setShiftLight] = useState(false); // boolean

    // REFS
    const stateRef = useRef({
        velocity: 0,
        position: 0,
        lastFrameTime: 0,
        startTime: 0,
        hasShifted: false,
        shiftQuality: 1.0,
        running: false, // Explicit running state
        shiftLightTime: 0, // When did the light turn on?
        finished: false,
        shiftPointRPM: 0,
        // Chaos Factors (Randomized per run)
        tractionFactor: 1.0,
        dragFactor: 1.0,
        powerFactor: 1.0
    });

    const requestRef = useRef();

    // -------------------------------------------------------------------------
    // GAME LOOP
    // -------------------------------------------------------------------------
    const animate = useCallback((time) => {
        if (!stateRef.current.running) {
            requestRef.current = requestAnimationFrame(animate);
            return;
        }

        // Calculate Delta
        const deltaTime = (time - stateRef.current.lastFrameTime) / 1000; // seconds
        stateRef.current.lastFrameTime = time;

        // PHYSICS STEP
        const currentSpeed = stateRef.current.velocity;

        // ACCELERATION & DRAG
        // Base Accel modified by Power and Traction
        // Traction affects low speed more, Drag affects high speed
        const effectiveAccel = ACCEL_BASE * stateRef.current.powerFactor * stateRef.current.tractionFactor;

        let acceleration = effectiveAccel;

        // Drag increases with speed squared concept (simplified linear here but scaled)
        const effectiveDrag = DRAG_FACTOR * stateRef.current.dragFactor;
        acceleration -= (currentSpeed / MAX_SPEED) * (ACCEL_BASE * effectiveDrag);

        // SHIFT LOGIC (Earlier point: ~180mph / 80ms)
        // Redline triggered earlier
        const SHIFT_THRESHOLD_SPEED = 80; // m/s (~180mph) (Lowered from 116)

        if (currentSpeed > SHIFT_THRESHOLD_SPEED && !stateRef.current.hasShifted) {
            // OVER-REV / PENALTY
            stateRef.current.shiftQuality = 0.5;
        }

        // Apply Shift Quality
        acceleration *= stateRef.current.shiftQuality;

        // Update Velocity & Position
        stateRef.current.velocity += acceleration * deltaTime;
        stateRef.current.position += stateRef.current.velocity * deltaTime;

        // Update Telemetry
        const mph = Math.floor(stateRef.current.velocity * 2.23694);
        setSpeed(mph);
        setDistance(stateRef.current.position);

        // RPM LOGIC (Steeper climb)
        // Idle 2500 -> Redline 9500
        // Hit Redline at SHIFT_THRESHOLD_SPEED if in 1st gear
        let currentRpm;
        if (!stateRef.current.hasShifted) {
            // Gear 1
            const ratio = currentSpeed / SHIFT_THRESHOLD_SPEED;
            currentRpm = 2500 + (ratio * 7000); // reaches 9500 at threshold
        } else {
            // Gear 2 (Drops to 7000, climbs slowly)
            currentRpm = 7000 + ((currentSpeed - SHIFT_THRESHOLD_SPEED) / 50) * 2500;
        }

        // BLOWOUT LOGIC
        // Shift light ON if RPM > 9000 (Warning zone)
        // BLOW UP if RPM > 9600 for > 200ms
        if (currentRpm > 9000 && !stateRef.current.hasShifted) {
            setShiftLight(true);
            if (stateRef.current.shiftLightTime === 0) {
                stateRef.current.shiftLightTime = time;
            } else {
                // Check Duration
                if (time - stateRef.current.shiftLightTime > 400) {
                    // BLOWOUT!
                    stateRef.current.running = false;
                    onRedLight('BLOWN_ENGINE'); // Re-use red light callback or new one? 
                    // Let's assume onRedLight handles generic "Loss" or add a specific arg
                    cancelAnimationFrame(requestRef.current);
                    return;
                }
            }
        } else {
            setShiftLight(false);
            stateRef.current.shiftLightTime = 0;
        }

        // Cap RPM
        if (currentRpm > 9800) currentRpm = 9800 + Math.random() * 200;
        setRpm(Math.floor(currentRpm));

        // CHECK FINISH
        if (stateRef.current.position >= TRACK_LENGTH_METERS && !stateRef.current.finished) {
            stateRef.current.finished = true;
            const et = (Date.now() - stateRef.current.startTime) / 1000;
            onFinish({ et, speed: mph, shiftRPM: stateRef.current.shiftPointRPM });
            cancelAnimationFrame(requestRef.current);
            return;
        }

        requestRef.current = requestAnimationFrame(animate);
    }, [gameState, onFinish, onRedLight]);


    // -------------------------------------------------------------------------
    // CONTROLS HANDLERS
    // -------------------------------------------------------------------------

    const launch = (isManual = false) => {
        // Only start if not already running
        if (!stateRef.current.running) {
            stateRef.current.startTime = Date.now();
            stateRef.current.lastFrameTime = performance.now();
            stateRef.current.running = true;
            stateRef.current.finished = false;
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    const shift = () => {
        if (!stateRef.current.hasShifted) {
            stateRef.current.hasShifted = true;
            // Capture Shift RPM (approximate based on current velocity)
            // We need to calculate it because 'rpm' state is lagging one frame or so potentially, 
            // but using the last calculated RPM from the animate loop logic is safer.
            // Simplest: use the 'rpm' state (might be 1 frame old) or recalculate.
            // Let's grab the value computed in the last frame? No, let's just grab the variable we'd use.
            // Actually, the main loop calculates 'currentRpm' locally. We can't access it here easily.
            // For simplicity, we will assume the User saw the 'rpm' state or just save 'rpm' state here.
            // Better: Store it in stateRef during animate loop if needed, OR just trust 'rpm' state ref?
            // Actually 'rpm' state is updated in animate. We can read 'rpm' but wait... 'rpm' is state, might be stale in closure?
            // No, let's use a ref for current RPM to be safe or just re-calc.
            // Let's use the 'telemetry' approach. Actually, 'rpm' is in state. 
            // Let's just use the setRpm value. 
            // To be precise:
            stateRef.current.shiftPointRPM = rpm;
            setShiftLight(false);
        }
    };

    const resetEngine = () => {
        stateRef.current = {
            velocity: 0,
            position: 0,
            lastFrameTime: 0,
            startTime: 0,
            hasShifted: false,
            shiftQuality: 1.0,
            running: false,
            shiftLightTime: 0,
            finished: false,
            shiftPointRPM: 0,
            // Randomize Factors for this run
            tractionFactor: 0.98 + Math.random() * 0.04, // +/- 2%
            dragFactor: 0.95 + Math.random() * 0.10,     // +/- 5% (Affects Trap Speed most)
            powerFactor: 0.98 + Math.random() * 0.05     // +5% / -2% Power
        };
        setSpeed(0);
        setRpm(2200);
        setDistance(0);
        setShiftLight(false);
        cancelAnimationFrame(requestRef.current);
    };

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        if (gameState === 'IDLE') {
            resetEngine();
        }
        // NOTE: removed auto-launch on 'RACING'. 
        // Now 'DragRacingGame.js' must call actions.launch()

        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState]);

    return {
        telemetry: { speed, rpm, distance, shiftLight },
        actions: { launch, shift, reset: resetEngine }
    };
}
