import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, ExternalLink, Search as SearchIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type SearchResult = {
    title: string;
    url: string;
    description: string;
    type?: string;
};

const InternetSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setSearchPerformed(true);

        setTimeout(() => {
            const demoResults: SearchResult[] = [
                {
                    title: `${searchQuery} - Wikipedia`,
                    url: `https://en.wikipedia.org/wiki/${searchQuery.replace(/\s+/g, '_')}`,
                    description: `Informações sobre ${searchQuery} da enciclopédia livre.`,
                    type: 'enciclopédia'
                },
                {
                    title: `${searchQuery} - Resultados de pesquisa`,
                    url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
                    description: `Encontre os melhores recursos sobre ${searchQuery} na web.`,
                    type: 'pesquisa'
                },
                {
                    title: `Aprenda sobre ${searchQuery}`,
                    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
                    description: `Vídeos tutoriais e explicações sobre ${searchQuery}.`,
                    type: 'vídeos'
                },
                {
                    title: `Imagens de ${searchQuery}`,
                    url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`,
                    description: `Explore imagens relacionadas a ${searchQuery}.`,
                    type: 'imagens'
                },
                {
                    title: `GitHub - ${searchQuery}`,
                    url: `https://github.com/search?q=${encodeURIComponent(searchQuery)}`,
                    description: `Repositórios e código relacionados a ${searchQuery}.`,
                    type: 'código'
                }
            ];

            setSearchResults(demoResults);
            setIsLoading(false);
        }, 800);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    const MotionCard = motion(Card);

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-8"
            >
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Globe size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Pesquisa na Internet</h1>
                    <p className="text-muted-foreground">Pesquise na web sem sair do FlowHub</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <Card className="overflow-hidden border-2 border-primary/20 mb-8">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                        <CardTitle className="flex items-center gap-2">
                            <SearchIcon size={18} />
                            Motor de Busca
                        </CardTitle>
                        <CardDescription>
                            Digite sua pesquisa para encontrar resultados na web
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch}>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="O que você quer pesquisar?"
                                        className="pl-9 transition-all border-primary/20 focus-visible:ring-primary/30"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="transition-transform hover:scale-105"
                                >
                                    {isLoading ? (
                                        <>Pesquisando...</>
                                    ) : (
                                        <>
                                            Pesquisar
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <div className="mt-4 text-center text-sm text-muted-foreground">Pesquisando resultados...</div>
                    </div>
                </div>
            ) : searchResults.length > 0 ? (
                <motion.div
                    className="space-y-4"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {searchResults.map((result, index) => (
                        <motion.div key={index} variants={item}>
                            <MotionCard
                                className="overflow-hidden hover:shadow-md transition-all duration-300 hover:border-primary/30"
                                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1 text-primary hover:underline cursor-pointer">{result.title}</h3>
                                            <p className="text-sm text-muted-foreground">{result.description}</p>
                                        </div>
                                        {result.type && (
                                            <Badge variant="outline" className="bg-primary/5 text-primary text-xs">
                                                {result.type}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 pb-4 border-t border-border/50 mt-2 flex justify-between items-center">
                                    <a
                                        href={result.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline flex items-center"
                                    >
                                        {result.url.length > 50 ? result.url.substring(0, 50) + '...' : result.url}
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        Salvar
                                    </Button>
                                </CardFooter>
                            </MotionCard>
                        </motion.div>
                    ))}
                </motion.div>
            ) : searchPerformed ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12 bg-card/50 rounded-lg border border-border"
                >
                    <SearchIcon size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium mb-1">
                        Nenhum resultado encontrado
                    </p>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Não encontramos resultados para "{searchQuery}". Tente termos diferentes ou mais específicos.
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center py-12 bg-card/50 rounded-lg border border-border"
                >
                    <Globe size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium mb-1">
                        Digite sua pesquisa na barra acima
                    </p>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Você pode pesquisar por qualquer termo para encontrar resultados relevantes na web.
                    </p>
                </motion.div>
            )}

            <motion.div
                className="mt-8 p-6 border border-border rounded-xl bg-card/50 text-center relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl blur-sm opacity-50"></div>

                <div className="relative z-10">
                    <p className="text-muted-foreground mb-2">
                        Esta ferramenta permite pesquisar na internet sem sair do FlowHub.
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                        Os resultados são simulados para demonstração. Em uma versão completa,
                        seria integrado com APIs reais de busca.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default InternetSearch;