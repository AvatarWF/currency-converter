import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Music,
    Repeat,
    Shuffle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Track = {
    id: number;
    title: string;
    artist: string;
    source: string;
    image: string;
};

const tracks: Track[] = [
    {
        id: 1,
        title: "Relaxing Study",
        artist: "Lo-Fi Beats",
        source: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
        image: "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bG8lMjBmaXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
        id: 2,
        title: "Chill Morning",
        artist: "Ambient Vibes",
        source: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6435fe0.mp3?filename=chill-abstract-intention-12099.mp3",
        image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpbGwlMjB2aWJlfGVufDB8fDB8fHww",
    },
    {
        id: 3,
        title: "Focus Flow",
        artist: "Deep Concentration",
        source: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_cb4f1f9d0c.mp3?filename=moment-14023.mp3",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bXVzaWN8ZW58MHx8MHx8fDA%3D",
    }
];

const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const LofiMusic = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(60);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { toast } = useToast();

    const currentTrack = tracks[currentTrackIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
            audioRef.current.muted = isMuted;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(error => {
                    console.error("Playback error:", error);
                    toast({
                        title: "Erro de Reprodução",
                        description: "Não foi possível reproduzir a música. Tente novamente.",
                        variant: "destructive",
                    });
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackIndex, toast]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        }
    };

    const handleTrackEnded = () => {
        if (isRepeat) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(console.error);
            }
        } else if (isShuffle) {
            const nextIndex = Math.floor(Math.random() * tracks.length);
            setCurrentTrackIndex(nextIndex);
        } else {
            handleNext();
        }
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handlePrevious = () => {
        setCurrentTrackIndex((prevIndex) => {
            const newIndex = prevIndex === 0 ? tracks.length - 1 : prevIndex - 1;
            return newIndex;
        });
    };

    const handleNext = () => {
        setCurrentTrackIndex((prevIndex) => {
            const newIndex = prevIndex === tracks.length - 1 ? 0 : prevIndex + 1;
            return newIndex;
        });
    };

    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0];
        setVolume(newVolume);
        if (newVolume === 0) {
            setIsMuted(true);
        } else if (isMuted) {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0];
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Lo-Fi Music Player</h1>

            <Card className="overflow-hidden">
                <div className="relative aspect-video">
                    <img
                        src={currentTrack.image}
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <Music size={80} className="text-white opacity-70" />
                    </div>
                </div>

                <CardContent className="p-6">
                    <audio
                        ref={audioRef}
                        src={currentTrack.source}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleTrackEnded}
                        onLoadedData={handleTimeUpdate}
                    />

                    <div className="mb-4 text-center">
                        <h3 className="text-2xl font-bold">{currentTrack.title}</h3>
                        <p className="text-muted-foreground">{currentTrack.artist}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <span className="text-sm">{formatTime(currentTime)}</span>
                            <Slider
                                value={[currentTime]}
                                min={0}
                                max={duration || 100}
                                step={1}
                                onValueChange={handleSeek}
                                className="flex-1 mx-2"
                            />
                            <span className="text-sm">{formatTime(duration)}</span>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsShuffle(!isShuffle)}
                                className={isShuffle ? "text-primary" : ""}
                            >
                                <Shuffle size={20} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handlePrevious}>
                                <SkipBack size={20} />
                            </Button>
                            <Button
                                variant="default"
                                size="icon"
                                className="h-12 w-12 rounded-full"
                                onClick={handlePlayPause}
                            >
                                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleNext}>
                                <SkipForward size={20} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsRepeat(!isRepeat)}
                                className={isRepeat ? "text-primary" : ""}
                            >
                                <Repeat size={20} />
                            </Button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button variant="ghost" size="icon" onClick={toggleMute}>
                                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </Button>
                            <Slider
                                value={[isMuted ? 0 : volume]}
                                min={0}
                                max={100}
                                step={1}
                                onValueChange={handleVolumeChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Playlist</h2>
                <div className="space-y-2">
                    {tracks.map((track, index) => (
                        <div
                            key={track.id}
                            className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                                currentTrackIndex === index ? 'bg-accent/70' : ''
                            }`}
                            onClick={() => {
                                setCurrentTrackIndex(index);
                                setIsPlaying(true);
                            }}
                        >
                            <div className="h-12 w-12 rounded overflow-hidden mr-4">
                                <img
                                    src={track.image}
                                    alt={track.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className={`font-medium ${currentTrackIndex === index ? 'text-primary' : ''}`}>
                                    {track.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">{track.artist}</p>
                            </div>
                            {currentTrackIndex === index && isPlaying && (
                                <div className="ml-auto">
                                    <div className="flex items-center space-x-1">
                                        <div className="h-2 w-1 bg-primary animate-pulse"></div>
                                        <div className="h-3 w-1 bg-primary animate-pulse"></div>
                                        <div className="h-4 w-1 bg-primary animate-pulse"></div>
                                        <div className="h-2 w-1 bg-primary animate-pulse"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LofiMusic;