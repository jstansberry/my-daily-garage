"use client";

import React, { useState, useEffect, useRef } from 'react';
import './drag-racing.css';
import LeftColumn from './LeftColumn';
import CenterCockpit from './CenterCockpit';
import RightColumn from './RightColumn';
import useRaceEngine from './useRaceEngine';
import RaceResults from './RaceResults';
import useSoundManager from './useSoundManager';

export default function DragRacingGame() {
    // Global Game State
    const [gameState, setGameState] = useState('IDLE'); // IDLE, PRE_STAGE, STAGED, READY, RACING, FINISHED
    const [showResults, setShowResults] = useState(false);
    const [bestET, setBestET] = useState(null); // LocalStorage persistence

    // Settings State
    const [difficulty, setDifficulty] = useState('easy');
    const [treeType, setTreeType] = useState('sportsman');
    const [soundEnabled, setSoundEnabled] = useState(false);

    // Tree Lights State
    const [activeLights, setActiveLights] = useState([]);

    // Results State
    const [playerResult, setPlayerResult] = useState(null);
    const [computerResult, setComputerResult] = useState(null);

    // Timing Refs
    const launchTimeRef = useRef(0);
    const reactionTimeRef = useRef(0);
    const expectedGreenTimeRef = useRef(0);

    // Load Best ET on Mount
    useEffect(() => {
        const saved = localStorage.getItem('dailyDrag_bestET');
        if (saved) setBestET(parseFloat(saved));
    }, []);

    // Sound Manager
    const sounds = useSoundManager(soundEnabled);

    // Timer Management
    const timersRef = useRef([]);

    const setRaceTimeout = (callback, delay) => {
        const id = setTimeout(() => {
            // Remove from ref when done (optional but keeps array clean-ish)
            timersRef.current = timersRef.current.filter(t => t !== id);
            callback();
        }, delay);
        timersRef.current.push(id);
        return id;
    };

    const clearRaceTimers = () => {
        timersRef.current.forEach(id => clearTimeout(id));
        timersRef.current = [];
    };

    // -------------------------------------------------------------------------
    // AI LOGIC
    // -------------------------------------------------------------------------
    const generateOpponentRun = (diff) => {
        // Top Fuel approx: 3.6s - 4.0s @ 320-335mph
        let minET, maxET, minRT, maxRT, speedBase;

        if (diff === 'easy') {
            minET = 3.90; maxET = 4.20;
            minRT = 0.100; maxRT = 0.300;
            speedBase = 300;
        } else if (diff === 'hard') {
            minET = 3.75; maxET = 3.90;
            minRT = 0.040; maxRT = 0.090;
            speedBase = 325;
        } else { // Pro
            minET = 3.65; maxET = 3.75;
            minRT = 0.000; maxRT = 0.040;
            speedBase = 335;
        }

        const et = minET + Math.random() * (maxET - minET);
        const rt = minRT + Math.random() * (maxRT - minRT);
        const speed = speedBase + Math.random() * 10;
        const redLight = (diff === 'easy' && Math.random() > 0.98);

        return { et, rt, speed, redLight };
    };

    // -------------------------------------------------------------------------
    // PHYSICS ENGINE
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // PHYSICS ENGINE
    // -------------------------------------------------------------------------

    const triggerLoss = (reason, customRT = null) => {
        // Stop any pending tree events
        clearRaceTimers();

        if (reason === 'BLOWN_ENGINE') {
            const pResult = {
                et: 0,
                rt: reactionTimeRef.current,
                speed: 0,
                redLight: false,
                blownEngine: true
            };
            setPlayerResult(pResult);
            setComputerResult(generateOpponentRun(difficulty)); // AI wins
            setGameState('FINISHED');
            setShowResults(true);
            sounds.play('loss');
            return;
        }

        // Standard Red Light handling (or Premature Input)
        const displayRT = customRT !== null ? customRT : -0.500;

        const pResult = {
            et: 0,
            rt: displayRT,
            speed: 0,
            redLight: true
        };
        setPlayerResult(pResult);
        setComputerResult(generateOpponentRun(difficulty));
        setGameState('FINISHED');
        setShowResults(true);
        if (reason !== 'SILENT') setActiveLights(prev => [...prev, 'red']);
        sounds.play('loss');
    };

    const handleRaceFinish = (engineResult) => {
        const rt = reactionTimeRef.current;
        const pResult = {
            et: engineResult.et,
            rt: rt,
            speed: engineResult.speed,
            redLight: rt < 0
        };

        // Update Best ET
        if (!pResult.redLight) {
            if (!bestET || pResult.et < bestET) {
                setBestET(pResult.et);
                localStorage.setItem('dailyDrag_bestET', pResult.et.toString());
            }
        }

        setPlayerResult(pResult);
        setGameState('FINISHED');
        setShowResults(true);

        // Sound Logic (Win/Loss)
        const cResult = computerResult; // Should be set by now
        if (cResult) {
            const pTotal = pResult.et + pResult.rt;
            const cTotal = cResult.et + cResult.rt;
            // Simple Win calc
            if (!pResult.redLight && (cResult.redLight || pTotal < cTotal)) {
                sounds.play('win');
            } else {
                sounds.play('loss');
            }
        }
    };

    const { telemetry, actions } = useRaceEngine({
        gameState,
        onFinish: handleRaceFinish,
        onRedLight: triggerLoss
    });

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handlePreStage = () => {
        if (gameState === 'IDLE') {
            setGameState('PRE_STAGE');
            setActiveLights(['pre']);
            sounds.play('stage');
        }
    };

    const handleStage = () => {
        if (gameState === 'PRE_STAGE') {
            setGameState('STAGED');
            setActiveLights(['pre', 'stage']);
            sounds.play('stage');

            const delay = Math.random() * 1000 + 2500;

            setRaceTimeout(() => {
                setGameState('READY');
                startTreeSequence();
            }, delay);
        }
    };

    const handleReset = () => {
        clearRaceTimers();
        setGameState('IDLE');
        setActiveLights([]);
        setShowResults(false);
        setPlayerResult(null);
        setComputerResult(null);
        reactionTimeRef.current = 0;
        launchTimeRef.current = 0;

        // Reset Physics Engine
        actions.reset();

        sounds.stopAll();
    };

    const handleLaunch = () => {
        // STRICT INPUT: Premature Launch Check
        if (['IDLE', 'PRE_STAGE', 'STAGED', 'READY'].includes(gameState)) {
            let foulRT = -1.000; // Default for WAY early (before tree starts)

            if (gameState === 'READY' && expectedGreenTimeRef.current > 0) {
                // Tree is active, calculate actual negative RT
                const now = Date.now();
                foulRT = (now - expectedGreenTimeRef.current) / 1000;
            }

            triggerLoss('RED_LIGHT', foulRT);
            return;
        }

        if (gameState === 'RACING') {
            // Legal Launch! 
            const now = Date.now();
            const rt = (now - launchTimeRef.current) / 1000;
            reactionTimeRef.current = rt;

            console.log("REACTION TIME:", rt);
            sounds.play('launch');

            // Manually start physics
            actions.launch();
        }
    };

    const handleShift = () => {
        // STRICT INPUT: Premature Shift Check
        if (gameState !== 'RACING') {
            // If you shift while sitting at the line or staging, you fail.
            if (['IDLE', 'PRE_STAGE', 'STAGED', 'READY'].includes(gameState)) {
                triggerLoss('PREMATURE_SHIFT');
                return;
            }
        }

        // Valid Shift Action (only if Racing, or if we want to allow shifting in Finished state? No.)
        if (gameState === 'RACING') {
            actions.shift();
            sounds.play('shift');
        }
    };


    // -------------------------------------------------------------------------
    // TREE LOGIC
    // -------------------------------------------------------------------------

    const startTreeSequence = () => {
        setComputerResult(generateOpponentRun(difficulty));

        if (treeType === 'sportsman') {
            // Sportsman
            setRaceTimeout(() => {
                setActiveLights(prev => [...prev.filter(l => !l.startsWith('a')), 'a1']);
                sounds.play('tree');
            }, 0);
            setRaceTimeout(() => {
                setActiveLights(prev => [...prev.filter(l => !l.startsWith('a')), 'a2']);
                sounds.play('tree');
            }, 500);
            setRaceTimeout(() => {
                setActiveLights(prev => [...prev.filter(l => !l.startsWith('a')), 'a3']);
                sounds.play('tree');
            }, 1000);
            setRaceTimeout(() => {
                setActiveLights(prev => [...prev.filter(l => !l.startsWith('a')), 'green']);
                setGameState('RACING');
                sounds.play('tree'); // Green beep?
                launchTimeRef.current = Date.now();
            }, 1500);

            // Set Expected Time (1500ms from now)
            expectedGreenTimeRef.current = Date.now() + 1500;

        } else {
            // Pro Tree (400ms total delay)
            const greenTime = Date.now() + 400;
            expectedGreenTimeRef.current = greenTime;

            setRaceTimeout(() => {
                setActiveLights(prev => [...prev, 'a1', 'a2', 'a3']);
                sounds.play('tree');
            }, 0);
            setRaceTimeout(() => {
                setActiveLights(prev => [...prev.filter(l => !l.startsWith('a')), 'green']);
                setGameState('RACING');
                sounds.play('tree');
                launchTimeRef.current = Date.now();
            }, 400);
        }
    };

    return (
        <div className="dr-container relative">

            {showResults && playerResult && computerResult && (
                <RaceResults
                    playerResult={playerResult}
                    computerResult={computerResult}
                    onClose={handleReset}
                />
            )}



            {/* Left Column: Settings */}
            <div className="dr-column-left">
                <LeftColumn
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    treeType={treeType}
                    setTreeType={setTreeType}
                    soundEnabled={soundEnabled}
                    setSoundEnabled={setSoundEnabled}
                />
            </div>

            {/* Center Column: Cockpit */}
            <div className="dr-column-center">
                <CenterCockpit
                    gameState={gameState}
                    activeLights={activeLights}
                    telemetry={telemetry}
                />
            </div>

            {/* Right Column: Controls */}
            <div className="dr-column-right">
                <RightColumn
                    gameState={gameState}
                    onPreStage={handlePreStage}
                    onStage={handleStage}
                    onLaunch={handleLaunch}
                    onShift={handleShift}
                    bestET={bestET}
                />
            </div>
        </div>
    );
}
