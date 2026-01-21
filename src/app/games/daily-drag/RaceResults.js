"use client";

import React from 'react';

export default function RaceResults({ playerResult, computerResult, onClose }) {
    // Determine Winner
    const playerRT = playerResult.rt;
    const playerET = playerResult.et;
    const playerTotal = playerRT + playerET;

    const computerRT = computerResult.rt;
    const computerET = computerResult.et;
    const computerTotal = computerRT + computerET;

    // Format numbers to 3 decimal places
    const f = (n) => n.toFixed(3);

    let winner = 'player';
    let message = 'YOU WON!';
    let titleClass = 'dr-modal-title win';

    if (playerResult.blownEngine) {
        winner = 'computer';
        message = 'YOU BLEW IT UP!';
        titleClass = 'dr-modal-title loss';
    } else if (playerResult.redLight) {
        winner = 'computer';
        message = 'YOU RED LIGHTED!';
        titleClass = 'dr-modal-title loss';
    } else if (computerResult.redLight) {
        winner = 'player';
        message = 'OPPONENT RED LIGHT!';
    } else {
        if (computerTotal < playerTotal) {
            winner = 'computer';
            message = 'YOU LOST!';
            titleClass = 'dr-modal-title loss';
        }
    }

    return (
        <div className="dr-modal-overlay">
            <div className="dr-modal-content">

                <h2 className={titleClass}>
                    {message}
                </h2>

                {playerResult.blownEngine ? (
                    <div style={{
                        width: '100%', height: '200px', backgroundColor: '#262626',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '24px', border: '2px dashed #ef4444', borderRadius: '4px'
                    }}>
                        <span style={{ color: '#ef4444', fontFamily: 'monospace', fontWeight: 'bold' }}>
                            <img src="/images/blown-up.jpg" alt="You blew it up!" width="250px" />
                        </span>
                    </div>
                ) : (
                    <div className="dr-results-grid">

                        {/* Left Lane (You) */}
                        <div className="dr-result-card">
                            <div className="dr-result-label">YOU</div>
                            <div>
                                <div className="dr-stat-row">
                                    <span className="dr-stat-label">RT</span>
                                    <span className={`dr-stat-value ${playerResult.redLight ? 'red-light' : ''}`}>
                                        {f(playerRT)}
                                    </span>
                                </div>
                                <div className="dr-stat-row">
                                    <span className="dr-stat-label">ET</span>
                                    <span className="dr-stat-value">{f(playerET)}</span>
                                </div>
                                <div className="dr-stat-row">
                                    <span className="dr-stat-label">MPH</span>
                                    <span className="dr-stat-value">{Math.floor(playerResult.speed)}</span>
                                </div>
                                <div className="dr-stat-row">
                                    <span className="dr-stat-label">SHIFT</span>
                                    <span style={{ color: '#f97316' }} className="dr-stat-value">
                                        {playerResult.shiftRPM}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Lane (CPU) */}
                        <div className="dr-result-card">
                            <div className="dr-result-label">OPPONENT</div>
                            <div>
                                <div className="dr-stat-row">
                                    <span className="dr-stat-label">RT</span>
                                    <span className="dr-stat-value">{f(computerRT)}</span>
                                </div>
                                <div className="dr-stat-row">
                                    <span className="dr-stat-label">ET</span>
                                    <span className="dr-stat-value">{f(computerET)}</span>
                                </div>
                                <div className="dr-stat-row">
                                    <span className="dr-stat-label">MPH</span>
                                    <span className="dr-stat-value">{Math.floor(computerResult.speed)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="dr-btn-primary"
                >
                    RACE AGAIN
                </button>

            </div>
        </div>
    );
}
