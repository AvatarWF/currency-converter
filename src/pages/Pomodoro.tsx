
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
import { Play, Pause, RotateCcw, Settings, Clock, Coffee, Brain } from "lucide-react";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

type TimerSettings = {
    pomodoro: number; // minutes
    shortBreak: number; // minutes
    longBreak: number; // minutes
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const getThemeColors = () => {
        switch (activeTab) {
            case "pomodoro":
                return {
                    gradient: "from-red-400 via-pink-500 to-purple-600",
                    accent: "text-red-500",
                    button: "bg-red-500 hover:bg-red-600",
                    icon: "text-red-500",
                    progress: "stroke-red-500"
                };
            case "shortBreak":
                return {
                    gradient: "from-green-400 via-emerald-500 to-teal-600",
                    accent: "text-green-500",
                    button: "bg-green-500 hover:bg-green-600",
                    icon: "text-green-500",
                    progress: "stroke-green-500"
                };
            case "longBreak":
                return {
                    gradient: "from-blue-400 via-indigo-500 to-purple-600",
                    accent: "text-blue-500",
                    button: "bg-blue-500 hover:bg-blue-600",
                    icon: "text-blue-500",
                    progress: "stroke-blue-500"
                };
        }
    };

    const colors = getThemeColors();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-4`}>
                        Pomodoro Timer
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Técnica comprovada para aumentar sua produtividade
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl border-0">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className={colors.icon} size={24} />
                                        Timer Ativo
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <Settings size={18} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Tabs
                                    value={activeTab}
                                    onValueChange={(value) => setActiveTab(value as TimerMode)}
                                    className="mb-8"
                                >
                                    <TabsList className="grid grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-700">
                                        <TabsTrigger
                                            value="pomodoro"
                                            className="data-[state=active]:bg-red-500 data-[state=active]:text-white flex items-center gap-2"
                                        >
                                            <Brain size={16} />
                                            Foco
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="shortBreak"
                                            className="data-[state=active]:bg-green-500 data-[state=active]:text-white flex items-center gap-2"
                                        >
                                            <Coffee size={16} />
                                            Pausa
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="longBreak"
                                            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center gap-2"
                                        >
                                            <Coffee size={16} />
                                            Descanso
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="pomodoro">
                                        <div className="text-center mb-4">
                                            <p className="text-muted-foreground text-lg">🍅 Foque na sua tarefa principal</p>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="shortBreak">
                                        <div className="text-center mb-4">
                                            <p className="text-muted-foreground text-lg">☕ Faça uma pausa rápida</p>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="longBreak">
                                        <div className="text-center mb-4">
                                            <p className="text-muted-foreground text-lg">🌟 Tempo para relaxar</p>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="relative mb-8 flex justify-center">
                                    <div className="relative w-80 h-80">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                            {/* Background circle */}
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="text-gray-200 dark:text-gray-600"
                                            />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                strokeWidth="4"
                                                strokeDasharray={`${2 * Math.PI * 45}`}
                                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercent / 100)}`}
                                                className={`${colors.progress} transition-all duration-1000`}
                                            />
                                        </svg>
                                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                                          <span className={`text-6xl font-bold ${colors.accent} mb-2`}>
                                            {formatTime(timeRemaining)}
                                          </span>
                                                                <span className="text-sm text-muted-foreground">
                                            {activeTab === "pomodoro" ? "Trabalho" : "Pausa"}
                                          </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center space-x-4">
                                    <Button
                                        onClick={handleStartPause}
                                        size="lg"
                                        className={`w-40 ${colors.button} text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all`}
                                    >
                                        {isRunning ? (
                                            <>
                                                <Pause size={20} className="mr-2" /> Pausar
                                            </>
                                        ) : (
                                            <>
                                                <Play size={20} className="mr-2" /> Iniciar
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={handleReset}
                                        variant="outline"
                                        size="lg"
                                        disabled={isRunning}
                                        className="w-16 border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <RotateCcw size={20} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="text-purple-500" size={20} />
                                    Estatísticas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                            {sessionsCompleted}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Sessões concluídas hoje
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                                            <div className="font-semibold text-red-600">{settings.pomodoro}min</div>
                                            <div className="text-xs text-muted-foreground">Foco</div>
                                        </div>
                                        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                            <div className="font-semibold text-green-600">{settings.shortBreak}min</div>
                                            <div className="text-xs text-muted-foreground">Pausa</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {isSettingsOpen && (
                            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl border-0">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="text-blue-500" size={20} />
                                        Configurações
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="pomodoro" className="text-sm font-medium">
                                                Duração do Pomodoro (min)
                                            </Label>
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
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="shortBreak" className="text-sm font-medium">
                                                Duração da Pausa Curta (min)
                                            </Label>
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
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="longBreak" className="text-sm font-medium">
                                                Duração da Pausa Longa (min)
                                            </Label>
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
                                                className="mt-1"
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
                                            <Label htmlFor="autoStart" className="text-sm">
                                                Iniciar automaticamente
                                            </Label>
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsSettingsOpen(false)}
                                                size="sm"
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                onClick={saveSettings}
                                                size="sm"
                                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                            >
                                                Salvar
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pomodoro;