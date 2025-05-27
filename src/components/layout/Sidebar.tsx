import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    CheckSquare,
    ListTodo,
    FileText,
    Music,
    Clock,
    Search,
    Sun,
    Moon,
    Globe,
    Droplet,
    Database,
    FileJson,
    Home,
    Menu,
    X,
    Coffee,
    Newspaper,
    Bot,
    CloudSun,
    DollarSign,
    Scroll,
    Youtube,
    Trello
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItem = {
    name: string;
    icon: React.ElementType;
    path: string;
    category?: string;
};

const navItems: NavItem[] = [
    { name: "Home", icon: Home, path: "/" },
    { name: "To-Do List", icon: ListTodo, path: "/todo", category: "productivity" },
    { name: "Kanban", icon: Trello, path: "/kanban", category: "productivity" },
    { name: "Pomodoro", icon: Clock, path: "/pomodoro", category: "productivity" },
    { name: "Notepad", icon: Scroll, path: "/notepad", category: "productivity" },
    { name: "Lo-Fi Music", icon: Music, path: "/lofi", category: "entertainment" },
    { name: "YouTube Player", icon: Youtube, path: "/youtube-player", category: "entertainment" },
    { name: "Weather", icon: CloudSun, path: "/weather", category: "utilities" },
    { name: "Currency Converter", icon: DollarSign, path: "/currency-converter", category: "utilities" },
    { name: "Water Reminder", icon: Droplet, path: "/water-reminder", category: "productivity" },
    { name: "Internet Search", icon: Globe, path: "/internet-search", category: "productivity" },
    { name: "Tech News", icon: Newspaper, path: "/tech-news", category: "information" },
    { name: "AI Tools", icon: Bot, path: "/ai-tools", category: "development" },
    { name: "Deploy Checklist", icon: CheckSquare, path: "/deploy-checklist", category: "development" },
    { name: "Code Snippets", icon: FileText, path: "/code-snippets", category: "development" },
    { name: "Quick Search", icon: Search, path: "/search", category: "development" },
    { name: "Fake Data", icon: Database, path: "/fake-data", category: "development" },
    { name: "JSON Formatter", icon: FileJson, path: "/json-formatter", category: "development" },
    { name: "Apoie o Projeto", icon: Coffee, path: "/donation" },
];

interface SidebarProps {
    theme: string;
    toggleTheme: () => void;
}

export function Sidebar({ theme, toggleTheme }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showAllItems, setShowAllItems] = useState(false);
    const location = useLocation();
    const isMobile = useIsMobile();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileSidebar = () => {
        setMobileOpen(!mobileOpen);
    };

    const categories = {
        productivity: "Produtividade",
        development: "Desenvolvimento",
        utilities: "Utilitários",
        entertainment: "Entretenimento",
        information: "Informação",
    };

    const groupedItems = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
        if (!item.category) {
            if (!acc["other"]) acc["other"] = [];
            acc["other"].push(item);
            return acc;
        }

        if (!acc[item.category]) {
            acc[item.category] = [];
        }

        acc[item.category].push(item);
        return acc;
    }, {});

    const priorityItems = [
        ...groupedItems.productivity?.slice(0, 3) || [],
        ...groupedItems.development?.slice(0, 2) || [],
        ...groupedItems.utilities?.slice(0, 1) || [],
        ...groupedItems.entertainment?.slice(0, 1) || [],
    ];

    const homeItem = navItems.find(item => item.path === "/");
    if (homeItem) {
        priorityItems.unshift(homeItem);
    }

    const donationItem = navItems.find(item => item.path === "/donation");
    const displayedItems = showAllItems ? navItems : priorityItems;

    return (
        <>
            {isMobile && (
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed top-4 left-4 z-50"
                    onClick={toggleMobileSidebar}
                >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </Button>
            )}

            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
                    collapsed && !isMobile ? "w-16" : "w-64",
                    isMobile ? (mobileOpen ? "translate-x-0" : "-translate-x-full") : ""
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                        <h1 className={cn(
                            "font-bold text-xl text-primary transition-opacity duration-300",
                            collapsed && !isMobile ? "opacity-0 w-0 hidden" : "opacity-100"
                        )}>
                            FlowHub
                        </h1>
                        {!isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleSidebar}
                                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                                <Menu size={18} />
                            </Button>
                        )}
                    </div>

                    <nav className="flex-1 overflow-y-auto p-2">
                        <TooltipProvider delayDuration={0}>
                            <ul className="space-y-1">
                                {displayedItems.map((item) => {
                                    if (item.path === "/donation") return null; // Skip donation item, we'll add it at the end

                                    const isActive = location.pathname === item.path;

                                    return (
                                        <li key={item.name}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        to={item.path}
                                                        className={cn(
                                                            "flex items-center p-2 rounded-md transition-colors",
                                                            isActive
                                                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                                                            collapsed && !isMobile ? "justify-center" : "justify-start"
                                                        )}
                                                        onClick={() => isMobile && setMobileOpen(false)}
                                                    >
                                                        <item.icon size={18} />
                                                        {(!collapsed || isMobile) && (
                                                            <span className="ml-3 truncate">
                                                                {item.name}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </TooltipTrigger>
                                                {(collapsed && !isMobile) && (
                                                    <TooltipContent side="right">
                                                        {item.name}
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </li>
                                    );
                                })}

                                {(!collapsed || isMobile) && navItems.length > priorityItems.length && (
                                    <li>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-muted-foreground hover:text-foreground"
                                            onClick={() => setShowAllItems(!showAllItems)}
                                        >
                                            {showAllItems ? "Mostrar menos" : "Mostrar mais"}
                                        </Button>
                                    </li>
                                )}

                                {donationItem && (
                                    <li className="mt-4">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    to={donationItem.path}
                                                    className={cn(
                                                        "flex items-center p-2 rounded-md transition-colors border border-dashed border-primary/50",
                                                        location.pathname === donationItem.path
                                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                            : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                                                        collapsed && !isMobile ? "justify-center" : "justify-start"
                                                    )}
                                                    onClick={() => isMobile && setMobileOpen(false)}
                                                >
                                                    <donationItem.icon size={18} className="text-primary" />
                                                    {(!collapsed || isMobile) && (
                                                        <span className="ml-3 truncate text-primary font-medium">
                                                          {donationItem.name}
                                                        </span>
                                                    )}
                                                </Link>
                                            </TooltipTrigger>
                                            {(collapsed && !isMobile) && (
                                                <TooltipContent side="right">
                                                    {donationItem.name}
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </li>
                                )}
                            </ul>
                        </TooltipProvider>
                    </nav>

                    <div className={cn(
                        "p-4 border-t border-sidebar-border flex",
                        collapsed && !isMobile ? "justify-center" : "justify-between"
                    )}>
                        {(!collapsed || isMobile) && (
                            <span className="text-sm text-sidebar-foreground/80">Theme</span>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}