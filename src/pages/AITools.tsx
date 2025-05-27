
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ExternalLink, Star, Search, BookOpen, Code, MessageSquare, Image, Film, Music, Users, Bot, Sparkles } from "lucide-react";

type AITool = {
    id: string;
    name: string;
    description: string;
    url: string;
    image: string;
    category: string[];
    tags: string[];
    pricing: "Free" | "Freemium" | "Paid" | "Free Trial";
    rating?: number;
};

const aiTools: AITool[] = [
    {
        id: "chatgpt",
        name: "ChatGPT",
        description: "Assistente de IA conversacional avançado capaz de responder perguntas, auxiliar na escrita, explicar conceitos e muito mais.",
        url: "https://chat.openai.com/",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png",
        category: ["Chatbots", "Escrita", "Produtividade"],
        tags: ["IA Conversacional", "GPT", "OpenAI"],
        pricing: "Freemium",
        rating: 4.8
    },
    {
        id: "lovable",
        name: "Lovable",
        description: "Plataforma que permite criar aplicativos web completos conversando com uma IA. Ideal para prototipar e desenvolver projetos rapidamente.",
        url: "https://lovable.dev",
        image: "https://cdn.lovable.dev/assets/lovable-icon.png",
        category: ["Desenvolvimento", "Design"],
        tags: ["Desenvolvimento Web", "No-Code", "Low-Code"],
        pricing: "Freemium",
        rating: 4.7
    },
    {
        id: "midjourney",
        name: "Midjourney",
        description: "Ferramenta de geração de imagens por IA que cria ilustrações de alta qualidade a partir de descrições textuais.",
        url: "https://www.midjourney.com/",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
        category: ["Imagens", "Design"],
        tags: ["Geração de Imagens", "Arte Digital"],
        pricing: "Paid",
        rating: 4.9
    },
    {
        id: "copilot",
        name: "GitHub Copilot",
        description: "Assistente de programação baseado em IA que ajuda a escrever código sugerindo linhas ou funções completas direto no seu editor.",
        url: "https://github.com/features/copilot",
        image: "https://github.gallerycdn.vsassets.io/extensions/github/copilot/1.143.0/1700156764630/Microsoft.VisualStudio.Services.Icons.Default",
        category: ["Desenvolvimento", "Produtividade"],
        tags: ["Assistente de Código", "GitHub", "Programação"],
        pricing: "Paid",
        rating: 4.8
    },
    {
        id: "perplexity",
        name: "Perplexity AI",
        description: "Mecanismo de pesquisa impulsionado por IA que fornece respostas detalhadas com citações de fontes, ideal para pesquisas aprofundadas.",
        url: "https://www.perplexity.ai/",
        image: "https://cdn.sanity.io/images/u0v1th4q/production/67045586fd9115ccb804bc7d6bee5ad2acf885c3-512x512.png",
        category: ["Pesquisa", "Conhecimento"],
        tags: ["Mecanismo de Busca", "Pesquisa IA"],
        pricing: "Freemium",
        rating: 4.6
    },
    {
        id: "claude",
        name: "Claude AI",
        description: "Assistente de IA da Anthropic que se destaca por respostas detalhadas, nuancadas e por seguir instruções complexas.",
        url: "https://claude.ai/",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_of_Claude_%28AI%29.svg/2048px-Logo_of_Claude_%28AI%29.svg.png",
        category: ["Chatbots", "Escrita", "Produtividade"],
        tags: ["IA Conversacional", "Anthropic"],
        pricing: "Freemium",
        rating: 4.7
    },
    {
        id: "v0",
        name: "v0.dev",
        description: "Ferramenta de geração de interfaces por IA que cria código React e Tailwind a partir de descrições textuais.",
        url: "https://v0.dev/",
        image: "https://v0.dev/apple-icon.png",
        category: ["Desenvolvimento", "Design"],
        tags: ["UI/UX", "React", "Tailwind"],
        pricing: "Free",
        rating: 4.5
    },
    {
        id: "dalle",
        name: "DALL-E",
        description: "Sistema de geração de imagens da OpenAI que cria imagens realistas e artísticas a partir de descrições textuais.",
        url: "https://openai.com/dall-e-3",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/DALL-E_Logo.png/800px-DALL-E_Logo.png",
        category: ["Imagens", "Design"],
        tags: ["Geração de Imagens", "OpenAI"],
        pricing: "Paid",
        rating: 4.8
    },
    {
        id: "huggingface",
        name: "Hugging Face",
        description: "Plataforma que oferece acesso a milhares de modelos de IA de código aberto para várias tarefas como NLP, visão computacional e mais.",
        url: "https://huggingface.co/",
        image: "https://avatars.githubusercontent.com/u/25720743?s=200&v=4",
        category: ["Desenvolvimento", "Pesquisa"],
        tags: ["Modelos de IA", "Open-Source", "NLP"],
        pricing: "Freemium",
        rating: 4.6
    },
    {
        id: "zapier",
        name: "Zapier AI",
        description: "Automatize tarefas com IA integrando centenas de aplicativos e criando fluxos de trabalho personalizados.",
        url: "https://zapier.com/ai",
        image: "https://cdn.sanity.io/images/ornj730p/production/e98e7e338de006d698f1094ebcac8a598f9d92bc-512x512.png",
        category: ["Automação", "Produtividade"],
        tags: ["Automação", "Integração"],
        pricing: "Freemium",
        rating: 4.5
    },
    {
        id: "codeium",
        name: "Codeium",
        description: "Alternativa gratuita ao GitHub Copilot, oferece autocompletar de código em vários editores e linguagens de programação.",
        url: "https://codeium.com/",
        image: "https://codeium.com/favicon.ico",
        category: ["Desenvolvimento"],
        tags: ["Assistente de Código", "IA para Programação"],
        pricing: "Free",
        rating: 4.4
    },
    {
        id: "elevenlabs",
        name: "ElevenLabs",
        description: "Plataforma de síntese de voz com IA que gera vozes humanas realistas em vários idiomas e estilos emocionais.",
        url: "https://elevenlabs.io/",
        image: "https://avatars.githubusercontent.com/u/121858069?s=200&v=4",
        category: ["Áudio", "Conteúdo"],
        tags: ["Síntese de Voz", "Text-to-Speech"],
        pricing: "Freemium",
        rating: 4.7
    }
];

const categories = [
    { id: "all", name: "Todos", icon: Sparkles },
    { id: "chatbots", name: "Chatbots", icon: MessageSquare },
    { id: "development", name: "Desenvolvimento", icon: Code },
    { id: "images", name: "Imagens", icon: Image },
    { id: "productivity", name: "Produtividade", icon: Users },
    { id: "research", name: "Pesquisa", icon: BookOpen },
    { id: "audio", name: "Áudio", icon: Music },
    { id: "video", name: "Vídeo", icon: Film }
];

const categoryMap: Record<string, string> = {
    all: "Todos",
    chatbots: "Chatbots",
    development: "Desenvolvimento",
    images: "Imagens",
    productivity: "Produtividade",
    research: "Pesquisa",
    audio: "Áudio",
    video: "Vídeo",
    favorites: "Favoritos"
};


const AITools = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [favoriteTools, setFavoriteTools] = useState<string[]>(() => {
        const saved = localStorage.getItem('favorite-ai-tools');
        return saved ? JSON.parse(saved) : [];
    });

    const handleToggleFavorite = (id: string) => {
        setFavoriteTools(prev => {
            if (prev.includes(id)) {
                return prev.filter(toolId => toolId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const saveFavorites = (favorites: string[]) => {
        localStorage.setItem('favorite-ai-tools', JSON.stringify(favorites));
    };

    const filteredTools = aiTools.filter(tool => {
        const matchesSearch = searchTerm === "" ||
            tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory =
            activeCategory === "all" ||
            (activeCategory === "favorites" && favoriteTools.includes(tool.id)) ||
            tool.category.some(
                cat => cat.toLowerCase() === categoryMap[activeCategory]?.toLowerCase()
            );

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container mx-auto max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold mb-6">Ferramentas de IA</h1>

                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Pesquisar ferramentas de IA..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
                    <TabsList className="w-full overflow-x-auto flex flex-nowrap mb-6">
                        {categories.map(category => (
                            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                                <category.icon size={16} />
                                <span>{category.name}</span>
                            </TabsTrigger>
                        ))}
                        {favoriteTools.length > 0 && (
                            <TabsTrigger value="favorites" className="flex items-center gap-1">
                                <Star size={16} />
                                <span>Favoritos</span>
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value={activeCategory} className="mt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                            {filteredTools.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <Bot size={48} className="mx-auto text-muted-foreground opacity-20" />
                                    <p className="mt-4 text-lg font-medium text-muted-foreground">
                                        {searchTerm ? "Nenhuma ferramenta encontrada para esta pesquisa." : "Nenhuma ferramenta nesta categoria."}
                                    </p>
                                </div>
                            ) : (
                                filteredTools.map((tool, index) => (
                                    <AIToolCard
                                        key={tool.id}
                                        tool={tool}
                                        index={index}
                                        isFavorite={favoriteTools.includes(tool.id)}
                                        onToggleFavorite={() => {
                                            handleToggleFavorite(tool.id);
                                            saveFavorites(
                                                favoriteTools.includes(tool.id)
                                                    ? favoriteTools.filter(id => id !== tool.id)
                                                    : [...favoriteTools, tool.id]
                                            );
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Sobre as Ferramentas de IA</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Como usar esta página</CardTitle>
                        <CardDescription>
                            Conheça e acesse rapidamente as ferramentas de IA mais úteis
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            Esta página reúne uma curadoria das melhores ferramentas de inteligência artificial disponíveis atualmente.
                            Você pode filtrar por categoria, pesquisar por nome ou descrição, e favoritar suas ferramentas preferidas para acesso rápido.
                        </p>
                        <p>
                            Cada cartão contém informações essenciais sobre a ferramenta, incluindo:
                        </p>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Nome e descrição da ferramenta</li>
                            <li>Categorias e tags relacionadas</li>
                            <li>Modelo de preço (Grátis, Freemium, Pago)</li>
                            <li>Link direto para acessar a ferramenta</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

interface AIToolCardProps {
    tool: AITool;
    index: number;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

const AIToolCard = ({ tool, index, isFavorite, onToggleFavorite }: AIToolCardProps) => {
    const getPricingColor = (pricing: AITool['pricing']) => {
        switch (pricing) {
            case "Free": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Freemium": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "Paid": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "Free Trial": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            default: return "";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="h-full"
        >
            <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 shrink-0 rounded overflow-hidden bg-background">
                                <img
                                    src={tool.image}
                                    alt={tool.name}
                                    className="h-full w-full object-contain"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.style.display = 'none';
                                    }}
                                />
                            </div>
                            <div>
                                <CardTitle className="text-lg">{tool.name}</CardTitle>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleFavorite}
                            className={isFavorite ? "text-yellow-500" : "text-muted-foreground"}
                        >
                            <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="flex-grow pb-0">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {tool.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                        {tool.category.slice(0, 3).map(category => (
                            <Badge key={category} variant="outline" className="text-xs">
                                {category}
                            </Badge>
                        ))}
                        <Badge className={`text-xs border ${getPricingColor(tool.pricing)}`}>
                            {tool.pricing}
                        </Badge>
                    </div>
                </CardContent>

                <CardFooter className="pt-4">
                    <Button asChild className="w-full">
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={16} className="mr-2" /> Abrir Ferramenta
                        </a>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default AITools;