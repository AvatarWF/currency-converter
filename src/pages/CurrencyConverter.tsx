import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpDown, RefreshCw, TrendingUp, TrendingDown, History, Save, Star } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Currency {
    code: string;
    name: string;
    symbol: string;
    flag?: string;
}

interface ExchangeRate {
    from: string;
    to: string;
    rate: number;
    lastUpdated: string;
}

interface ConversionHistory {
    id: string;
    from: string;
    to: string;
    amount: number;
    result: number;
    date: string;
}

const currencies: Currency[] = [
    { code: "USD", name: "Dólar Americano", symbol: "$", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "BRL", name: "Real Brasileiro", symbol: "R$", flag: "🇧🇷" },
    { code: "GBP", name: "Libra Esterlina", symbol: "£", flag: "🇬🇧" },
    { code: "JPY", name: "Iene Japonês", symbol: "¥", flag: "🇯🇵" },
    { code: "CNY", name: "Yuan Chinês", symbol: "¥", flag: "🇨🇳" },
    { code: "AUD", name: "Dólar Australiano", symbol: "A$", flag: "🇦🇺" },
    { code: "CAD", name: "Dólar Canadense", symbol: "C$", flag: "🇨🇦" },
    { code: "CHF", name: "Franco Suíço", symbol: "CHF", flag: "🇨🇭" },
    { code: "ARS", name: "Peso Argentino", symbol: "$", flag: "🇦🇷" },
];

const sampleRates: Record<string, Record<string, number>> = {
    USD: { EUR: 0.92, BRL: 5.05, GBP: 0.78, JPY: 150.42, CNY: 7.23, AUD: 1.51, CAD: 1.35, CHF: 0.89, ARS: 875.22 },
    EUR: { USD: 1.09, BRL: 5.50, GBP: 0.85, JPY: 163.70, CNY: 7.87, AUD: 1.65, CAD: 1.47, CHF: 0.97, ARS: 952.89 },
    BRL: { USD: 0.20, EUR: 0.18, GBP: 0.15, JPY: 29.75, CNY: 1.43, AUD: 0.30, CAD: 0.27, CHF: 0.18, ARS: 173.33 },
    GBP: { USD: 1.28, EUR: 1.18, BRL: 6.47, JPY: 192.65, CNY: 9.26, AUD: 1.93, CAD: 1.73, CHF: 1.14, ARS: 1120.79 },
    JPY: { USD: 0.0066, EUR: 0.0061, BRL: 0.034, GBP: 0.0052, CNY: 0.048, AUD: 0.010, CAD: 0.0090, CHF: 0.0059, ARS: 5.82 },
    CNY: { USD: 0.14, EUR: 0.13, BRL: 0.70, GBP: 0.11, JPY: 20.79, AUD: 0.21, CAD: 0.19, CHF: 0.12, ARS: 121.05 },
    AUD: { USD: 0.66, EUR: 0.61, BRL: 3.35, GBP: 0.52, JPY: 99.53, CNY: 4.79, CAD: 0.89, CHF: 0.59, ARS: 579.40 },
    CAD: { USD: 0.74, EUR: 0.68, BRL: 3.74, GBP: 0.58, JPY: 111.32, CNY: 5.35, AUD: 1.12, CHF: 0.66, ARS: 648.31 },
    CHF: { USD: 1.12, EUR: 1.03, BRL: 5.67, GBP: 0.88, JPY: 168.91, CNY: 8.12, AUD: 1.70, CAD: 1.52, ARS: 983.65 },
    ARS: { USD: 0.0011, EUR: 0.0010, BRL: 0.0058, GBP: 0.00089, JPY: 0.17, CNY: 0.0083, AUD: 0.0017, CAD: 0.0015, CHF: 0.0010 },
};

const CurrencyConverter = () => {
    const [amount, setAmount] = useState<string>("1");
    const [fromCurrency, setFromCurrency] = useState<string>("USD");
    const [toCurrency, setToCurrency] = useState<string>("BRL");
    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [history, setHistory] = useState<ConversionHistory[]>(() => {
        const saved = localStorage.getItem('currency-conversion-history');
        return saved ? JSON.parse(saved) : [];
    });
    const [favoriteConversions, setFavoriteConversions] = useState<string[]>(() => {
        const saved = localStorage.getItem('favorite-conversions');
        return saved ? JSON.parse(saved) : [];
    });

    const { toast } = useToast();

    useEffect(() => {
        convertCurrency();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        localStorage.setItem('currency-conversion-history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('favorite-conversions', JSON.stringify(favoriteConversions));
    }, [favoriteConversions]);

    const convertCurrency = () => {
        setLoading(true);

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) {
            toast({
                title: "Valor inválido",
                description: "Por favor, digite um valor numérico válido.",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        setTimeout(() => {
            if (fromCurrency === toCurrency) {
                setResult(numericAmount);
                setLoading(false);
                return;
            }

            const exchangeRate = sampleRates[fromCurrency][toCurrency];

            if (!exchangeRate) {
                toast({
                    title: "Taxa de câmbio não encontrada",
                    description: "Não foi possível encontrar a taxa de câmbio para esta conversão.",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            const conversionResult = numericAmount * exchangeRate;
            setResult(conversionResult);

            const newEntry: ConversionHistory = {
                id: Date.now().toString(),
                from: fromCurrency,
                to: toCurrency,
                amount: numericAmount,
                result: conversionResult,
                date: new Date().toISOString(),
            };

            setHistory(prev => [newEntry, ...prev].slice(0, 10));

            setLoading(false);
        }, 800);
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);

        setTimeout(() => {
            convertCurrency();
        }, 100);
    };

    const handleAmountChange = (value: string) => {
        const regex = /^[0-9]*\.?[0-9]*$/;
        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
    };

    const toggleFavorite = () => {
        const conversionKey = `${fromCurrency}-${toCurrency}`;

        setFavoriteConversions(prev => {
            if (prev.includes(conversionKey)) {
                return prev.filter(key => key !== conversionKey);
            } else {
                toast({
                    title: "Conversão favoritada",
                    description: `A conversão de ${fromCurrency} para ${toCurrency} foi adicionada aos favoritos.`,
                });
                return [...prev, conversionKey];
            }
        });
    };

    const useFavoriteConversion = (conversionKey: string) => {
        const [from, to] = conversionKey.split('-');
        setFromCurrency(from);
        setToCurrency(to);

        setTimeout(() => {
            convertCurrency();
        }, 100);
    };

    const formatCurrency = (value: number, currencyCode: string): string => {
        const currency = currencies.find(c => c.code === currencyCode);

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currencyCode,
            currencyDisplay: 'narrowSymbol'
        }).format(value);
    };

    const formatDate = (isoString: string): string => {
        return new Date(isoString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isFavorite = favoriteConversions.includes(`${fromCurrency}-${toCurrency}`);

    return (
        <div className="container mx-auto max-w-4xl">
            <motion.h1
                className="text-3xl font-bold mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Conversor de Moedas
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Converter Moeda</CardTitle>
                                <CardDescription>
                                    Digite o valor e selecione as moedas para converter
                                </CardDescription>
                            </div>
                            <Button
                                variant={isFavorite ? "default" : "outline"}
                                size="icon"
                                onClick={toggleFavorite}
                                className={isFavorite ? "text-primary-foreground" : ""}
                            >
                                <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="amount">Valor</Label>
                                <Input
                                    id="amount"
                                    type="text"
                                    value={amount}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    className="text-lg"
                                />
                            </div>

                            <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-2">
                                <div>
                                    <Label htmlFor="fromCurrency">De</Label>
                                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                                        <SelectTrigger id="fromCurrency" className="w-full">
                                            <SelectValue placeholder="Selecione uma moeda" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Moedas</SelectLabel>
                                                {currencies.map(currency => (
                                                    <SelectItem key={currency.code} value={currency.code}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{currency.flag}</span>
                                                            <span>{currency.code}</span>
                                                            <span className="text-muted-foreground text-xs">
                                ({currency.name})
                              </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={swapCurrencies}
                                    className="mb-0.5"
                                >
                                    <ArrowUpDown size={18} />
                                </Button>

                                <div>
                                    <Label htmlFor="toCurrency">Para</Label>
                                    <Select value={toCurrency} onValueChange={setToCurrency}>
                                        <SelectTrigger id="toCurrency" className="w-full">
                                            <SelectValue placeholder="Selecione uma moeda" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Moedas</SelectLabel>
                                                {currencies.map(currency => (
                                                    <SelectItem key={currency.code} value={currency.code}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{currency.flag}</span>
                                                            <span>{currency.code}</span>
                                                            <span className="text-muted-foreground text-xs">
                                ({currency.name})
                              </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={convertCurrency}
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw size={16} className="mr-2 animate-spin" />
                                    Convertendo...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={16} className="mr-2" />
                                    Converter
                                </>
                            )}
                        </Button>
                    </CardContent>

                    {result !== null && (
                        <CardFooter className="flex-col border-t pt-6">
                            <div className="w-full text-center">
                                <div className="text-sm text-muted-foreground mb-1">Resultado</div>
                                <motion.div
                                    className="text-3xl font-bold"
                                    key={result}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {formatCurrency(result, toCurrency)}
                                </motion.div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {amount} {fromCurrency} = {formatCurrency(result, toCurrency)}
                                </div>
                            </div>

                            <div className="w-full mt-4">
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <div>Taxa: 1 {fromCurrency} = {sampleRates[fromCurrency][toCurrency]} {toCurrency}</div>
                                    <div>Atualizado: {new Date().toLocaleDateString()}</div>
                                </div>
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </motion.div>

            {favoriteConversions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Star size={16} className="text-yellow-500" fill="currentColor" />
                        Conversões Favoritas
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                        {favoriteConversions.map(conversionKey => {
                            const [from, to] = conversionKey.split('-');
                            const fromCurr = currencies.find(c => c.code === from);
                            const toCurr = currencies.find(c => c.code === to);

                            if (!fromCurr || !toCurr) return null;

                            return (
                                <Card
                                    key={conversionKey}
                                    className="hover:bg-accent/50 cursor-pointer transition-colors"
                                    onClick={() => useFavoriteConversion(conversionKey)}
                                >
                                    <CardContent className="p-3 text-center">
                                        <div className="flex justify-center items-center gap-2 mb-1">
                                            <span>{fromCurr.flag}</span>
                                            <span>{fromCurr.code}</span>
                                            <ArrowUpDown size={14} className="text-muted-foreground" />
                                            <span>{toCurr.flag}</span>
                                            <span>{toCurr.code}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            1 {from} = {sampleRates[from][to].toFixed(2)} {to}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {history.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <History size={18} />
                        Histórico de Conversões
                    </h2>

                    <Card>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {history.map(entry => {
                                    const fromCurr = currencies.find(c => c.code === entry.from);
                                    const toCurr = currencies.find(c => c.code === entry.to);

                                    if (!fromCurr || !toCurr) return null;

                                    return (
                                        <div
                                            key={entry.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md hover:bg-accent/20 transition-colors cursor-pointer"
                                            onClick={() => {
                                                setFromCurrency(entry.from);
                                                setToCurrency(entry.to);
                                                setAmount(entry.amount.toString());
                                                setTimeout(() => convertCurrency(), 100);
                                            }}
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {entry.amount} {fromCurr.flag} {entry.from} = {entry.result.toFixed(2)} {toCurr.flag} {entry.to}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDate(entry.date)}
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="mt-2 sm:mt-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    useFavoriteConversion(`${entry.from}-${entry.to}`);
                                                }}
                                            >
                                                Taxa: {(sampleRates[entry.from][entry.to]).toFixed(4)}
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Sobre esta página</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">
                            Este conversor de moedas é uma demonstração. Em uma implementação real,
                            seria necessário integrar com uma API de taxas de câmbio como ExchangeRate-API,
                            Fixer.io, ou similar para obter taxas atualizadas.
                        </p>
                        <p>
                            As taxas de câmbio mostradas são exemplos estáticos para fins de demonstração.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default CurrencyConverter;