
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Share2, RefreshCw, Bookmark } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
        name: string;
    };
    category?: string;
}

const newsCategories = [
    { id: "latest", name: "Últimas" },
    { id: "ai", name: "Inteligência Artificial" },
    { id: "web", name: "Desenvolvimento Web" },
    { id: "mobile", name: "Mobile" },
    { id: "cybersecurity", name: "Cibersegurança" },
];

const fallbackImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const sampleNews: Record<string, NewsItem[]> = {
    latest: [
        {
            title: "Nova versão do React traz melhorias de performance",
            description: "O React 19 foi lançado com significativas melhorias de performance e novas funcionalidades que prometem revolucionar o desenvolvimento de interfaces.",
            url: "https://example.com/react-19",
            urlToImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            publishedAt: "2024-04-03T14:32:00Z",
            source: { name: "TechCrunch" },
            category: "latest"
        },
        {
            title: "Microsoft anuncia nova versão do Visual Studio",
            description: "O Visual Studio 2025 chega com integração avançada de IA, suporte aprimorado para desenvolvimento multiplataforma e ferramentas de depuração revolucionárias.",
            url: "https://example.com/vs-2025",
            urlToImage: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            publishedAt: "2024-04-02T09:15:00Z",
            source: { name: "The Verge" },
            category: "latest"
        },
        {
            title: "TypeScript 6.0 traz melhorias significativas na tipagem",
            description: "A nova versão do TypeScript promete melhorar ainda mais a experiência do desenvolvedor com novos recursos de tipagem e melhor integração com frameworks modernos.",
            url: "https://example.com/typescript-6",
            urlToImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            publishedAt: "2024-04-01T16:45:00Z",
            source: { name: "Medium" },
            category: "latest"
        }
    ],
    ai: [
        {
            title: "GPT-5 é anunciado com capacidades revolucionárias",
            description: "A OpenAI revelou o GPT-5, modelo com avanços significativos em raciocínio, habilidades matemáticas e compreensão contextual de longo prazo.",
            url: "https://example.com/gpt-5",
            urlToImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1365&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            publishedAt: "2024-04-03T18:30:00Z",
            source: { name: "Wired" },
            category: "ai"
        },
        {
            title: "Google apresenta avanços em IA generativa para imagens",
            description: "O novo modelo Gemini Vision promete revolucionar a geração de imagens com qualidade fotorrealista e maior compreensão contextual.",
            url: "https://example.com/gemini-vision",
            urlToImage: "https://images.unsplash.com/photo-1677442135136-760302221189?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            publishedAt: "2024-04-01T11:20:00Z",
            source: { name: "Google AI Blog" },
            category: "ai"
        }
    ],
    web: [
        {
            title: "Next.js 14 revoluciona o desenvolvimento web",
            description: "A nova versão do framework Next.js traz melhorias significativas em Server Components, melhor performance de compilação e novas APIs.",
            url: "https://example.com/nextjs-14",
            urlToImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            publishedAt: "2024-03-30T13:15:00Z",
            source: { name: "Vercel Blog" },
            category: "web"
        },
        {
            title: "CSS Container Queries finalmente disponível em todos os navegadores",
            description: "Uma das funcionalidades mais aguardadas por desenvolvedores front-end, CSS Container Queries agora tem suporte completo em todos os principais navegadores.",
            url: "https://example.com/css-container-queries",
            urlToImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            publishedAt: "2024-03-28T10:45:00Z",
            source: { name: "CSS-Tricks" },
            category: "web"
        }
    ],
    mobile: [
        {
            title: "Flutter 4.0 lançado com foco em performance e acessibilidade",
            description: "O novo Flutter 4.0 traz melhorias significativas de performance, novos widgets de material design 3 e ferramentas avançadas de acessibilidade.",
            url: "https://example.com/flutter-4",
            urlToImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            publishedAt: "2024-03-27T16:20:00Z",
            source: { name: "Flutter Dev" },
            category: "mobile"
        },
        {
            title: "Apple anuncia iOS 18 com recursos avançados de IA",
            description: "O novo sistema operacional da Apple promete transformar a experiência do iPhone com recursos de inteligência artificial integrados a todas as aplicações nativas.",
            url: "https://example.com/ios-18-ai",
            urlToImage: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            publishedAt: "2024-03-26T14:30:00Z",
            source: { name: "Apple Insider" },
            category: "mobile"
        }
    ],
    cybersecurity: [
        {
            title: "Nova vulnerabilidade crítica encontrada em sistemas Linux",
            description: "Especialistas descobriram falha crítica que afeta o kernel Linux, permitindo escalação de privilégios. Patch emergencial foi disponibilizado para todas as distribuições.",
            url: "https://example.com/linux-vulnerability",
            urlToImage: "https://images.unsplash.com/photo-1510511233900-1982d92bd835?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            publishedAt: "2024-03-25T09:10:00Z",
            source: { name: "Security Now" },
            category: "cybersecurity"
        },
        {
            title: "Ataques de ransomware aumentam 300% no primeiro trimestre de 2024",
            description: "Relatório aponta para crescimento alarmante de ataques de ransomware, com foco em infraestrutura crítica e organizações de saúde.",
            url: "https://example.com/ransomware-2024",
            urlToImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            publishedAt: "2024-03-24T15:40:00Z",
            source: { name: "CyberSecurity Hub" },
            category: "cybersecurity"
        }
    ]
};

const TechNews = () => {
    const [activeCategory, setActiveCategory] = useState<string>("latest");
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [savedArticles, setSavedArticles] = useState<NewsItem[]>(() => {
        const saved = localStorage.getItem('saved-tech-news');
        return saved ? JSON.parse(saved) : [];
    });

    const { toast } = useToast();

    const loadNews = () => {
        setLoading(true);

        setTimeout(() => {
            setNews(sampleNews[activeCategory] || []);
            setLoading(false);
        }, 800);
    };

    useEffect(() => {
        loadNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory]);

    useEffect(() => {
        localStorage.setItem('saved-tech-news', JSON.stringify(savedArticles));
    }, [savedArticles]);

    const handleSaveArticle = (article: NewsItem) => {
        const isAlreadySaved = savedArticles.some(item => item.url === article.url);

        if (isAlreadySaved) {
            setSavedArticles(savedArticles.filter(item => item.url !== article.url));
            toast({
                title: "Artigo removido",
                description: "O artigo foi removido dos favoritos.",
            });
        } else {
            setSavedArticles([...savedArticles, article]);
            toast({
                title: "Artigo salvo",
                description: "O artigo foi adicionado aos favoritos.",
            });
        }
    };

    const handleShareArticle = (article: NewsItem) => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.description,
                url: article.url,
            })
                .then(() => {
                    toast({
                        title: "Compartilhado",
                        description: "Link compartilhado com sucesso!",
                    });
                })
                .catch(error => {
                    console.error("Error sharing:", error);
                });
        } else {
            navigator.clipboard.writeText(article.url).then(() => {
                toast({
                    title: "Link copiado",
                    description: "O link foi copiado para a área de transferência.",
                });
            });
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    return (
        <div className="container mx-auto max-w-4xl">
            <motion.h1
                className="text-3xl font-bold mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Notícias de Tecnologia
            </motion.h1>

            <Tabs
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="mb-6"
            >
                <div className="flex justify-between items-center mb-4">
                    <TabsList className="overflow-x-auto flex-wrap">
                        {newsCategories.map((category) => (
                            <TabsTrigger key={category.id} value={category.id}>
                                {category.name}
                            </TabsTrigger>
                        ))}
                        {savedArticles.length > 0 && (
                            <TabsTrigger value="saved">
                                <Bookmark size={14} className="mr-1" /> Salvos
                            </TabsTrigger>
                        )}
                    </TabsList>

                    {activeCategory !== "saved" && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadNews}
                            className="ml-2"
                        >
                            <RefreshCw size={16} className="mr-1" />
                            Atualizar
                        </Button>
                    )}
                </div>

                <TabsContent value={activeCategory} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loading ? (
                            // Loading skeletons
                            Array(4).fill(null).map((_, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <div className="aspect-video w-full">
                                        <Skeleton className="h-full w-full" />
                                    </div>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-11/12 mb-2" />
                                        <Skeleton className="h-4 w-4/5" />
                                    </CardContent>
                                    <CardFooter>
                                        <Skeleton className="h-9 w-24" />
                                    </CardFooter>
                                </Card>
                            ))
                        ) : activeCategory === "saved" ? (
                            savedArticles.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <Bookmark size={48} className="mx-auto text-muted-foreground opacity-20" />
                                    <p className="mt-4 text-lg font-medium text-muted-foreground">
                                        Nenhum artigo salvo ainda. Salve artigos para ler mais tarde!
                                    </p>
                                </div>
                            ) : (
                                savedArticles.map((article, index) => (
                                    <NewsCard
                                        key={article.url}
                                        article={article}
                                        index={index}
                                        isSaved={true}
                                        onSave={handleSaveArticle}
                                        onShare={handleShareArticle}
                                    />
                                ))
                            )
                        ) : news.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-lg font-medium text-muted-foreground">
                                    Nenhuma notícia disponível nesta categoria.
                                </p>
                            </div>
                        ) : (
                            news.map((article, index) => (
                                <NewsCard
                                    key={article.url}
                                    article={article}
                                    index={index}
                                    isSaved={savedArticles.some(item => item.url === article.url)}
                                    onSave={handleSaveArticle}
                                    onShare={handleShareArticle}
                                />
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Sobre esta página</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        Esta página apresenta as últimas notícias sobre tecnologia em várias categorias.
                        Os dados apresentados são exemplos para fins de demonstração.
                    </p>
                    <p className="mt-2">
                        Em uma implementação real, seria necessário integrar com uma API de notícias para obter dados atualizados.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

interface NewsCardProps {
    article: NewsItem;
    index: number;
    isSaved: boolean;
    onSave: (article: NewsItem) => void;
    onShare: (article: NewsItem) => void;
}

const NewsCard = ({ article, index, isSaved, onSave, onShare }: NewsCardProps) => {
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card className="overflow-hidden h-full flex flex-col">
                <div className="aspect-video w-full overflow-hidden">
                    <img
                        src={article.urlToImage || fallbackImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = fallbackImage;
                        }}
                    />
                </div>

                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline">
                            {article.source.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
              {formatDate(article.publishedAt)}
            </span>
                    </div>
                    <CardTitle className="text-xl leading-tight">{article.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">
                        {article.description}
                    </p>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button variant="default" size="sm" asChild>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} className="mr-1" /> Ler mais
                        </a>
                    </Button>

                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onSave(article)}
                            className={isSaved ? "text-primary" : ""}
                        >
                            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onShare(article)}
                        >
                            <Share2 size={16} />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default TechNews;