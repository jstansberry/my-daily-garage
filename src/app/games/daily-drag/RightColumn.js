"use client";

import React from 'react';

export default function RightColumn({ gameState, onPreStage, onStage, onLaunch, onShift, bestET }) {
    // Helper to determine button state
    const isPreStageActive = gameState === 'IDLE';
    const isStageActive = gameState === 'PRE_STAGE';

    // Throttle: Active once staged so you can Launch (and Red Light)
    // Shift: Active once racing (or ready)
    const canThrottle = ['STAGED', 'READY', 'RACING'].includes(gameState);
    const canShift = ['STAGED', 'READY', 'RACING'].includes(gameState);

    return (
        <>
            <h2 className="dr-header dr-header-blue">
                Controls
            </h2>

            <div className="dr-controls-container">

                {/* Pre-Stage */}
                <button
                    onClick={onPreStage}
                    disabled={!isPreStageActive}
                    className="dr-btn-control dr-btn-prestage"
                >
                    Pre-Stage
                </button>

                {/* Stage */}
                <button
                    onClick={onStage}
                    disabled={!isStageActive}
                    className="dr-btn-control dr-btn-stage"
                >
                    Stage
                </button>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: '#404040', width: '80%', margin: '8px 0' }}></div>

                {/* Throttle */}
                <button
                    onClick={onLaunch}
                    className={`dr-btn-backup ${gameState === 'RACING' ? 'active' : ''}`}
                >
                    Throttle
                </button>

                {/* Shift */}
                <button
                    onClick={onShift}
                    className="dr-btn-backup"
                    style={{ borderColor: '#7f1d1d', color: '#fca5a5' }}
                >
                    Shift
                </button>

                {/* Best ET (Bottom) */}
                {bestET && (
                    <div className="dr-best-et">
                        BEST ET: <span>{bestET.toFixed(3)}</span>s
                    </div>
                )}

            </div>
        </>
    );
}
