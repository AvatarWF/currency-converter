import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, CheckCircle2 } from 'lucide-react';
import ChecklistItem, { ChecklistItemType } from './ChecklistItem';
import { useToast } from "@/hooks/use-toast";

interface ChecklistItemsProps {
    items: ChecklistItemType[];
    onToggleItem: (id: string) => void;
    onDeleteItem: (id: string) => void;
}

const ChecklistItems = ({ items, onToggleItem, onDeleteItem }: ChecklistItemsProps) => {
    const { toast } = useToast();

    const handleDeleteItem = (id: string) => {
        onDeleteItem(id);
        toast({
            title: "🗑️ Item removido",
            description: "O item foi excluído da sua checklist.",
        });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            },
        },
    };

    const completedCount = items.filter(item => item.completed).length;

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-8"
        >
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-gray-900/80 backdrop-blur-sm border-0 shadow-2xl shadow-slate-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-gray-500/5"></div>

                <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500">
                                <List size={20} className="text-white" />
                            </div>
                            <span>Itens da Checklist</span>
                        </div>

                        {completedCount > 0 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30"
                            >
                                <CheckCircle2 size={16} className="text-green-400" />
                                <span className="text-green-300 text-sm font-medium">
                                  {completedCount} concluído{completedCount !== 1 ? 's' : ''}
                                </span>
                            </motion.div>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10">
                    <ul className="space-y-3">
                        {items.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12"
                            >
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 inline-block mb-4">
                                    <List size={40} className="text-purple-300" />
                                </div>
                                <p className="text-purple-200/80 italic text-lg mb-2">
                                    Sua checklist está vazia
                                </p>
                                <p className="text-purple-300/60 text-sm">
                                    Adicione itens acima para começar a organizar seu deploy
                                </p>
                            </motion.div>
                        )}

                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ChecklistItem
                                    item={item}
                                    onToggle={onToggleItem}
                                    onDelete={handleDeleteItem}
                                />
                            </motion.div>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ChecklistItems;