import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clipboard, Plus, Trash2, Code, Search, Filter } from "lucide-react";
import CodeHighlighter from "@/components/SyntaxHighlighter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type CodeSnippet = {
    id: string;
    title: string;
    description: string;
    code: string;
    language: string;
};

const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'css', label: 'CSS' },
    { value: 'markup', label: 'HTML' },
];

const CodeSnippets = () => {
    const [snippets, setSnippets] = useState<CodeSnippet[]>(() => {
        const savedSnippets = localStorage.getItem('codeSnippets');
        if (savedSnippets) {
            return JSON.parse(savedSnippets);
        }
        return [
            {
                id: '1',
                title: 'Hello World em JavaScript',
                description: 'Um simples Hello World em JavaScript',
                code: 'console.log("Hello World!");',
                language: 'javascript',
            },
            {
                id: '2',
                title: 'Fetch API',
                description: 'Exemplo de uso da Fetch API',
                code: `async function fetchData() {
                  try {
                    const response = await fetch('https://api.example.com/data');
                    const data = await response.json();
                    return data;
                  } catch (error) {
                    console.error('Error fetching data:', error);
                  }
                }`,
                language: 'javascript',
            },
        ];
    });

    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [activeTab, setActiveTab] = useState('view');
    const [searchTerm, setSearchTerm] = useState('');

    const [newSnippet, setNewSnippet] = useState<Omit<CodeSnippet, 'id'>>({
        title: '',
        description: '',
        code: '',
        language: 'javascript',
    });

    const { toast } = useToast();

    const saveSnippets = (updatedSnippets: CodeSnippet[]) => {
        localStorage.setItem('codeSnippets', JSON.stringify(updatedSnippets));
        setSnippets(updatedSnippets);
    };

    const handleAddSnippet = () => {
        if (!newSnippet.title || !newSnippet.code) {
            toast({
                title: "Campos incompletos",
                description: "Título e código são obrigatórios.",
                variant: "destructive",
            });
            return;
        }

        const snippet: CodeSnippet = {
            id: Date.now().toString(),
            ...newSnippet,
        };

        saveSnippets([...snippets, snippet]);

        setNewSnippet({
            title: '',
            description: '',
            code: '',
            language: 'javascript',
        });

        setActiveTab('view');

        toast({
            title: "Snippet adicionado",
            description: "Seu snippet de código foi salvo com sucesso.",
        });
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: "Código copiado!",
            description: "O código foi copiado para a área de transferência.",
        });
    };

    const handleDeleteSnippet = (id: string) => {
        const updatedSnippets = snippets.filter(snippet => snippet.id !== id);
        saveSnippets(updatedSnippets);

        toast({
            title: "Snippet removido",
            description: "O snippet foi excluído com sucesso.",
        });
    };

    const filteredSnippets = snippets.filter(snippet =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <Code size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Snippets de Código</h1>
                    <p className="text-muted-foreground">Organize e acesse seus trechos de código frequentes</p>
                </div>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="view" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Ver Snippets
                    </TabsTrigger>
                    <TabsTrigger value="add" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Adicionar Novo
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="view">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="mb-6"
                    >
                        <Card className="border-2 border-primary/20 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Search className="h-5 w-5" />
                                        Pesquisar Snippets
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                        className="text-xs"
                                    >
                                        Tema: {theme === 'dark' ? 'Escuro' : 'Claro'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 pb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar snippet por título ou descrição..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full border-primary/20 focus-visible:ring-primary/30"
                                    />
                                </div>
                            </CardContent>
                            {searchTerm && (
                                <CardFooter className="py-2 px-6 border-t bg-muted/20 flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Filtrando por: "{searchTerm}"</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSearchTerm('')}>
                                        Limpar
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    </motion.div>

                    {filteredSnippets.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-12 bg-card/50 rounded-lg border border-border"
                        >
                            <FileText size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium mb-1">
                                {searchTerm ? "Nenhum snippet encontrado" : "Nenhum snippet cadastrado"}
                            </p>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                {searchTerm
                                    ? `Não encontramos snippets para "${searchTerm}". Tente outros termos ou adicione um novo snippet.`
                                    : "Você ainda não tem snippets salvos. Adicione seu primeiro snippet de código."}
                            </p>
                            <Button onClick={() => setActiveTab('add')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Snippet
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="grid gap-6"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            {filteredSnippets.map((snippet) => (
                                <motion.div key={snippet.id} variants={item}>
                                    <MotionCard
                                        className="overflow-hidden hover:shadow-md transition-all duration-300 hover:border-primary/30"
                                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                    >
                                        <CardHeader className="pb-3 relative border-b border-border/50">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col gap-1">
                                                    <CardTitle>{snippet.title}</CardTitle>
                                                    {snippet.description && (
                                                        <CardDescription>
                                                            {snippet.description}
                                                        </CardDescription>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Badge variant="outline" className="bg-primary/5 text-primary text-xs">
                                                        {languageOptions.find(opt => opt.value === snippet.language)?.label || snippet.language}
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleCopyCode(snippet.code)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Clipboard className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDeleteSnippet(snippet.id)}
                                                        className="text-muted-foreground hover:text-destructive hover:border-destructive/30 h-8 w-8"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0 overflow-hidden">
                                            <div className="relative rounded-md overflow-hidden">
                                                <CodeHighlighter
                                                    code={snippet.code}
                                                    language={snippet.language}
                                                    theme={theme}
                                                />
                                            </div>
                                        </CardContent>
                                    </MotionCard>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </TabsContent>

                <TabsContent value="add">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card className="border-2 border-primary/20">
                            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="h-5 w-5" />
                                    Adicionar Novo Snippet
                                </CardTitle>
                                <CardDescription>
                                    Salve trechos de código para reutilização futura
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Título</Label>
                                        <Input
                                            id="title"
                                            placeholder="Título do snippet"
                                            value={newSnippet.title}
                                            onChange={(e) => setNewSnippet({
                                                ...newSnippet,
                                                title: e.target.value
                                            })}
                                            className="border-primary/20 focus-visible:ring-primary/30"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descrição (opcional)</Label>
                                        <Input
                                            id="description"
                                            placeholder="Descrição do snippet"
                                            value={newSnippet.description}
                                            onChange={(e) => setNewSnippet({
                                                ...newSnippet,
                                                description: e.target.value
                                            })}
                                            className="border-primary/20 focus-visible:ring-primary/30"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="language">Linguagem</Label>
                                        <Select
                                            value={newSnippet.language}
                                            onValueChange={(value) => setNewSnippet({
                                                ...newSnippet,
                                                language: value
                                            })}
                                        >
                                            <SelectTrigger className="border-primary/20 focus-visible:ring-primary/30">
                                                <SelectValue placeholder="Selecione uma linguagem" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {languageOptions.map(option => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="code">Código</Label>
                                        <Textarea
                                            id="code"
                                            placeholder="Cole seu código aqui"
                                            value={newSnippet.code}
                                            onChange={(e) => setNewSnippet({
                                                ...newSnippet,
                                                code: e.target.value
                                            })}
                                            className="font-mono min-h-[200px] border-primary/20 focus-visible:ring-primary/30"
                                        />
                                    </div>

                                    {newSnippet.code && (
                                        <div className="space-y-2 border-t border-border pt-4 mt-6">
                                            <Label>Pré-visualização</Label>
                                            <div className="bg-accent/30 rounded-md p-1">
                                                <CodeHighlighter
                                                    code={newSnippet.code}
                                                    language={newSnippet.language}
                                                    theme={theme}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <Button
                                            onClick={handleAddSnippet}
                                            className="w-full transition-transform hover:scale-[1.02]"
                                        >
                                            Salvar Snippet
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-8 bg-card/50 border border-border rounded-xl p-6"
            >
                <p className="text-center text-muted-foreground">
                    Guarde seus snippets de código mais utilizados para reutilizá-los facilmente.
                    <br/>
                    <span className="text-sm text-muted-foreground/80">
                        Os snippets ficam salvos no armazenamento local do seu navegador.
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default CodeSnippets;