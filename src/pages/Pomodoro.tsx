import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

type TimerSettings = {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
    autoStart: boolean;
};

const defaultSettings: TimerSettings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStart: false,
};

const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const Pomodoro = () => {
    const [activeTab, setActiveTab] = useState<TimerMode>("pomodoro");
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [timeRemaining, setTimeRemaining] = useState<number>(defaultSettings.pomodoro * 60);
    const [settings, setSettings] = useState<TimerSettings>(() => {
        const savedSettings = localStorage.getItem("pomodoroSettings");
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [editableSettings, setEditableSettings] = useState<TimerSettings>(settings);
    const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        setTimeRemaining(settings[activeTab] * 60);
        setIsRunning(false);

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        updateDocumentTitle(formatTime(settings[activeTab] * 60));

    }, [activeTab, settings]);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    updateDocumentTitle(formatTime(prev - 1));
                    return prev - 1;
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
    }, [isRunning]);

    const updateDocumentTitle = (time: string) => {
        document.title = `${time} - FlowHub Pomodoro`;
    };

    const handleTimerComplete = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsRunning(false);

        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.play();

        if (activeTab === "pomodoro") {
            setSessionsCompleted(prev => prev + 1);
            toast({
                title: "Pomodoro concluído!",
                description: "Hora de fazer uma pausa.",
            });

            const nextMode = sessionsCompleted % 4 === 3 ? "longBreak" : "shortBreak";
            setActiveTab(nextMode);

            if (settings.autoStart) {
                setTimeout(() => setIsRunning(true), 500);
            }
        } else {
            toast({
                title: "Pausa concluída!",
                description: "Hora de voltar ao trabalho.",
            });
            setActiveTab("pomodoro");

            if (settings.autoStart) {
                setTimeout(() => setIsRunning(true), 500);
            }
        }
    };

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setTimeRemaining(settings[activeTab] * 60);
        setIsRunning(false);
        updateDocumentTitle(formatTime(settings[activeTab] * 60));

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const saveSettings = () => {
        const newSettings = {
            ...editableSettings,
            pomodoro: Math.max(1, Math.min(60, editableSettings.pomodoro)),
            shortBreak: Math.max(1, Math.min(30, editableSettings.shortBreak)),
            longBreak: Math.max(1, Math.min(60, editableSettings.longBreak)),
        };

        setSettings(newSettings);
        localStorage.setItem("pomodoroSettings", JSON.stringify(newSettings));
        setIsSettingsOpen(false);
        setTimeRemaining(newSettings[activeTab] * 60);

        toast({
            title: "Configurações salvas",
            description: "As configurações do Pomodoro foram atualizadas.",
        });
    };

    const totalSeconds = settings[activeTab] * 60;
    const progressPercent = ((totalSeconds - timeRemaining) / totalSeconds) * 100;

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">Pomodoro Timer</h1>
            <Card className="mb-6">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle>Técnica Pomodoro</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        >
                            <Settings size={18} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as TimerMode)}
                        className="mb-6"
                    >
                        <TabsList className="grid grid-cols-3 mb-6">
                            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
                            <TabsTrigger value="shortBreak">Pausa Curta</TabsTrigger>
                            <TabsTrigger value="longBreak">Pausa Longa</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pomodoro">
                            <div className="text-center mb-2">
                                <p className="text-muted-foreground">Foco na tarefa</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="shortBreak">
                            <div className="text-center mb-2">
                                <p className="text-muted-foreground">Faça uma pausa rápida</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="longBreak">
                            <div className="text-center mb-2">
                                <p className="text-muted-foreground">Tempo para descanso</p>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="relative mb-6">
                        <svg className="w-full h-48" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                opacity="0.1"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercent / 100)}`}
                                transform="rotate(-90, 50, 50)"
                                className="text-primary transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                            <span className="text-4xl font-bold">
                                {formatTime(timeRemaining)}
                            </span>
                            <span className="text-sm text-muted-foreground mt-2">
                                {sessionsCompleted} sessões concluídas
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <Button
                            onClick={handleStartPause}
                            variant="default"
                            size="lg"
                            className="w-32"
                        >
                            {isRunning ? (
                                <>
                                    <Pause size={18} className="mr-2" /> Pausar
                                </>
                            ) : (
                                <>
                                    <Play size={18} className="mr-2" /> Iniciar
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            size="lg"
                            disabled={isRunning}
                        >
                            <RotateCcw size={18} />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {isSettingsOpen && (
                <Card>
                    <CardHeader>
                        <CardTitle>Configurações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="pomodoro">Duração do Pomodoro (min)</Label>
                                <Input
                                    id="pomodoro"
                                    type="number"
                                    min={1}
                                    max={60}
                                    value={editableSettings.pomodoro}
                                    onChange={(e) => setEditableSettings({
                                        ...editableSettings,
                                        pomodoro: Number(e.target.value)
                                    })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="shortBreak">Duração da Pausa Curta (min)</Label>
                                <Input
                                    id="shortBreak"
                                    type="number"
                                    min={1}
                                    max={30}
                                    value={editableSettings.shortBreak}
                                    onChange={(e) => setEditableSettings({
                                        ...editableSettings,
                                        shortBreak: Number(e.target.value)
                                    })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="longBreak">Duração da Pausa Longa (min)</Label>
                                <Input
                                    id="longBreak"
                                    type="number"
                                    min={1}
                                    max={60}
                                    value={editableSettings.longBreak}
                                    onChange={(e) => setEditableSettings({
                                        ...editableSettings,
                                        longBreak: Number(e.target.value)
                                    })}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="autoStart"
                                    checked={editableSettings.autoStart}
                                    onCheckedChange={(checked) => setEditableSettings({
                                        ...editableSettings,
                                        autoStart: checked === true
                                    })}
                                />
                                <Label htmlFor="autoStart">Iniciar automaticamente os timers</Label>
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsSettingsOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={saveSettings}
                                >
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Pomodoro;