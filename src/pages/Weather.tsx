
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Search, MapPin, Thermometer, Droplet, Wind, Compass, Clock, CalendarDays, RefreshCw, AlertTriangle, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherData {
    city: string;
    country: string;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_direction: string;
    description: string;
    icon: string;
    dt: number;
}

interface DailyForecast {
    dt: number;
    temp: { day: number; night: number; };
    humidity: number;
    wind_speed: number;
    weather: [{ description: string; icon: string; }];
}

const sampleCities = [
    "São Paulo", "Rio de Janeiro", "Brasília",
    "Salvador", "Fortaleza", "Belo Horizonte",
    "Manaus", "Curitiba", "Recife", "Porto Alegre"
];

const sampleCurrentWeather: WeatherData = {
    city: "São Paulo",
    country: "BR",
    temp: 23,
    feels_like: 24,
    humidity: 65,
    wind_speed: 10,
    wind_direction: "NE",
    description: "Parcialmente nublado",
    icon: "02d",
    dt: Date.now()
};

const sampleForecast: DailyForecast[] = [
    {
        dt: Date.now() + 86400000, // tomorrow
        temp: { day: 24, night: 18 },
        humidity: 60,
        wind_speed: 12,
        weather: [{ description: "Ensolarado", icon: "01d" }]
    },
    {
        dt: Date.now() + 172800000, // day after tomorrow
        temp: { day: 26, night: 19 },
        humidity: 55,
        wind_speed: 8,
        weather: [{ description: "Parcialmente nublado", icon: "02d" }]
    },
    {
        dt: Date.now() + 259200000, // 3 days from now
        temp: { day: 22, night: 17 },
        humidity: 70,
        wind_speed: 15,
        weather: [{ description: "Chuvoso", icon: "10d" }]
    },
    {
        dt: Date.now() + 345600000, // 4 days from now
        temp: { day: 21, night: 16 },
        humidity: 75,
        wind_speed: 10,
        weather: [{ description: "Chuva forte", icon: "09d" }]
    },
    {
        dt: Date.now() + 432000000, // 5 days from now
        temp: { day: 23, night: 18 },
        humidity: 65,
        wind_speed: 7,
        weather: [{ description: "Parcialmente nublado", icon: "03d" }]
    }
];

const Weather = () => {
    const [searchCity, setSearchCity] = useState('');
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<DailyForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [favoriteCities, setFavoriteCities] = useState<string[]>(() => {
        const saved = localStorage.getItem('favorite-cities');
        return saved ? JSON.parse(saved) : [];
    });
    const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

    const { toast } = useToast();

    useEffect(() => {
        setTimeout(() => {
            setCurrentWeather(sampleCurrentWeather);
            setForecast(sampleForecast);
            setLoading(false);
        }, 1500);
    }, []);

    useEffect(() => {
        localStorage.setItem('favorite-cities', JSON.stringify(favoriteCities));
    }, [favoriteCities]);

    const handleSearch = () => {
        if (!searchCity.trim()) {
            toast({
                title: "Cidade não informada",
                description: "Por favor, digite o nome de uma cidade para pesquisar.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const weatherData = {
                ...sampleCurrentWeather,
                city: searchCity,
                temp: Math.floor(Math.random() * 15) + 15,
            };

            setCurrentWeather(weatherData);
            setForecast(sampleForecast);
            setLoading(false);

            setSearchCity('');

            toast({
                title: "Clima atualizado",
                description: `Dados meteorológicos para ${searchCity} foram carregados.`,
            });
        }, 1000);
    };

    const handleCitySelect = (city: string) => {
        setSearchCity(city);
        handleSearch();
    };

    const toggleFavorite = (city: string) => {
        setFavoriteCities(prev => {
            if (prev.includes(city)) {
                return prev.filter(c => c !== city);
            } else {
                toast({
                    title: "Cidade adicionada",
                    description: `${city} foi adicionada aos seus favoritos.`,
                });
                return [...prev, city];
            }
        });
    };

    const refreshWeather = () => {
        if (!currentWeather) return;

        setLoading(true);

        setTimeout(() => {
            const weatherData = {
                ...currentWeather,
                temp: Math.floor(Math.random() * 15) + 15, // Random temp between 15-30
                dt: Date.now()
            };

            setCurrentWeather(weatherData);
            setForecast(sampleForecast);
            setLoading(false);

            toast({
                title: "Dados atualizados",
                description: "Os dados meteorológicos foram atualizados.",
            });
        }, 1000);
    };

    const convertTemp = (tempC: number): number => {
        return unit === 'celsius' ? tempC : (tempC * 9/5) + 32;
    };

    const formatTemp = (tempC: number): string => {
        const temp = convertTemp(tempC);
        return `${Math.round(temp)}°${unit === 'celsius' ? 'C' : 'F'}`;
    };

    const formatDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };

    const formatTime = (timestamp: number): string => {
        return new Date(timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getIconUrl = (icon: string): string => {
        return `https://openweathermap.org/img/wn/${icon}@2x.png`;
    };

    return (
        <div className="container mx-auto max-w-4xl">
            <motion.h1
                className="text-3xl font-bold mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Previsão do Tempo
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Pesquisar Cidade</CardTitle>
                        <CardDescription>
                            Digite o nome da cidade para ver a previsão do tempo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Digite o nome da cidade..."
                                    value={searchCity}
                                    onChange={(e) => setSearchCity(e.target.value)}
                                    className="pl-10"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                />
                            </div>
                            <Button onClick={handleSearch}>Pesquisar</Button>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-2">Cidades Populares:</p>
                            <div className="flex flex-wrap gap-2">
                                {sampleCities.map(city => (
                                    <Badge
                                        key={city}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                                        onClick={() => handleCitySelect(city)}
                                    >
                                        {city}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {loading ? (
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="space-y-3">
                                <Skeleton className="h-10 w-20" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-24 w-24 rounded-full" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </CardContent>
                </Card>
            ) : currentWeather ? (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="mb-6 overflow-hidden">
                            <CardHeader className="pb-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-2xl">
                                            <MapPin size={20} className="text-primary" />
                                            {currentWeather.city}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleFavorite(currentWeather.city)}
                                                className={favoriteCities.includes(currentWeather.city) ? "text-yellow-500" : "text-muted-foreground"}
                                            >
                                                <Star size={18} fill={favoriteCities.includes(currentWeather.city) ? "currentColor" : "none"} />
                                            </Button>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            <Clock size={14} /> Atualizado em {formatTime(currentWeather.dt)}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Tabs value={unit} onValueChange={(value) => setUnit(value as 'celsius' | 'fahrenheit')}>
                                            <TabsList className="h-8">
                                                <TabsTrigger value="celsius" className="text-xs px-2">°C</TabsTrigger>
                                                <TabsTrigger value="fahrenheit" className="text-xs px-2">°F</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                        <Button variant="ghost" size="icon" onClick={refreshWeather}>
                                            <RefreshCw size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-4">
                                <div className="flex flex-col sm:flex-row items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src={getIconUrl(currentWeather.icon)}
                                            alt={currentWeather.description}
                                            className="w-24 h-24"
                                        />
                                        <div>
                                            <div className="text-4xl font-bold">{formatTemp(currentWeather.temp)}</div>
                                            <div className="text-lg capitalize">{currentWeather.description}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Sensação térmica: {formatTemp(currentWeather.feels_like)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4 sm:mt-0">
                                        <div className="flex items-center gap-2">
                                            <Droplet className="text-blue-500" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">Umidade</div>
                                                <div className="font-medium">{currentWeather.humidity}%</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Wind className="text-blue-400" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">Vento</div>
                                                <div className="font-medium">{currentWeather.wind_speed} km/h</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-xl font-semibold mb-4">Previsão para 5 dias</h2>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {forecast.map((day, index) => (
                                <Card key={day.dt} className="bg-card/50">
                                    <CardContent className="p-4 text-center">
                                        <h3 className="font-medium">
                                            {index === 0 ? 'Amanhã' : formatDate(day.dt).split(',')[0]}
                                        </h3>
                                        <div className="flex justify-center my-2">
                                            <img
                                                src={getIconUrl(day.weather[0].icon)}
                                                alt={day.weather[0].description}
                                                className="w-16 h-16"
                                            />
                                        </div>
                                        <div className="flex justify-center space-x-2">
                                            <span className="font-medium">{formatTemp(day.temp.day)}</span>
                                            <span className="text-muted-foreground">{formatTemp(day.temp.night)}</span>
                                        </div>
                                        <p className="text-xs mt-1 capitalize">{day.weather[0].description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                    {favoriteCities.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Star size={18} className="text-yellow-500" fill="currentColor" />
                                Cidades Favoritas
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {favoriteCities.map((city) => (
                                    <Card
                                        key={city}
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => handleCitySelect(city)}
                                    >
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                <span>{city}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(city);
                                            }}>
                                                <Star size={16} className="text-yellow-500" fill="currentColor" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <AlertTriangle size={48} className="text-muted-foreground opacity-20 mb-4" />
                            <p className="text-center text-muted-foreground">
                                Nenhuma cidade selecionada. Por favor, pesquise por uma cidade para ver os dados meteorológicos.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Sobre esta página</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">
                            Esta página de previsão do tempo é uma demonstração. Em uma implementação real,
                            seria necessário integrar com uma API de previsão do tempo como OpenWeatherMap,
                            WeatherAPI, ou similar.
                        </p>
                        <p>
                            Os dados mostrados são exemplos estáticos para fins de demonstração.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Weather;