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
    Coffee
} from "lucide-react";
import { motion } from "framer-motion";

type Category = {
    id: string;
    name: string;
    icon: React.ReactNode;
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
    { id: "productivity", name: "Produtividade", icon: <Zap className="h-5 w-5" /> },
    { id: "development", name: "Desenvolvimento", icon: <Layout className="h-5 w-5" /> },
];

const tools: Tool[] = [
    {
        name: "To-Do List",
        description: "Organize suas tarefas com facilidade",
        icon: <ListTodo className="h-8 w-8" />,
        path: "/todo",
        category: "productivity"
    },
    {
        name: "Deploy Checklist",
        description: "Certifique-se de que está tudo pronto",
        icon: <CheckSquare className="h-8 w-8" />,
        path: "/deploy-checklist",
        category: "development"
    },
    {
        name: "Code Snippets",
        description: "Acesse seus snippets de código rapidamente",
        icon: <FileText className="h-8 w-8" />,
        path: "/code-snippets",
        category: "development"
    },
    {
        name: "Lo-Fi Music",
        description: "Concentre-se com música lo-fi",
        icon: <Music className="h-8 w-8" />,
        path: "/lofi",
        category: "productivity"
    },
    {
        name: "Pomodoro",
        description: "Gerencie seu tempo de trabalho",
        icon: <Clock className="h-8 w-8" />,
        path: "/pomodoro",
        category: "productivity"
    },
    {
        name: "Quick Search",
        description: "Pesquisa rápida em seus projetos",
        icon: <Search className="h-8 w-8" />,
        path: "/search",
        category: "development"
    },
    {
        name: "Internet Search",
        description: "Pesquise na web sem sair do FlowHub",
        icon: <Globe className="h-8 w-8" />,
        path: "/internet-search",
        category: "productivity"
    },
    {
        name: "Water Reminder",
        description: "Lembrete para se hidratar",
        icon: <Droplet className="h-8 w-8" />,
        path: "/water-reminder",
        category: "productivity"
    },
    {
        name: "Fake Data",
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
];

const Index = () => {
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

    const logo = {
        hidden: { scale: 0.8, opacity: 0 },
        show: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                delay: 0.1
            }
        }
    };

    const banner = {
        hidden: { opacity: 0, y: -20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: 0.3
            }
        }
    };

    const getToolsByCategory = (categoryId: string) => {
        return tools.filter(tool => tool.category === categoryId);
    };

    return (
        <div className="py-8 px-4 max-w-7xl mx-auto">
            <motion.div
                className="text-center mb-16"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2
                        }
                    }
                }}
            >
                <motion.div
                    className="mb-6 flex justify-center"
                    variants={logo}
                >
                    <div className="relative inline-block">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-md opacity-75"></div>
                        <div className="relative flex items-center justify-center bg-background rounded-full p-6 border border-border shadow-md">
                            <Zap size={48} className="text-primary" />
                        </div>
                    </div>
                </motion.div>

                <motion.h1
                    className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-4"
                    variants={banner}
                >
                    FlowHub
                </motion.h1>

                <motion.p
                    className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    variants={banner}
                >
                    Seu hub de ferramentas para aumentar a produtividade e otimizar seu fluxo de trabalho.
                    Todas as ferramentas que você precisa em um só lugar.
                </motion.p>
            </motion.div>

            {categories.map((category) => (
                <motion.section
                    key={category.id}
                    className="mb-16"
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
                        className="flex items-center gap-3 mb-8"
                        variants={item}
                    >
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                            {category.icon}
                        </div>
                        <h2 className="text-2xl font-semibold">{category.name}</h2>
                        <div className="h-[1px] flex-1 bg-border"></div>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        variants={container}
                    >
                        {getToolsByCategory(category.id).map((tool) => (
                            <motion.div key={tool.name} variants={item}>
                                <Link to={tool.path} className="block h-full">
                                    <motion.div
                                        className="tool-card group h-full"
                                        whileHover={{
                                            y: -5,
                                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                                        }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="tool-card-icon group-hover:scale-110 transition-transform">
                                            {tool.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
                                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>
            ))}

            <motion.section
                className="mb-16"
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
                    className="flex items-center gap-3 mb-8"
                    variants={item}
                >
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                        <Coffee className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-semibold">Apoie o projeto</h2>
                    <div className="h-[1px] flex-1 bg-border"></div>
                </motion.div>

                <motion.div
                    variants={item}
                    className="max-w-xl mx-auto"
                >
                    <Link to="/donation" className="block h-full">
                        <motion.div
                            className="tool-card group h-full border-dashed border-primary/40"
                            whileHover={{
                                y: -5,
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="tool-card-icon group-hover:scale-110 transition-transform bg-primary/20">
                                <Coffee className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Apoie com um café</h3>
                            <p className="text-sm text-muted-foreground">Gostou do FlowHub? Considere fazer uma doação para apoiar o projeto.</p>
                        </motion.div>
                    </Link>
                </motion.div>
            </motion.section>

            <motion.div
                className="mt-12 p-8 border border-border rounded-xl bg-card/50 text-center relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl blur-sm opacity-50"></div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-3">Pronto para aumentar sua produtividade?</h2>
                    <p className="text-muted-foreground mb-6">
                        Explore todas as ferramentas e descubra como o FlowHub pode ajudar no seu dia a dia.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Index;