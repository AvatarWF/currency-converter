import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2, PlusCircle, CheckSquare, ListChecks } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

type ChecklistItem = {
    id: string;
    text: string;
    completed: boolean;
};

const DeployChecklist = () => {
    const [items, setItems] = useState<ChecklistItem[]>(() => {
        const savedItems = localStorage.getItem('deployChecklist');
        if (savedItems) {
            return JSON.parse(savedItems);
        }
        return [
            { id: '1', text: 'Executar todos os testes', completed: false },
            { id: '2', text: 'Verificar mensagens de console', completed: false },
            { id: '3', text: 'Verificar compatibilidade cross-browser', completed: false },
            { id: '4', text: 'Verificar responsividade', completed: false },
            { id: '5', text: 'Otimizar imagens e assets', completed: false },
            { id: '6', text: 'Verificar SEO', completed: false },
            { id: '7', text: 'Validar formulários', completed: false },
            { id: '8', text: 'Verificar performance', completed: false }
        ];
    });
    const [newItem, setNewItem] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        localStorage.setItem('deployChecklist', JSON.stringify(items));
    }, [items]);

    const addItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim() === '') return;

        const item = {
            id: Date.now().toString(),
            text: newItem.trim(),
            completed: false
        };

        setItems([...items, item]);
        setNewItem('');

        toast({
            title: "Item adicionado",
            description: "Novo item adicionado à checklist.",
        });
    };

    const toggleItem = (id: string) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                return { ...item, completed: !item.completed };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const deleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));

        toast({
            title: "Item removido",
            description: "O item foi excluído da checklist.",
        });
    };

    const completedCount = items.filter(item => item.completed).length;
    const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

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

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-8"
            >
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <CheckSquare size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Checklist de Deploy</h1>
                    <p className="text-muted-foreground">Verifique todos os passos antes de publicar seu projeto</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mb-8"
            >
                <Card className="overflow-hidden border-2 border-primary/20">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ListChecks size={18} />
                                    Progresso
                                </CardTitle>
                                <CardDescription>
                                    {completedCount} de {items.length} ({Math.round(progress)}%)
                                </CardDescription>
                            </div>
                            <div className="text-2xl font-bold">
                                {Math.round(progress)}%
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 50, duration: 0.8 }}
                            ></motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mb-8"
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlusCircle className="h-5 w-5 text-primary" />
                            Adicionar Item
                        </CardTitle>
                        <CardDescription>
                            Adicione novos itens para sua checklist de deploy
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={addItem} className="flex space-x-2">
                            <Input
                                placeholder="Novo item para checklist..."
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" className="transition-all hover:scale-105">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mb-8"
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-primary" />
                            Itens da Checklist
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {items.length === 0 && (
                                <p className="text-center py-8 text-muted-foreground italic">
                                    Nenhum item na checklist. Adicione itens acima.
                                </p>
                            )}

                            {items.map((item, index) => (
                                <motion.li
                                    key={item.id}
                                    variants={item}
                                    className="flex items-center justify-between p-3 border rounded-lg
                                    transition-all hover:bg-accent/20
                                    hover:border-primary/20 hover:shadow-sm"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id={`item-${item.id}`}
                                            checked={item.completed}
                                            onCheckedChange={() => toggleItem(item.id)}
                                        />
                                        <Label
                                            htmlFor={`item-${item.id}`}
                                            className={`${item.completed ? 'line-through text-muted-foreground' : ''} 
                                            transition-all cursor-pointer select-none`}
                                        >
                                            {item.text}
                                        </Label>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteItem(item.id)}
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10
                                        transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </motion.li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                <div className="bg-card/50 border border-border rounded-xl p-6 text-center">
                    <p className="text-muted-foreground mb-1">
                        Mantenha sua checklist de deploy atualizada para garantir lançamentos sem problemas.
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                        Todas as alterações são salvas automaticamente no seu navegador.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default DeployChecklist;