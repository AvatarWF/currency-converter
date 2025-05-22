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
    Coffee
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
    { name: "Deploy Checklist", icon: CheckSquare, path: "/deploy-checklist", category: "development" },
    { name: "Code Snippets", icon: FileText, path: "/code-snippets", category: "development" },
    { name: "Lo-Fi Music", icon: Music, path: "/lofi", category: "productivity" },
    { name: "Pomodoro", icon: Clock, path: "/pomodoro", category: "productivity" },
    { name: "Quick Search", icon: Search, path: "/search", category: "development" },
    { name: "Internet Search", icon: Globe, path: "/internet-search", category: "productivity" },
    { name: "Water Reminder", icon: Droplet, path: "/water-reminder", category: "productivity" },
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
    const location = useLocation();
    const isMobile = useIsMobile();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileSidebar = () => {
        setMobileOpen(!mobileOpen);
    };

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
                            collapsed && !isMobile ? "opacity-0 w-0" : "opacity-100"
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
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    const isDonation = item.path === "/donation";

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
                                                            isDonation ? "mt-4 border border-dashed border-primary/50" : "",
                                                            collapsed && !isMobile ? "justify-center" : "justify-start"
                                                        )}
                                                        onClick={() => isMobile && setMobileOpen(false)}
                                                    >
                                                        <item.icon size={18} className={isDonation ? "text-primary" : ""} />
                                                        {(!collapsed || isMobile) && (
                                                            <span className={cn(
                                                                "ml-3 truncate",
                                                                isDonation ? "text-primary font-medium" : ""
                                                            )}>
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