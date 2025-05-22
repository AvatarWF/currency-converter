import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Droplet, Trash2, Plus } from "lucide-react";

type WaterRecord = {
    id: string;
    timestamp: number;
    amount: number;
};

type ReminderSettings = {
    enabled: boolean;
    interval: number;
    target: number;
};

const WaterReminder = () => {
    const [waterRecords, setWaterRecords] = useState<WaterRecord[]>(() => {
        const today = new Date().setHours(0, 0, 0, 0);
        const savedRecords = localStorage.getItem("waterRecords");
        if (!savedRecords) return [];

        const parsed = JSON.parse(savedRecords) as WaterRecord[];
        return parsed.filter(record => record.timestamp >= today);
    });

    const [settings, setSettings] = useState<ReminderSettings>(() => {
        const savedSettings = localStorage.getItem("waterReminderSettings");
        return savedSettings ? JSON.parse(savedSettings) : {
            enabled: true,
            interval: 60,
            target: 2000
        };
    });

    const [waterAmount, setWaterAmount] = useState(250);
    const { toast } = useToast();

    const totalWaterConsumed = waterRecords.reduce((sum, record) => sum + record.amount, 0);
    const progressPercentage = Math.min((totalWaterConsumed / settings.target) * 100, 100);

    useEffect(() => {
        let notificationTimer: NodeJS.Timeout | null = null;

        if (settings.enabled && Notification.permission === "granted") {
            notificationTimer = setInterval(() => {
                if (totalWaterConsumed < settings.target) {
                    new Notification("Lembrete de água!", {
                        body: "Está na hora de beber água! 💧",
                        icon: "/favicon.ico"
                    });

                    toast({
                        title: "Hora de se hidratar!",
                        description: "Não se esqueça de beber água regularmente.",
                        action: (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addWaterRecord()}
                            >
                                Registrar
                            </Button>
                        )
                    });
                }
            }, settings.interval * 60 * 1000);
        }

        return () => {
            if (notificationTimer) clearInterval(notificationTimer);
        };

    }, [settings.enabled, settings.interval, totalWaterConsumed, settings.target]);

    useEffect(() => {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("waterRecords", JSON.stringify(waterRecords));
    }, [waterRecords]);

    useEffect(() => {
        localStorage.setItem("waterReminderSettings", JSON.stringify(settings));
    }, [settings]);

    const addWaterRecord = () => {
        if (waterAmount <= 0) return;

        const record: WaterRecord = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            amount: waterAmount
        };

        setWaterRecords([...waterRecords, record]);

        toast({
            title: "Registro adicionado",
            description: `Você bebeu ${waterAmount}ml de água. Parabéns!`,
        });
    };

    const deleteWaterRecord = (id: string) => {
        setWaterRecords(waterRecords.filter(record => record.id !== id));
    };

    const handleIntervalChange = (value: number) => {
        setSettings({
            ...settings,
            interval: Math.max(15, Math.min(240, value))
        });
    };

    const handleTargetChange = (value: number) => {
        setSettings({
            ...settings,
            target: Math.max(500, Math.min(5000, value))
        });
    };

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Lembrete de Água</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Progresso de Hoje</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center">
                            <div className="relative w-40 h-40 mb-4">
                                <div className="absolute bottom-0 left-0 right-0 bg-primary/20 rounded-full overflow-hidden transition-all duration-1000"
                                     style={{ height: `${progressPercentage}%` }}>
                                    <div className="absolute inset-0 opacity-30">
                                        <div className="absolute w-full h-2 bg-primary animate-[wave_2s_ease-in-out_infinite]" style={{ top: '10%' }}></div>
                                        <div className="absolute w-full h-2 bg-primary animate-[wave_1.5s_ease-in-out_infinite]" style={{ top: '20%' }}></div>
                                        <div className="absolute w-full h-2 bg-primary animate-[wave_2.5s_ease-in-out_infinite]" style={{ top: '30%' }}></div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Droplet size={100} strokeWidth={1} className="text-primary" />
                                </div>
                            </div>

                            <p className="text-2xl font-bold mb-1">
                                {totalWaterConsumed} / {settings.target} ml
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {Math.round(progressPercentage)}% do objetivo diário
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Adicionar Registro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="waterAmount">Quantidade (ml)</Label>
                                <Input
                                    id="waterAmount"
                                    type="number"
                                    value={waterAmount}
                                    onChange={(e) => setWaterAmount(parseInt(e.target.value) || 0)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setWaterAmount(150)}
                                >
                                    150ml
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setWaterAmount(250)}
                                >
                                    250ml
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setWaterAmount(500)}
                                >
                                    500ml
                                </Button>
                            </div>

                            <Button
                                className="w-full"
                                onClick={addWaterRecord}
                                disabled={waterAmount <= 0}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Registro
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Configurações do Lembrete</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="enableReminder">Lembretes</Label>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={settings.enabled ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSettings({ ...settings, enabled: true })}
                                >
                                    Ligado
                                </Button>
                                <Button
                                    variant={!settings.enabled ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSettings({ ...settings, enabled: false })}
                                >
                                    Desligado
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="reminderInterval">Intervalo</Label>
                                <span className="text-sm text-muted-foreground">
                                    {settings.interval} minutos
                                </span>
                            </div>
                            <Input
                                id="reminderInterval"
                                type="range"
                                min={15}
                                max={240}
                                step={5}
                                value={settings.interval}
                                onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
                                className="cursor-pointer"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="waterTarget">Meta Diária</Label>
                                <span className="text-sm text-muted-foreground">
                                    {settings.target} ml
                                </span>
                            </div>
                            <Input
                                id="waterTarget"
                                type="range"
                                min={500}
                                max={5000}
                                step={100}
                                value={settings.target}
                                onChange={(e) => handleTargetChange(parseInt(e.target.value))}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Registros de Hoje</CardTitle>
                </CardHeader>
                <CardContent>
                    {waterRecords.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6">
                            Você ainda não registrou nenhuma hidratação hoje.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {waterRecords.map((record) => (
                                <li key={record.id} className="flex items-center justify-between p-2 border rounded-md">
                                    <div>
                                        <span className="font-medium">{record.amount} ml</span>
                                        <span className="text-sm text-muted-foreground ml-2">
                                          {new Date(record.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteWaterRecord(record.id)}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default WaterReminder;