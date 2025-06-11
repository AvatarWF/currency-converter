import { Link } from "react-router-dom";
import {
    CheckSquare,
    ListTodo,
    FileText,
    Music,
    Clock,
    Search,
    Globe,
    Droplet,
    Database,
    FileJson,
    Zap,
    Layout,
    Coffee,
    Newspaper,
    Bot,
    DollarSign,
    Scroll,
    Youtube,
    Trello
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Category = {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    color: string;
};

type Tool = {
    name: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    category: string;
    highlight?: boolean;
};

const categories: Category[] = [
    {
        id: "productivity",
        name: "Produtividade",
        icon: <Zap className="h-5 w-5" />,
        description: "Ferramentas para maximizar sua eficiência",
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: "development",
        name: "Desenvolvimento",
        icon: <Layout className="h-5 w-5" />,
        description: "Utilitários essenciais para desenvolvedores",
        color: "from-purple-500 to-pink-500"
    },
    {
        id: "utilities",
        name: "Utilitários",
        icon: <Globe className="h-5 w-5" />,
        description: "Ferramentas práticas para o dia a dia",
        color: "from-green-500 to-emerald-500"
    },
    {
        id: "entertainment",
        name: "Entretenimento",
        icon: <Music className="h-5 w-5" />,
        description: "Relaxe e divirta-se durante os intervalos",
        color: "from-orange-500 to-red-500"
    },
];

const tools: Tool[] = [
    // Produtividade
    {
        name: "To-Do List",
        description: "Organize suas tarefas com facilidade",
        icon: <ListTodo className="h-8 w-8" />,
        path: "/todo",
        category: "productivity",
        highlight: true
    },
    {
        name: "Kanban Board",
        description: "Gerencie projetos com quadros visuais",
        icon: <Trello className="h-8 w-8" />,
        path: "/kanban",
        category: "productivity"
    },
    {
        name: "Pomodoro Timer",
        description: "Técnica de produtividade com intervalos",
        icon: <Clock className="h-8 w-8" />,
        path: "/pomodoro",
        category: "productivity"
    },
    {
        name: "Notepad",
        description: "Anotações rápidas e simples",
        icon: <Scroll className="h-8 w-8" />,
        path: "/notepad",
        category: "productivity"
    },
    {
        name: "Water Reminder",
        description: "Lembrete para se hidratar regularmente",
        icon: <Droplet className="h-8 w-8" />,
        path: "/water-reminder",
        category: "productivity"
    },
    {
        name: "Internet Search",
        description: "Pesquise na web entre as melhores opções do FlowHub",
        icon: <Search className="h-8 w-8" />,
        path: "/internet-search",
        category: "productivity"
    },

    // Desenvolvimento
    {
        name: "AI Tools",
        description: "Ferramentas de inteligência artificial",
        icon: <Bot className="h-8 w-8" />,
        path: "/ai-tools",
        category: "development"
    },
    {
        name: "Deploy Checklist",
        description: "Lista de verificação para deploys",
        icon: <CheckSquare className="h-8 w-8" />,
        path: "/deploy-checklist",
        category: "development"
    },
    {
        name: "Code Snippets",
        description: "Gerenciador de trechos de código",
        icon: <FileText className="h-8 w-8" />,
        path: "/code-snippets",
        category: "development"
    },
    {
        name: "Quick Search",
        description: "Pesquisa rápida em projetos",
        icon: <Search className="h-8 w-8" />,
        path: "/search",
        category: "development"
    },
    {
        name: "Fake Data Generator",
        description: "Gere dados falsos para testes",
        icon: <Database className="h-8 w-8" />,
        path: "/fake-data",
        category: "development"
    },
    {
        name: "JSON Formatter",
        description: "Formate e valide JSON facilmente",
        icon: <FileJson className="h-8 w-8" />,
        path: "/json-formatter",
        category: "development"
    },

    // Utilitários
    {
        name: "Currency Converter",
        description: "Conversor de moedas em tempo real",
        icon: <DollarSign className="h-8 w-8" />,
        path: "/currency-converter",
        category: "utilities"
    },
    {
        name: "Tech News",
        description: "Últimas notícias de tecnologia",
        icon: <Newspaper className="h-8 w-8" />,
        path: "/tech-news",
        category: "utilities"
    },

    // Entretenimento
    {
        name: "Lo-Fi Music",
        description: "Concentre-se com música ambiente",
        icon: <Music className="h-8 w-8" />,
        path: "/lofi",
        category: "entertainment"
    },
    {
        name: "YouTube Player",
        description: "Player de vídeos do YouTube",
        icon: <Youtube className="h-8 w-8" />,
        path: "/youtube-player",
        category: "entertainment",
        highlight: true
    },
];

const Index = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

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

    const getToolsByCategory = (categoryId: string) => {
        return tools.filter(tool => tool.category === categoryId);
    };

    return (
        <div ref={containerRef} className="min-h-screen">
            <motion.section
                className="relative h-screen flex items-center justify-center overflow-hidden"
                style={{ y: backgroundY }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <motion.div
                    className="relative z-10 text-center px-4 max-w-6xl mx-auto"
                    style={{ y: textY }}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="mb-8"
                    >
                        <div className="relative inline-block">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-full blur-2xl opacity-30 animate-pulse"></div>
                            <div className="relative flex items-center justify-center bg-background rounded-full p-8 border border-primary/20 shadow-2xl">
                                <Zap size={80} className="text-primary" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 mb-6"
                    >
                        FlowHub
                    </motion.h1>

                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-2xl md:text-3xl text-muted-foreground mb-8 leading-relaxed"
                    >
                        Seu hub definitivo de ferramentas para
                        <span className="text-primary font-semibold"> produtividade</span> e
                        <span className="text-primary font-semibold"> desenvolvimento</span>
                    </motion.p>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
                    >
                        <span className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                            {tools.length} Ferramentas
                        </span>
                        <span className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                            {categories.length} Categorias
                        </span>
                        <span className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                            100% Gratuito
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="mt-12"
                    >
                        <div className="animate-bounce">
                            <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
                                <div className="w-1 h-3 bg-primary/50 rounded-full mt-2 animate-pulse"></div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.section>

            <div className="py-20 px-4 max-w-7xl mx-auto">
                {categories.map((category, categoryIndex) => (
                    <motion.section
                        key={category.id}
                        className="mb-20"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                    delay: categoryIndex * 0.1
                                }
                            }
                        }}
                    >
                        <motion.div
                            className="text-center mb-12"
                            variants={item}
                        >
                            <div className={`inline-flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r ${category.color} text-white shadow-xl mb-6`}>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    {category.icon}
                                </div>
                                <div className="text-left">
                                    <h2 className="text-3xl font-bold">{category.name}</h2>
                                    <p className="text-white/90 text-sm">{category.description}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            variants={container}
                        >
                            {getToolsByCategory(category.id).map((tool) => (
                                <motion.div key={tool.name} variants={item}>
                                    <Link to={tool.path} className="block h-full group">
                                        <motion.div
                                            className={`relative p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm h-full transition-all duration-300 overflow-hidden ${
                                                tool.highlight ? 'ring-2 ring-primary/20' : ''
                                            }`}
                                            whileHover={{
                                                y: -8,
                                                scale: 1.02,
                                                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)"
                                            }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {tool.highlight && (
                                                <div className="absolute -top-0 -right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                                                    Popular
                                                </div>
                                            )}

                                            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>

                                            <div className="relative z-10">
                                                <div className="mb-4 p-3 bg-primary/10 rounded-xl w-fit group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                                    <div className="text-primary">
                                                        {tool.icon}
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                                    {tool.name}
                                                </h3>

                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {tool.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.section>
                ))}

                <motion.section
                    className="mb-20 flex-wrap"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    <motion.div
                        className="text-center mb-12"
                        variants={item}
                    >
                        <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl mb-6">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Coffee className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-3xl font-bold">Apoie o Projeto</h2>
                                <p className="text-white/90 text-sm">Ajude a manter o FlowHub sempre evoluindo</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={item}
                        className="max-w-md mx-auto"
                    >
                        <Link to="/donation" className="block group">
                            <motion.div
                                className="relative p-8 rounded-2xl border-2 border-dashed border-primary/40 bg-card/50 backdrop-blur-sm text-center overflow-hidden"
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                    borderColor: "hsl(var(--primary))"
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    <div className="mb-4 mx-auto p-4 bg-amber-500/10 rounded-xl w-fit group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                                        <Coffee className="h-8 w-8 text-amber-500 mx-auto" />
                                    </div>

                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-500 transition-colors">
                                        Compre-me um café ☕
                                    </h3>

                                    <p className="text-muted-foreground text-sm">
                                        Gostou do FlowHub? Considere fazer uma doação para apoiar o desenvolvimento contínuo.
                                    </p>
                                </div>
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.section>

                <motion.div
                    className="mt-20 p-12 border border-border rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm text-center relative overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <motion.h2
                            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                            initial={{ scale: 0.9 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Pronto para turbinar sua produtividade? 🚀
                        </motion.h2>

                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Explore todas as ferramentas e descubra como o FlowHub pode transformar seu fluxo de trabalho.
                        </p>

                        <div className="text-muted-foreground">
                            <p className="mb-2">Desenvolvido com ❤️ por</p>
                            <a
                                href="https://dev-gg.vercel.app/"
                                className="text-primary hover:text-primary/80 font-semibold text-lg transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Gabriel Girardi
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Index;