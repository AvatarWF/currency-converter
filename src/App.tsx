import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import TodoList from "./pages/TodoList";
import DeployChecklist from "./pages/DeployChecklist";
import CodeSnippets from "./pages/CodeSnippets";
import LofiMusic from "./pages/LofiMusic";
import Pomodoro from "./pages/Pomodoro";
import QuickSearch from "./pages/QuickSearch";
import InternetSearch from "./pages/InternetSearch";
import WaterReminder from "./pages/WaterReminder";
import FakeData from "./pages/FakeData";
import JsonFormatter from "./pages/JsonFormatter";
import Donation from "./pages/Donation";
import TechNews from "./pages/TechNews";
import AITools from "./pages/AITools";
import Weather from "./pages/Weather";
import CurrencyConverter from "./pages/CurrencyConverter";
import Notepad from "./pages/Notepad";
import YouTubePlayer from "./pages/YoutubePlayer";
import Kanban from "./pages/Kanban";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/todo" element={<TodoList />} />
                        <Route path="/deploy-checklist" element={<DeployChecklist />} />
                        <Route path="/code-snippets" element={<CodeSnippets />} />
                        <Route path="/lofi" element={<LofiMusic />} />
                        <Route path="/pomodoro" element={<Pomodoro />} />
                        <Route path="/search" element={<QuickSearch />} />
                        <Route path="/internet-search" element={<InternetSearch />} />
                        <Route path="/water-reminder" element={<WaterReminder />} />
                        <Route path="/fake-data" element={<FakeData />} />
                        <Route path="/json-formatter" element={<JsonFormatter />} />
                        <Route path="*" element={<NotFound />} />
                        <Route path="/donation" element={<Donation />} />
                        <Route path="/tech-news" element={<TechNews />} />
                        <Route path="/ai-tools" element={<AITools />} />
                        <Route path="/weather" element={<Weather />} />
                        <Route path="/currency-converter" element={<CurrencyConverter />} />
                        <Route path="/notepad" element={<Notepad />} />
                        <Route path="/youtube-player" element={<YouTubePlayer />} />
                        <Route path="/kanban" element={<Kanban />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;