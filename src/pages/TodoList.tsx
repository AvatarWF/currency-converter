import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Todo = {
    id: string;
    text: string;
    completed: boolean;
};

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            return JSON.parse(savedTodos);
        }
        return [];
    });
    const [newTodo, setNewTodo] = useState('');
    const { toast } = useToast();

    const saveTodos = (updatedTodos: Todo[]) => {
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
        setTodos(updatedTodos);
    };

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodo.trim() === '') return;

        const todo = {
            id: Date.now().toString(),
            text: newTodo.trim(),
            completed: false
        };

        const updatedTodos = [...todos, todo];
        saveTodos(updatedTodos);
        setNewTodo('');

        toast({
            title: "Tarefa adicionada",
            description: "Nova tarefa criada com sucesso.",
        });
    };

    const toggleTodo = (id: string) => {
        const updatedTodos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        saveTodos(updatedTodos);
    };

    const deleteTodo = (id: string) => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        saveTodos(updatedTodos);

        toast({
            title: "Tarefa removida",
            description: "A tarefa foi excluída com sucesso.",
        });
    };

    const completedTodos = todos.filter(todo => todo.completed);
    const pendingTodos = todos.filter(todo => !todo.completed);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Lista de Tarefas
                </h1>
                <p className="text-muted-foreground">Organize suas tarefas de forma simples e eficiente</p>
            </div>

            <Card className="mb-8 border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                        <Plus className="mr-2" size={20} />
                        Nova Tarefa
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={addTodo} className="flex space-x-3">
                        <Input
                            placeholder="Digite sua tarefa aqui..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                            <Plus size={18} className="mr-2" />
                            Adicionar
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Tarefas Pendentes */}
                <Card className="border-orange-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
                        <CardTitle className="flex items-center justify-between text-orange-700 dark:text-orange-300">
                            <span>Tarefas Pendentes</span>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                                {pendingTodos.length}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {pendingTodos.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                                <p className="text-muted-foreground">Nenhuma tarefa pendente!</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {pendingTodos.map(todo => (
                                    <li
                                        key={todo.id}
                                        className="flex items-center justify-between p-4 border border-orange-100 rounded-lg hover:bg-orange-50/50 dark:hover:bg-orange-950/10 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id={`todo-${todo.id}`}
                                                checked={todo.completed}
                                                onCheckedChange={() => toggleTodo(todo.id)}
                                                className="border-orange-300 data-[state=checked]:bg-orange-500"
                                            />
                                            <Label
                                                htmlFor={`todo-${todo.id}`}
                                                className="cursor-pointer"
                                            >
                                                {todo.text}
                                            </Label>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteTodo(todo.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-green-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                        <CardTitle className="flex items-center justify-between text-green-700 dark:text-green-300">
                            <span>Tarefas Concluídas</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                {completedTodos.length}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {completedTodos.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Nenhuma tarefa concluída ainda.</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {completedTodos.map(todo => (
                                    <li
                                        key={todo.id}
                                        className="flex items-center justify-between p-4 border border-green-100 rounded-lg bg-green-50/30 dark:bg-green-950/10 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id={`todo-${todo.id}`}
                                                checked={todo.completed}
                                                onCheckedChange={() => toggleTodo(todo.id)}
                                                className="border-green-300 data-[state=checked]:bg-green-500"
                                            />
                                            <Label
                                                htmlFor={`todo-${todo.id}`}
                                                className="line-through text-muted-foreground cursor-pointer"
                                            >
                                                {todo.text}
                                            </Label>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteTodo(todo.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TodoList;