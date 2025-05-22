import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Clipboard, RefreshCw } from "lucide-react";
import { faker } from "@faker-js/faker";

type DataType =
    | "name"
    | "email"
    | "phone"
    | "address"
    | "company"
    | "job"
    | "creditCard"
    | "product"
    | "image"
    | "uuid"
    | "date";

type GeneratedData = Record<string, string | number>;

const FakeData = () => {
    const [dataTypes, setDataTypes] = useState<string[]>(["name", "email"]);
    const [quantity, setQuantity] = useState(10);
    const [format, setFormat] = useState<"json" | "csv">("json");
    const [generatedData, setGeneratedData] = useState<GeneratedData[]>([]);
    const [currentType, setCurrentType] = useState<DataType>("name");

    const { toast } = useToast();

    const dataTypeOptions = [
        { value: "name", label: "Nome" },
        { value: "email", label: "Email" },
        { value: "phone", label: "Telefone" },
        { value: "address", label: "Endereço" },
        { value: "company", label: "Empresa" },
        { value: "job", label: "Profissão" },
        { value: "creditCard", label: "Cartão de Crédito" },
        { value: "product", label: "Produto" },
        { value: "image", label: "URL de Imagem" },
        { value: "uuid", label: "UUID" },
        { value: "date", label: "Data" },
    ];

    const addDataType = () => {
        if (!currentType || dataTypes.includes(currentType)) return;
        setDataTypes([...dataTypes, currentType]);
    };

    const removeDataType = (type: string) => {
        setDataTypes(dataTypes.filter(t => t !== type));
    };

    const generateFakeData = () => {
        const data = Array.from({ length: quantity }, () => {
            const item: GeneratedData = {};

            dataTypes.forEach(type => {
                switch (type) {
                    case "name":
                        item.name = faker.person.fullName();
                        break;
                    case "email":
                        item.email = faker.internet.email();
                        break;
                    case "phone":
                        item.phone = faker.phone.number();
                        break;
                    case "address":
                        item.address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`;
                        break;
                    case "company":
                        item.company = faker.company.name();
                        break;
                    case "job":
                        item.job = faker.person.jobTitle();
                        break;
                    case "creditCard":
                        item.creditCard = faker.finance.creditCardNumber();
                        break;
                    case "product":
                        item.product = faker.commerce.productName();
                        item.price = faker.commerce.price();
                        break;
                    case "image":
                        item.image = faker.image.url();
                        break;
                    case "uuid":
                        item.uuid = faker.string.uuid();
                        break;
                    case "date":
                        item.date = faker.date.recent().toISOString().split('T')[0];
                        break;
                }
            });

            return item;
        });

        setGeneratedData(data);
    };

    const formatDataToString = (): string => {
        if (format === "json") {
            return JSON.stringify(generatedData, null, 2);
        } else {
            if (generatedData.length === 0) return "";

            const headers = Object.keys(generatedData[0]);
            let csv = headers.join(",") + "\n";

            generatedData.forEach(item => {
                const row = headers.map(header => {
                    const value = item[header];
                    return typeof value === "string" && value.includes(",")
                        ? `"${value}"`
                        : value;
                });
                csv += row.join(",") + "\n";
            });

            return csv;
        }
    };

    const copyToClipboard = () => {
        const formattedData = formatDataToString();
        navigator.clipboard.writeText(formattedData);

        toast({
            title: "Copiado para a área de transferência",
            description: "Dados copiados com sucesso!",
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Gerador de Dados Falsos</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Configure seus dados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Tipos de dados</Label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {dataTypes.map(type => (
                                        <div
                                            key={type}
                                            className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                                        >
                                            <span>{dataTypeOptions.find(opt => opt.value === type)?.label}</span>
                                            <button
                                                onClick={() => removeDataType(type)}
                                                className="ml-1 text-muted-foreground hover:text-destructive"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <Select value={currentType} onValueChange={value => setCurrentType(value as DataType)}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Selecione um tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dataTypeOptions.map(option => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                    disabled={dataTypes.includes(option.value)}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={addDataType} disabled={dataTypes.includes(currentType)}>
                                        Adicionar
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantidade</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Formato de saída</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={format === "json" ? "default" : "outline"}
                                        className="flex-1"
                                        onClick={() => setFormat("json")}
                                    >
                                        JSON
                                    </Button>
                                    <Button
                                        variant={format === "csv" ? "default" : "outline"}
                                        className="flex-1"
                                        onClick={() => setFormat("csv")}
                                    >
                                        CSV
                                    </Button>
                                </div>
                            </div>

                            <Button onClick={generateFakeData} className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Gerar Dados
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:row-span-2">
                    <CardHeader>
                        <CardTitle>Amostra</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-sm italic text-muted-foreground">
                            Visualize como cada tipo de dado será gerado:
                        </div>

                        {dataTypeOptions.map(type => (
                            <div key={type.value} className="space-y-1">
                                <div className="text-sm font-medium">{type.label}:</div>
                                <div className="bg-accent/50 p-2 rounded text-sm">
                                    {(() => {
                                        switch (type.value) {
                                            case "name": return faker.person.fullName();
                                            case "email": return faker.internet.email();
                                            case "phone": return faker.phone.number();
                                            case "address": return `${faker.location.streetAddress()}, ${faker.location.city()}`;
                                            case "company": return faker.company.name();
                                            case "job": return faker.person.jobTitle();
                                            case "creditCard": return faker.finance.creditCardNumber();
                                            case "product": return `${faker.commerce.productName()} - R$${faker.commerce.price()}`;
                                            case "image": return faker.image.url();
                                            case "uuid": return faker.string.uuid();
                                            case "date": return faker.date.recent().toISOString().split('T')[0];
                                            default: return "";
                                        }
                                    })()}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Resultado</CardTitle>
                            {generatedData.length > 0 && (
                                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                                    <Clipboard className="h-4 w-4 mr-2" />
                                    Copiar
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {generatedData.length > 0 ? (
                            <Tabs defaultValue="preview">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="preview">Preview</TabsTrigger>
                                    <TabsTrigger value="raw">Raw</TabsTrigger>
                                </TabsList>
                                <TabsContent value="preview">
                                    <div className="border rounded-md overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-muted text-muted-foreground">
                                            <tr>
                                                {Object.keys(generatedData[0]).map(key => (
                                                    <th key={key} className="p-2 text-left text-xs uppercase">{key}</th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {generatedData.slice(0, 5).map((item, index) => (
                                                <tr key={index} className="border-t">
                                                    {Object.keys(item).map(key => (
                                                        <td key={`${index}-${key}`} className="p-2 text-sm">
                                                            {String(item[key]).length > 40
                                                                ? String(item[key]).substring(0, 37) + "..."
                                                                : String(item[key])
                                                            }
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                        {generatedData.length > 5 && (
                                            <div className="p-2 text-center text-sm text-muted-foreground border-t">
                                                Mostrando 5 de {generatedData.length} registros
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="raw">
                                    <div className="bg-muted p-4 rounded-md">
                    <pre className="text-xs overflow-auto max-h-80">
                      {formatDataToString()}
                    </pre>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                Configure e gere dados para ver os resultados aqui.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FakeData;