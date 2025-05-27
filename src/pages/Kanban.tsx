import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
    Plus,
    X,
    Trash2,
    Edit,
    Calendar,
    Clock,
    MoreVertical,
    ChevronDown,
    ChevronUp,
    Save,
    ArrowLeft,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type TaskPriority = 'low' | 'medium' | 'high';
type KanbanColumn = 'todo' | 'inProgress' | 'review' | 'done';

interface KanbanTask {
    id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    column: KanbanColumn;
    createdAt: string;
    dueDate?: string;
}

interface KanbanColumnConfig {
    id: KanbanColumn;
    title: string;
    color: string;
    icon: React.ComponentType<any>;
}

const columnsConfig: KanbanColumnConfig[] = [
    { id: 'todo', title: 'A Fazer', color: 'text-blue-500', icon: Calendar },
    { id: 'inProgress', title: 'Em Progresso', color: 'text-yellow-500', icon: Clock },
    { id: 'review', title: 'Em Revisão', color: 'text-orange-500', icon: Edit },
    { id: 'done', title: 'Concluído', color: 'text-green-500', icon: Plus },
];

const priorityConfig = {
    low: { label: 'Baixa', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    medium: { label: 'Média', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    high: { label: 'Alta', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

const Kanban = () => {
    const [tasks, setTasks] = useState<KanbanTask[]>(() => {
        const savedTasks = localStorage.getItem('kanban-tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
    const [newTask, setNewTask] = useState<Partial<KanbanTask>>({
        title: '',
        description: '',
        priority: 'medium',
        column: 'todo',
        dueDate: ''
    });
    const [collapsedColumns, setCollapsedColumns] = useState<Record<string, boolean>>({});

    const { toast } = useToast();

    useEffect(() => {
        localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (!newTask.title?.trim()) {
            toast({
                title: "Título necessário",
                description: "Por favor, forneça um título para a tarefa.",
                variant: "destructive"
            });
            return;
        }

        const task: KanbanTask = {
            id: Date.now().toString(),
            title: newTask.title.trim(),
            description: newTask.description?.trim() || '',
            priority: newTask.priority as TaskPriority || 'medium',
            column: newTask.column as KanbanColumn || 'todo',
            createdAt: new Date().toISOString(),
            dueDate: newTask.dueDate || undefined
        };

        setTasks([...tasks, task]);
        setIsAddDialogOpen(false);
        resetNewTask();

        toast({
            title: "Tarefa adicionada",
            description: "Sua tarefa foi criada com sucesso."
        });
    };

    const updateTask = () => {
        if (!selectedTask) return;

        if (!newTask.title?.trim()) {
            toast({
                title: "Título necessário",
                description: "Por favor, forneça um título para a tarefa.",
                variant: "destructive"
            });
            return;
        }

        const updatedTasks = tasks.map(task => {
            if (task.id === selectedTask.id) {
                return {
                    ...task,
                    title: newTask.title?.trim() || task.title,
                    description: newTask.description?.trim() || task.description,
                    priority: newTask.priority as TaskPriority || task.priority,
                    dueDate: newTask.dueDate || task.dueDate
                };
            }
            return task;
        });

        setTasks(updatedTasks);
        setIsEditDialogOpen(false);
        setSelectedTask(null);

        toast({
            title: "Tarefa atualizada",
            description: "As alterações foram salvas com sucesso."
        });
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
        setSelectedTask(null);
        setIsEditDialogOpen(false);

        toast({
            title: "Tarefa removida",
            description: "A tarefa foi excluída com sucesso."
        });
    };

    const moveTask = (taskId: string, targetColumn: KanbanColumn) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, column: targetColumn };
            }
            return task;
        });

        setTasks(updatedTasks);

        toast({
            title: "Tarefa movida",
            description: `A tarefa foi movida para ${columnsConfig.find(col => col.id === targetColumn)?.title}.`
        });
    };

    const resetNewTask = () => {
        setNewTask({
            title: '',
            description: '',
            priority: 'medium',
            column: 'todo',
            dueDate: ''
        });
    };

    const openEditDialog = (task: KanbanTask) => {
        setSelectedTask(task);
        setNewTask({
            title: task.title,
            description: task.description,
            priority: task.priority,
            column: task.column,
            dueDate: task.dueDate || ''
        });
        setIsEditDialogOpen(true);
    };

    const toggleColumnCollapse = (columnId: KanbanColumn) => {
        setCollapsedColumns(prev => ({
            ...prev,
            [columnId]: !prev[columnId]
        }));
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const tasksByColumn = columnsConfig.reduce<Record<string, KanbanTask[]>>((acc, column) => {
        acc[column.id] = tasks.filter(task => task.column === column.id);
        return acc;
    }, {});

    return (
        <div className="container mx-auto max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mb-6"
            >
                <h1 className="text-3xl font-bold">Quadro Kanban</h1>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus size={18} className="mr-2" /> Nova Tarefa
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {columnsConfig.map((column, index) => (
                        <motion.div
                            key={column.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col pt-0 overflow-hidden">
                                <CardHeader className={`flex items-center bg-primary py-1 ${collapsedColumns[column.id] ? 'border-b' : ''}`}>
                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex items-center">
                                            <column.icon className={`mr-2 h-5 w-5 ${column.color}`} />
                                            <CardTitle className={`text-lg p-0 ${column.color}`}>{column.title}</CardTitle>
                                            <Badge variant="outline" className={`ml-2 ${column.color}`}>
                                                {tasksByColumn[column.id]?.length || 0}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => toggleColumnCollapse(column.id)}
                                        >
                                            {collapsedColumns[column.id] ? <ChevronDown size={16} className={column.color} /> : <ChevronUp size={16} className={column.color} />}
                                        </Button>
                                    </div>
                                </CardHeader>
                                {!collapsedColumns[column.id] && (
                                    <CardContent className="flex-grow overflow-y-auto pt-2" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                                        <div className="space-y-2">
                                            {tasksByColumn[column.id]?.length === 0 ? (
                                                <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
                                                    Nenhuma tarefa nesta coluna
                                                </div>
                                            ) : (
                                                tasksByColumn[column.id]?.map(task => (
                                                    <KanbanTaskCard
                                                        key={task.id}
                                                        task={task}
                                                        onEdit={() => openEditDialog(task)}
                                                        onDelete={() => deleteTask(task.id)}
                                                        onMove={(columnId) => moveTask(task.id, columnId)}
                                                    />
                                                ))
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="w-full mt-3 border border-dashed text-muted-foreground"
                                            onClick={() => {
                                                resetNewTask();
                                                setNewTask(prev => ({ ...prev, column: column.id }));
                                                setIsAddDialogOpen(true);
                                            }}
                                        >
                                            <Plus size={16} className="mr-2" /> Adicionar
                                        </Button>
                                    </CardContent>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[500px] text-primary">
                    <DialogHeader>
                        <DialogTitle>Adicionar nova tarefa</DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes da tarefa. Clique em salvar quando terminar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">Título</label>
                            <Input
                                id="title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                placeholder="Título da tarefa"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                            <Textarea
                                id="description"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                placeholder="Descreva a tarefa..."
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="priority" className="text-sm font-medium">Prioridade</label>
                                <Select
                                    value={newTask.priority}
                                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as TaskPriority })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a prioridade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Baixa</SelectItem>
                                        <SelectItem value="medium">Média</SelectItem>
                                        <SelectItem value="high">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="column" className="text-sm font-medium">Coluna</label>
                                <Select
                                    value={newTask.column}
                                    onValueChange={(value) => setNewTask({ ...newTask, column: value as KanbanColumn })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a coluna" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columnsConfig.map(column => (
                                            <SelectItem key={column.id} value={column.id}>
                                                {column.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="dueDate" className="text-sm font-medium">Data de entrega (opcional)</label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsAddDialogOpen(false);
                            resetNewTask();
                        }}>
                            Cancelar
                        </Button>
                        <Button onClick={addTask}>
                            <Save size={16} className="mr-2" /> Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] text-primary">
                    <DialogHeader>
                        <DialogTitle>Editar tarefa</DialogTitle>
                        <DialogDescription>
                            Edite os detalhes da tarefa. Clique em salvar quando terminar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="edit-title" className="text-sm font-medium">Título</label>
                            <Input
                                id="edit-title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                placeholder="Título da tarefa"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-description" className="text-sm font-medium">Descrição</label>
                            <Textarea
                                id="edit-description"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                placeholder="Descreva a tarefa..."
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="edit-priority" className="text-sm font-medium">Prioridade</label>
                                <Select
                                    value={newTask.priority}
                                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as TaskPriority })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a prioridade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Baixa</SelectItem>
                                        <SelectItem value="medium">Média</SelectItem>
                                        <SelectItem value="high">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="edit-dueDate" className="text-sm font-medium">Data de entrega</label>
                                <Input
                                    id="edit-dueDate"
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <div className="flex w-full justify-between">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                                        <Trash2 size={16} className="mr-2" /> Excluir
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. Esta tarefa será permanentemente excluída.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => selectedTask && deleteTask(selectedTask.id)}
                                            className="bg-destructive hover:bg-destructive/90"
                                        >
                                            Excluir
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => {
                                    setIsEditDialogOpen(false);
                                    setSelectedTask(null);
                                }}>
                                    Cancelar
                                </Button>
                                <Button onClick={updateTask}>
                                    <Save size={16} className="mr-2" /> Salvar
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

interface KanbanTaskCardProps {
    task: KanbanTask;
    onEdit: () => void;
    onDelete: () => void;
    onMove: (columnId: KanbanColumn) => void;
}

const KanbanTaskCard = ({ task, onEdit, onDelete, onMove }: KanbanTaskCardProps) => {
    const formatDate = (dateString?: string): string => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.column !== 'done';

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={`hover:shadow-md transition-shadow cursor-pointer rounded-none ${isOverdue ? 'border-red-500' : ''}`} onClick={onEdit}>
                <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium line-clamp-2">{task.title}</h3>
                        <div onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical size={16} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={onEdit}>
                                        <Edit size={14} className="mr-2" /> Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem disabled={task.column === 'todo'} onClick={() => onMove('todo')}>
                                        <ArrowLeft size={14} className="mr-2" /> Mover para A Fazer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled={task.column === 'inProgress'} onClick={() => onMove('inProgress')}>
                                        <ArrowLeft size={14} className="mr-2" /> Mover para Em Progresso
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled={task.column === 'review'} onClick={() => onMove('review')}>
                                        <ArrowLeft size={14} className="mr-2" /> Mover para Em Revisão
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled={task.column === 'done'} onClick={() => onMove('done')}>
                                        <ArrowLeft size={14} className="mr-2" /> Mover para Concluído
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={onDelete}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 size={14} className="mr-2" /> Excluir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {task.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    <div className="flex justify-between items-center">
                        <Badge variant="outline" className={`text-xs ${priorityConfig[task.priority].color}`}>
                            {priorityConfig[task.priority].label}
                        </Badge>

                        {task.dueDate && (
                            <div className={`text-xs flex items-center ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                                <Calendar size={12} className="mr-1" />
                                {formatDate(task.dueDate)}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Kanban;