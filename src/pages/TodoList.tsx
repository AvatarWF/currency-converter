import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2 } from 'lucide-react';
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

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Lista de Tarefas</h1>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Nova Tarefa</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={addTodo} className="flex space-x-2">
                        <Input
                            placeholder="Digite sua tarefa aqui..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit">Adicionar</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Suas Tarefas</CardTitle>
                </CardHeader>
                <CardContent>
                    {todos.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6">
                            Você não tem tarefas. Adicione uma acima!
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {todos.map(todo => (
                                <li
                                    key={todo.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/20 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id={`todo-${todo.id}`}
                                            checked={todo.completed}
                                            onCheckedChange={() => toggleTodo(todo.id)}
                                        />
                                        <Label
                                            htmlFor={`todo-${todo.id}`}
                                            className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                                        >
                                            {todo.text}
                                        </Label>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteTodo(todo.id)}
                                        className="text-muted-foreground hover:text-destructive"
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
    );
};

export default TodoList;