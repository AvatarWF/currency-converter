import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') {
        return defaultValue;
    }

    const stored = localStorage.getItem(key)
        if (!stored) {
            return defaultValue;
        }

    try {
        return JSON.parse(stored) as T;
    } catch (error) {
        console.error(`Error parsing stored value for key "${key}":`, error);
        return defaultValue;
    }
}

export function saveToLocalStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving value to localStorage for key "${key}":`, error);
    }
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function generateId(): string {;
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

