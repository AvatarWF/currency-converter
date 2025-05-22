import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from './theme-provider'
import { Menu, X, StickyNote, CheckSquare, List, Code, Music, Timer, SearchIcon, Settings, Moon, Sun } from 'lucide-react'

type Feature = 'notes' | 'todo' | 'deploy' | 'snippets' | 'music' | 'pomodoro' | 'settings'

interface SidebarProps {
    activeFeature: Feature
    setActiveFeature: (feature: Feature) => void
    isMobileMenuOpen: boolean
    setIsMobileMenuOpen: (isOpen: boolean) => void
    setIsSearchOpen: (isOpen: boolean) => void
}

export default function Sidebar({
    activeFeature,
    setActiveFeature,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsSearchOpen
}: SidebarProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const features = [
        { id: 'notes', label: 'Notas', icon: <StickyNote className="h-5 w-5" /> },
        { id: 'todo', label: 'To-Do', icon: <CheckSquare className="h-5 w-5" /> },
        { id: 'deploy', label: 'Deploy', icon: <List className="h-5 w-5" /> },
        { id: 'snippets', label: 'Snippets', icon: <Code className="h-5 w-5" /> },
        { id: 'music', label: 'Lo-Fi', icon: <Music className="h-5 w-5" /> },
        { id: 'pomodoro', label: 'Pomodoro', icon: <Timer className="h-5 w-5" /> },
        { id: 'settings', label: 'Temas', icon: <Settings className="h-5 w-5" /> },
    ]

    return (
        <>
            <div className="fixed top-4 left-4 z-40 md:hidden">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            <div className="fixed top-4 right-4 z-40 md:hidden">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Busca rápida"
                >
                    <SearchIcon className="h-5 w-5" />
                </Button>
            </div>

            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:z-0
            `}>
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h1 className="text-xl font-bold text-primary">FlowHub</h1>
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid gap-1 px-2">
                            {features.map((feature) => (
                                <Button
                                    key={feature.id}
                                    variant={activeFeature === feature.id ? "default" : "ghost"}
                                    className={`justify-start ${activeFeature === feature.id ? 'bg-primary text-primary-foreground' : ''}`}
                                    onClick={() => setActiveFeature(feature.id as Feature)}
                                >
                                    {feature.icon}
                                    <span className="ml-2">{feature.label}</span>
                                </Button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-4 border-t border-border">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <SearchIcon className="mr-2 h-4 w-4" />
                            Busca rápida
                            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    )
}