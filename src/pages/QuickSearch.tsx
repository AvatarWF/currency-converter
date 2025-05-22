import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

const QuickSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) return;

        const demoResults = [
            `Resultado para "${searchQuery}" 1`,
            `Resultado para "${searchQuery}" 2`,
            `Resultado para "${searchQuery}" 3`,
        ];

        setSearchResults(demoResults);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Pesquisa Rápida</h1>

            <div className="mb-8">
                <form onSubmit={handleSearch}>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Pesquisar em seus projetos..."
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit">Pesquisar</Button>
                    </div>
                </form>
            </div>

            {searchResults.length > 0 ? (
                <div className="space-y-4">
                    {searchResults.map((result, index) => (
                        <Card key={index} className="cursor-pointer hover:bg-accent/50 transition-colors">
                            <CardContent className="p-4">
                                <p>{result}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        Comece a pesquisar para ver resultados
                    </p>
                </div>
            )}
        </div>
    );
};

export default QuickSearch;