import { useEffect, useState } from 'react'
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command'
import { StickyNote, CheckSquare, List, Code, Music, Timer, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Feature = 'notes' | 'todo' | 'deploy' | 'snippets' | 'music' | 'pomodoro' | 'settings'

interface SearchProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    setActiveFeature: (feature: Feature) => void
}

export default function Search({ isOpen, setIsOpen, setActiveFeature }: SearchProps) {
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setIsOpen(!isOpen)
            }

            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, setIsOpen])

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])

    if (!isOpen) return null

    const features = [
        { id: 'notes', label: 'Notas Rápidas', icon: <StickyNote className="h-5 w-5" /> },
        { id: 'todo', label: 'To-Do List', icon: <CheckSquare className="h-5 w-5" /> },
        { id: 'deploy', label: 'Checklist de Deploy', icon: <List className="h-5 w-5" /> },
        { id: 'snippets', label: 'Snippets de Código', icon: <Code className="h-5 w-5" /> },
        { id: 'music', label: 'Player de Música Lo-Fi', icon: <Music className="h-5 w-5" /> },
        { id: 'pomodoro', label: 'Pomodoro', icon: <Timer className="h-5 w-5" /> },
        { id: 'settings', label: 'Temas Customizáveis', icon: <Settings className="h-5 w-5" /> },
    ]

    const filteredFeatures = features.filter(feature =>
        feature.label.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSelect = (id: string) => {
        setActiveFeature(id as Feature)
        setIsOpen(false)
    }

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4">
                <div className="relative bg-card rounded-lg border shadow-lg">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>

                    <Command className="rounded-lg border-none">
                        <CommandInput
                            placeholder="Buscar funcionalidade..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            className="h-12"
                        />
                        <CommandList>
                            <CommandGroup heading="Funcionalidades">
                                {filteredFeatures.length > 0 ? (
                                    filteredFeatures.map(feature => (
                                        <CommandItem
                                            key={feature.id}
                                            onSelect={() => handleSelect(feature.id)}
                                            className="cursor-pointer"
                                        >
                                            {feature.icon}
                                            <span className="ml-2">{feature.label}</span>
                                        </CommandItem>
                                    ))
                                ) : (
                                    <p className="p-4 text-center text-sm text-muted-foreground">
                                        Nenhuma funcionalidade encontrada.
                                    </p>
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            </div>
        </div>
    )
}
