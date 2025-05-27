import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Radio, Sliders } from 'lucide-react';
// import SoundMixer from '@/components/lofi/SoundMixer';
import LiveStreamPlayer from '@/components/lofi/LiveStreamPlayer';

const LofiMusic = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Lo-Fi Music Studio
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Crie sua atmosfera perfeita com nosso mixer de sons ambientais e desfrute de transmissões lo-fi ao vivo
                </p>
            </div>

            <Tabs defaultValue="live" className="w-full">
                <TabsList className="grid w-full grid-cols-1 h-12">
                    {/*<TabsTrigger value="live" className="flex items-center gap-2 text-base">*/}
                    {/*    <Radio size={18} />*/}
                    {/*    Live Radio*/}
                    {/*</TabsTrigger>*/}
                    <TabsTrigger value="mixer" className="flex items-center gap-2 text-base" disabled>
                        <Sliders size={18} />
                        Sound Mixer
                    </TabsTrigger>
                </TabsList>

                {/*<TabsContent value="mixer" className="mt-6">*/}
                {/*    <SoundMixer />*/}
                {/*</TabsContent>*/}

                <TabsContent value="live" className="mt-6">
                    <LiveStreamPlayer />
                </TabsContent>
            </Tabs>

            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                        <Music className="text-amber-600 mt-1" size={20} />
                        <div>
                            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                                Dicas para uma Experiência Perfeita
                            </h3>
                            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                                {/*<li>• Combine diferentes sons do mixer para criar sua atmosfera única</li>*/}
                                <li>• Use fones de ouvido para uma experiência mais imersiva</li>
                                <li>• Experimente diferentes estações de rádio para variar o estilo</li>
                                <li>• Ajuste os volumes individualmente para encontrar o equilíbrio perfeito</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LofiMusic;