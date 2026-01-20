"use client";

import React from 'react';

export default function LeftColumn({
    difficulty,
    setDifficulty,
    treeType,
    setTreeType,
    soundEnabled,
    setSoundEnabled
}) {
    return (
        <>
            <h2 className="dr-header dr-header-orange">
                Settings
            </h2>

            {/* Difficulty Setting */}
            <div className="dr-button-group">
                <label className="dr-label">Difficulty</label>
                <div className="dr-button-row">
                    {['easy', 'hard', 'pro'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setDifficulty(mode)}
                            className={`dr-btn-select ${difficulty === mode ? 'active' : ''}`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tree Type Setting */}
            <div className="dr-button-group">
                <label className="dr-label">Christmas Tree</label>
                <div className="dr-button-row">
                    <button
                        onClick={() => setTreeType('sportsman')}
                        className={`dr-btn-pill ${treeType === 'sportsman' ? 'sportsman-active' : ''}`}
                    >
                        Sportsman
                    </button>
                    <button
                        onClick={() => setTreeType('pro')}
                        className={`dr-btn-pill ${treeType === 'pro' ? 'pro-active' : ''}`}
                    >
                        Pro Tree
                    </button>
                </div>
            </div>

            {/* Sound Toggle */}
            <div className="dr-sound-row">
                <span className="dr-label" style={{ marginBottom: 0 }}>Sound FX</span>
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`dr-toggle ${soundEnabled ? 'on' : 'off'}`}
                >
                    <div className="dr-toggle-dot" />
                </button>
            </div>
        </>
    );
}
