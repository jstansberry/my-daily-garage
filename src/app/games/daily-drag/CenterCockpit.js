"use client";

import React from 'react';

export default function CenterCockpit({ gameState, activeLights = [], telemetry = { speed: 0, rpm: 2200, shiftLight: false } }) {
    // Helper to check if a light is active
    const isActive = (id) => activeLights.includes(id);

    // Tach Needle Rotation (0 RPM = -135deg, 10000 RPM = 135deg. Span 270deg)
    const tachRotation = -135 + (telemetry.rpm / 10000) * 270;

    return (
        <div className="dr-cockpit-container">

            {/* WINDSCREEN VIEW */}
            <div className="dr-windscreen">
                {/* Sky Pattern */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
                    opacity: 0.1
                }}></div>

                {/* Track */}
                <div className="dr-track-floor">
                    <div className="dr-track-surface"></div>
                </div>

                {/* Christmas Tree */}
                <div className="dr-christmas-tree">
                    {/* Pre-Stage (Blue) */}
                    <div className="dr-light-row">
                        <div className={`dr-bulb blue ${isActive('pre') ? 'active' : ''}`} />
                        <div className={`dr-bulb blue ${isActive('pre') ? 'active' : ''}`} />
                    </div>

                    {/* Staged (Yellow) */}
                    <div className="dr-light-row">
                        <div className={`dr-bulb yellow ${isActive('stage') ? 'active' : ''}`} />
                        <div className={`dr-bulb yellow ${isActive('stage') ? 'active' : ''}`} />
                    </div>

                    {/* Ambers */}
                    <div className={`dr-bulb-lg amber ${isActive('a1') ? 'active' : ''}`} />
                    <div className={`dr-bulb-lg amber ${isActive('a2') ? 'active' : ''}`} />
                    <div className={`dr-bulb-lg amber ${isActive('a3') ? 'active' : ''}`} />

                    {/* Green */}
                    <div className={`dr-bulb-xl green ${isActive('green') ? 'active' : ''}`} />

                    {/* Red */}
                    <div className={`dr-bulb-xl red ${isActive('red') ? 'active' : ''}`} />
                </div>

                {/* HUD Overlay */}
                <div className="dr-hud-status">
                    STATUS: <span>{gameState}</span>
                </div>
            </div>

            {/* DASHBOARD */}
            <div className="dr-dashboard">
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
                    opacity: 0.2,
                    pointerEvents: 'none'
                }}></div>

                <div className="dr-dashboard-inner">

                    {/* Left: Speedometer */}
                    <div className="dr-gauge speedo">
                        <span className="dr-gauge-value">{telemetry.speed}</span>
                        <span className="dr-gauge-label">MPH</span>
                    </div>

                    {/* Center: Yoke & Shift */}
                    <div className="dr-steering-column">
                        <div className={`dr-shift-light ${telemetry.shiftLight ? 'active' : ''}`} style={{
                            backgroundColor: telemetry.shiftLight ? '#ef4444' : 'rgba(127, 29, 29, 0.5)',
                            boxShadow: telemetry.shiftLight ? '0 0 30px #ef4444' : 'none'
                        }}>
                            <span className="dr-shift-label">SHIFT</span>
                        </div>

                        <div className="dr-yoke">
                            <div className="dr-yoke-handle" />
                            <div className="dr-yoke-center"></div>
                            <div className="dr-yoke-handle" />
                        </div>
                    </div>

                    {/* Right: Tachometer */}
                    <div className="dr-gauge tach">
                        {/* Needle */}
                        <div style={{
                            position: 'absolute', width: '4px', height: '50%',
                            backgroundColor: '#f97316', bottom: '50%', left: 'calc(50% - 2px)',
                            transformOrigin: 'bottom center',
                            transform: `rotate(${tachRotation}deg)`,
                            borderRadius: '2px',
                            transition: 'transform 0.05s linear' // Smooth movement
                        }}></div>

                        <div style={{
                            position: 'absolute', width: '12px', height: '12px',
                            backgroundColor: '#404040', borderRadius: '50%',
                            top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
                        }}></div>

                        <div style={{ position: 'absolute', bottom: '12px', textAlign: 'center' }}>
                            <div className="dr-gauge-value">{Math.floor(telemetry.rpm)}</div>
                            <div className="dr-gauge-label">RPM</div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
