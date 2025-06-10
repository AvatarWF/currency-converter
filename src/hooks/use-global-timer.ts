import { useState, useEffect, useRef, useCallback } from "react";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

type TimerSettings = {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
    autoStart: boolean;
};

type TimerState = {
    activeTab: TimerMode;
    isRunning: boolean;
    timeRemaining: number;
    sessionsCompleted: number;
    settings: TimerSettings;
    dailyStats: {
        date: string;
        sessions: number;
        totalFocusTime: number;
    };
};

const defaultSettings: TimerSettings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStart: false,
};

const getTodayKey = () => {
    return new Date().toISOString().split('T')[0];
};

const getInitialState = (): TimerState => {
    const savedSettings = localStorage.getItem("pomodoroSettings");
    const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;

    const savedState = sessionStorage.getItem("pomodoroTimerState");
    const todayKey = getTodayKey();

    // Get daily stats
    const dailyStatsKey = `pomodoroStats_${todayKey}`;
    const savedDailyStats = localStorage.getItem(dailyStatsKey);
    const dailyStats = savedDailyStats ? JSON.parse(savedDailyStats) : {
        date: todayKey,
        sessions: 0,
        totalFocusTime: 0
    };

    if (savedState) {
        const state = JSON.parse(savedState);
        return {
            ...state,
            settings,
            dailyStats
        };
    }

    return {
        activeTab: "pomodoro",
        isRunning: false,
        timeRemaining: settings.pomodoro * 60,
        sessionsCompleted: dailyStats.sessions,
        settings,
        dailyStats
    };
};

export const useGlobalTimer = () => {
    const [state, setState] = useState<TimerState>(getInitialState);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [onCompleteCallback, setOnCompleteCallback] = useState<(() => void) | null>(null);

    // Save state to sessionStorage whenever it changes
    useEffect(() => {
        const stateToSave = {
            activeTab: state.activeTab,
            isRunning: state.isRunning,
            timeRemaining: state.timeRemaining,
            sessionsCompleted: state.sessionsCompleted
        };
        sessionStorage.setItem("pomodoroTimerState", JSON.stringify(stateToSave));
    }, [state.activeTab, state.isRunning, state.timeRemaining, state.sessionsCompleted]);

    // Save daily stats to localStorage
    useEffect(() => {
        const todayKey = getTodayKey();
        const dailyStatsKey = `pomodoroStats_${todayKey}`;
        localStorage.setItem(dailyStatsKey, JSON.stringify(state.dailyStats));
    }, [state.dailyStats]);

    // Timer logic
    useEffect(() => {
        if (state.isRunning) {
            timerRef.current = setInterval(() => {
                setState(prev => {
                    if (prev.timeRemaining <= 1) {
                        handleTimerComplete();
                        return { ...prev, timeRemaining: 0, isRunning: false };
                    }
                    return { ...prev, timeRemaining: prev.timeRemaining - 1 };
                });
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [state.isRunning]);

    const handleTimerComplete = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Play completion sound
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.play().catch(() => {});

        setState(prev => {
            const todayKey = getTodayKey();
            let newState = { ...prev };

            if (prev.activeTab === "pomodoro") {
                // Complete a pomodoro session
                const newSessionsCompleted = prev.sessionsCompleted + 1;
                const focusTimeAdded = prev.settings.pomodoro;

                newState = {
                    ...newState,
                    sessionsCompleted: newSessionsCompleted,
                    dailyStats: {
                        date: todayKey,
                        sessions: newSessionsCompleted,
                        totalFocusTime: prev.dailyStats.totalFocusTime + focusTimeAdded
                    }
                };

                // Determine next mode
                const nextMode = (newSessionsCompleted % 4 === 0) ? "longBreak" : "shortBreak";
                newState.activeTab = nextMode;
                newState.timeRemaining = prev.settings[nextMode] * 60;

                if (prev.settings.autoStart) {
                    setTimeout(() => {
                        setState(s => ({ ...s, isRunning: true }));
                    }, 500);
                }
            } else {
                // Complete a break
                newState.activeTab = "pomodoro";
                newState.timeRemaining = prev.settings.pomodoro * 60;

                if (prev.settings.autoStart) {
                    setTimeout(() => {
                        setState(s => ({ ...s, isRunning: true }));
                    }, 500);
                }
            }

            return newState;
        });

        // Call external callback if set
        if (onCompleteCallback) {
            onCompleteCallback();
        }
    }, [onCompleteCallback]);

    const startPauseTimer = useCallback(() => {
        setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
    }, []);

    const resetTimer = useCallback(() => {
        setState(prev => ({
            ...prev,
            timeRemaining: prev.settings[prev.activeTab] * 60,
            isRunning: false
        }));
    }, []);

    const changeMode = useCallback((mode: TimerMode) => {
        setState(prev => ({
            ...prev,
            activeTab: mode,
            timeRemaining: prev.settings[mode] * 60,
            isRunning: false
        }));
    }, []);

    const updateSettings = useCallback((newSettings: TimerSettings) => {
        setState(prev => ({
            ...prev,
            settings: newSettings,
            timeRemaining: newSettings[prev.activeTab] * 60,
            isRunning: false
        }));
        localStorage.setItem("pomodoroSettings", JSON.stringify(newSettings));
    }, []);

    const registerCompletionCallback = useCallback((callback: () => void) => {
        setOnCompleteCallback(() => callback);
    }, []);

    return {
        ...state,
        startPauseTimer,
        resetTimer,
        changeMode,
        updateSettings,
        registerCompletionCallback
    };
};