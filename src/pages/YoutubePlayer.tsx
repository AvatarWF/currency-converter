import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
    Search,
    Play,
    Heart,
    Clock,
    Trash2,
    Youtube,
    Star,
    ExternalLink,
    History,
    X,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface YouTubeVideo {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
    publishedAt: string;
}

interface SavedVideo {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
    savedAt: string;
}

interface WatchHistory {
    id: string;
    title: string;
    watchedAt: string;
}

const YoutubePlayer = () => {
    const [videoUrl, setVideoUrl] = useState("");
    const [videoId, setVideoId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
    const [savedVideos, setSavedVideos] = useState<SavedVideo[]>(() => {
        const saved = localStorage.getItem('saved-youtube-videos');
        return saved ? JSON.parse(saved) : [];
    });
    const [watchHistory, setWatchHistory] = useState<WatchHistory[]>(() => {
        const saved = localStorage.getItem('youtube-watch-history');
        return saved ? JSON.parse(saved) : [];
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        localStorage.setItem('saved-youtube-videos', JSON.stringify(savedVideos));
        localStorage.setItem('youtube-watch-history', JSON.stringify(watchHistory));
    }, [savedVideos, watchHistory]);

    const sampleVideos: YouTubeVideo[] = [
        {
            id: "dQw4w9WgXcQ",
            title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
            channelTitle: "Rick Astley",
            thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            publishedAt: "2009-10-25T06:57:33Z"
        },
        {
            id: "5qap5aO4i9A",
            title: "lofi hip hop radio - beats to relax/study to",
            channelTitle: "Lofi Girl",
            thumbnailUrl: "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg",
            publishedAt: "2020-02-22T19:51:37Z"
        },
        {
            id: "jfKfPfyJRdk",
            title: "lofi hip hop radio - beats to sleep/chill to",
            channelTitle: "Lofi Girl",
            thumbnailUrl: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
            publishedAt: "2021-02-19T01:13:14Z"
        },
        {
            id: "hFDOGYEPZ8E",
            title: "Novo Feat e Técnica de Programação que Está Revolucionando o Dev JavaScript",
            channelTitle: "Filipe Deschamps",
            thumbnailUrl: "https://i.ytimg.com/vi/hFDOGYEPZ8E/hqdefault.jpg",
            publishedAt: "2023-08-09T21:12:37Z"
        },
        {
            id: "BrnMl1R4sKA",
            title: "MIT: Introduction to Deep Learning",
            channelTitle: "Alexander Amini",
            thumbnailUrl: "https://i.ytimg.com/vi/BrnMl1R4sKA/hqdefault.jpg",
            publishedAt: "2023-01-09T15:47:22Z"
        }
    ];

    const extractVideoIdFromUrl = (url: string): string | null => {
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);
        return match ? match[1] : null;
    };

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const extractedId = extractVideoIdFromUrl(videoUrl);

        if (!extractedId) {
            toast({
                title: "URL inválida",
                description: "Por favor, insira uma URL válida do YouTube.",
                variant: "destructive"
            });
            return;
        }

        setVideoId(extractedId);
        addToWatchHistory(extractedId);
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            toast({
                title: "Termo de busca inválido",
                description: "Por favor, digite algo para buscar.",
                variant: "destructive"
            });
            return;
        }

        const results = sampleVideos.filter(video =>
            video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.channelTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(results);
        setIsSearchOpen(true);
    };

    const playVideo = (id: string, title?: string) => {
        setVideoId(id);
        setVideoUrl(`https://www.youtube.com/watch?v=${id}`);
        addToWatchHistory(id, title);
    };

    const addToWatchHistory = (id: string, title?: string) => {
        const videoTitle = title || sampleVideos.find(v => v.id === id)?.title || savedVideos.find(v => v.id === id)?.title || "Video desconhecido";

        const historyEntry: WatchHistory = {
            id,
            title: videoTitle,
            watchedAt: new Date().toISOString()
        };

        setWatchHistory(prev => {
            const filtered = prev.filter(item => item.id !== id);
            return [historyEntry, ...filtered].slice(0, 20);
        });
    };

    const toggleSaveVideo = (video: YouTubeVideo) => {
        const isAlreadySaved = savedVideos.some(v => v.id === video.id);

        if (isAlreadySaved) {
            setSavedVideos(savedVideos.filter(v => v.id !== video.id));
            toast({
                title: "Vídeo removido",
                description: "O vídeo foi removido dos favoritos.",
            });
        } else {
            const savedVideo: SavedVideo = {
                id: video.id,
                title: video.title,
                channelTitle: video.channelTitle,
                thumbnailUrl: video.thumbnailUrl,
                savedAt: new Date().toISOString()
            };

            setSavedVideos([...savedVideos, savedVideo]);
            toast({
                title: "Vídeo salvo",
                description: "O vídeo foi adicionado aos favoritos.",
            });
        }
    };

    const clearHistory = () => {
        setWatchHistory([]);
        toast({
            title: "Histórico limpo",
            description: "Seu histórico de visualização foi apagado.",
        });
    };

    const clearSavedVideos = () => {
        setSavedVideos([]);
        toast({
            title: "Favoritos limpos",
            description: "Todos os vídeos favoritos foram removidos.",
        });
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto max-w-4xl">
            <motion.h1
                className="text-3xl font-bold mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Player do YouTube
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Reprodutor de vídeos</CardTitle>
                        <CardDescription>
                            Cole um link do YouTube ou pesquise vídeos para assistir
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUrlSubmit} className="flex gap-2 mb-4">
                            <Input
                                placeholder="Cole um link do YouTube (ex: https://youtube.com/watch?v=...)"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit">Reproduzir</Button>
                        </form>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Pesquisar vídeos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                />
                            </div>
                            <Button onClick={handleSearch} variant="outline">Pesquisar</Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
                {/* Video Player */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {videoId ? (
                        <div className="aspect-video relative overflow-hidden rounded-lg border bg-card">
                            <iframe
                                ref={iframeRef}
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : (
                        <div className="aspect-video flex items-center justify-center rounded-lg border bg-card">
                            <div className="text-center">
                                <Youtube size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                                <p className="text-muted-foreground">
                                    Nenhum vídeo carregado. Cole um link do YouTube ou pesquise vídeos acima.
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Search Results */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Collapsible
                        open={isSearchOpen}
                        onOpenChange={setIsSearchOpen}
                        className="mb-6"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Resultados da Pesquisa</h2>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    {isSearchOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </Button>
                            </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="mt-4">
                            {searchResults.length === 0 ? (
                                <Card>
                                    <CardContent className="text-center p-6 text-muted-foreground">
                                        Nenhum resultado encontrado. Tente outros termos de pesquisa.
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {searchResults.map((video) => (
                                        <Card key={video.id} className="overflow-hidden">
                                            <div className="grid grid-cols-[120px,1fr] sm:grid-cols-[180px,1fr]">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => playVideo(video.id, video.title)}
                                                >
                                                    <div className="relative h-full">
                                                        <img
                                                            src={video.thumbnailUrl}
                                                            alt={video.title}
                                                            className="object-cover h-full w-full"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                                            <Play size={36} className="text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3
                                                        className="font-medium line-clamp-2 hover:text-primary cursor-pointer"
                                                        onClick={() => playVideo(video.id, video.title)}
                                                    >
                                                        {video.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {video.channelTitle}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center text-xs text-muted-foreground">
                                                            <Clock size={14} className="mr-1" />
                                                            {formatDate(video.publishedAt)}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant={savedVideos.some(v => v.id === video.id) ? "default" : "outline"}
                                                                size="sm"
                                                                className="h-8"
                                                                onClick={() => toggleSaveVideo(video)}
                                                            >
                                                                <Heart size={14} className="mr-1" />
                                                                {savedVideos.some(v => v.id === video.id) ? "Salvo" : "Salvar"}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={`https://www.youtube.com/watch?v=${video.id}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <ExternalLink size={14} className="mr-1" />
                                                                    YouTube
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                </motion.div>

                {/* Favorites */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Collapsible
                        open={isFavoritesOpen}
                        onOpenChange={setIsFavoritesOpen}
                        className="mb-6"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center">
                                <Star size={18} className="text-yellow-500 mr-2" />
                                Vídeos Favoritos
                            </h2>
                            <div className="flex gap-2">
                                {savedVideos.length > 0 && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Trash2 size={14} />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Limpar favoritos</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tem certeza que deseja remover todos os vídeos favoritos?
                                                    Esta ação não pode ser desfeita.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={clearSavedVideos}>Limpar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        {isFavoritesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                        </div>

                        <CollapsibleContent className="mt-4">
                            {savedVideos.length === 0 ? (
                                <Card>
                                    <CardContent className="text-center p-6 text-muted-foreground">
                                        <Star size={36} className="mx-auto opacity-20 mb-3" />
                                        Você não tem vídeos favoritos ainda.
                                        Use o botão "Salvar" nos resultados da pesquisa.
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <AnimatePresence>
                                        {savedVideos.map((video) => (
                                            <motion.div
                                                key={video.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                                layout
                                            >
                                                <Card className="overflow-hidden h-full flex flex-col">
                                                    <div
                                                        className="cursor-pointer relative"
                                                        onClick={() => playVideo(video.id, video.title)}
                                                    >
                                                        <img
                                                            src={video.thumbnailUrl}
                                                            alt={video.title}
                                                            className="w-full aspect-video object-cover"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                                            <Play size={36} className="text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="p-3 flex-grow">
                                                        <h3
                                                            className="font-medium line-clamp-2 hover:text-primary cursor-pointer"
                                                            onClick={() => playVideo(video.id, video.title)}
                                                        >
                                                            {video.title}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {video.channelTitle}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 pt-0 mt-auto">
                                                        <div className="flex justify-between items-center">
                                                            <Badge variant="secondary" className="text-xs">Favorito</Badge>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-destructive"
                                                                onClick={() => toggleSaveVideo({
                                                                    id: video.id,
                                                                    title: video.title,
                                                                    channelTitle: video.channelTitle,
                                                                    thumbnailUrl: video.thumbnailUrl,
                                                                    publishedAt: video.savedAt
                                                                })}
                                                            >
                                                                <X size={14} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                </motion.div>

                {/* Watch History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <Collapsible
                        open={isHistoryOpen}
                        onOpenChange={setIsHistoryOpen}
                        className="mb-6"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center">
                                <History size={18} className="mr-2" />
                                Histórico de Reprodução
                            </h2>
                            <div className="flex gap-2">
                                {watchHistory.length > 0 && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Trash2 size={14} />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Limpar histórico</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tem certeza que deseja limpar todo o histórico de reprodução?
                                                    Esta ação não pode ser desfeita.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={clearHistory}>Limpar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        {isHistoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                        </div>

                        <CollapsibleContent className="mt-4">
                            {watchHistory.length === 0 ? (
                                <Card>
                                    <CardContent className="text-center p-6 text-muted-foreground">
                                        <Clock size={36} className="mx-auto opacity-20 mb-3" />
                                        Seu histórico de reprodução está vazio.
                                        Reproduza alguns vídeos para ver seu histórico aqui.
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card>
                                    <CardContent className="p-3">
                                        <ul className="divide-y">
                                            {watchHistory.map((item) => (
                                                <li
                                                    key={`${item.id}-${item.watchedAt}`}
                                                    className="py-2 flex justify-between items-center hover:bg-accent/20 rounded-md px-2 transition-colors"
                                                >
                                                    <div
                                                        className="flex-1 cursor-pointer truncate"
                                                        onClick={() => playVideo(item.id, item.title)}
                                                    >
                                                        <div className="flex items-center">
                                                            <Play size={14} className="mr-2 flex-shrink-0" />
                                                            <span className="truncate">{item.title}</span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                                                            <Clock size={12} className="mr-1" />
                                                            {formatDate(item.watchedAt)}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="ml-2"
                                                    >
                                                        <a
                                                            href={`https://www.youtube.com/watch?v=${item.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                </motion.div>
            </div>
        </div>
    );
};

export default YoutubePlayer;