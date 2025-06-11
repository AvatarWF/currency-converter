export interface Currency {
    code: string;
    name: string;
    symbol: string;
    flag: string;
}

export const currencies: Currency[] = [
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
    { code: "MXN", name: "Peso Mexicano", symbol: "$", flag: "🇲🇽" },
    { code: "INR", name: "Rupia Indiana", symbol: "₹", flag: "🇮🇳" },
    { code: "KRW", name: "Won Sul-Coreano", symbol: "₩", flag: "🇰🇷" },
    { code: "SGD", name: "Dólar de Singapura", symbol: "S$", flag: "🇸🇬" },
    { code: "NOK", name: "Coroa Norueguesa", symbol: "kr", flag: "🇳🇴" },
    { code: "SEK", name: "Coroa Sueca", symbol: "kr", flag: "🇸🇪" },
    { code: "DKK", name: "Coroa Dinamarquesa", symbol: "kr", flag: "🇩🇰" },
    { code: "PLN", name: "Zloty Polonês", symbol: "zł", flag: "🇵🇱" },
    { code: "CZK", name: "Coroa Tcheca", symbol: "Kč", flag: "🇨🇿" },
    { code: "HUF", name: "Forint Húngaro", symbol: "Ft", flag: "🇭🇺" }
];

export const sampleRates: Record<string, Record<string, number>> = {
    USD: {
        EUR: 0.92, BRL: 5.05, GBP: 0.78, JPY: 150.42, CNY: 7.23, AUD: 1.51,
        CAD: 1.35, CHF: 0.89, ARS: 875.22, MXN: 17.23, INR: 83.12, KRW: 1312.45,
        SGD: 1.34, NOK: 10.87, SEK: 10.45, DKK: 6.87, PLN: 4.12, CZK: 23.45, HUF: 356.78
    },
    EUR: {
        USD: 1.09, BRL: 5.50, GBP: 0.85, JPY: 163.70, CNY: 7.87, AUD: 1.65,
        CAD: 1.47, CHF: 0.97, ARS: 952.89, MXN: 18.76, INR: 90.45, KRW: 1429.87,
        SGD: 1.46, NOK: 11.84, SEK: 11.38, DKK: 7.48, PLN: 4.49, CZK: 25.56, HUF: 388.92
    },
    BRL: {
        USD: 0.20, EUR: 0.18, GBP: 0.15, JPY: 29.75, CNY: 1.43, AUD: 0.30,
        CAD: 0.27, CHF: 0.18, ARS: 173.33, MXN: 3.41, INR: 16.45, KRW: 259.78,
        SGD: 0.27, NOK: 2.15, SEK: 2.07, DKK: 1.36, PLN: 0.82, CZK: 4.64, HUF: 70.67
    },
    GBP: {
        USD: 1.28, EUR: 1.18, BRL: 6.47, JPY: 192.65, CNY: 9.26, AUD: 1.93,
        CAD: 1.73, CHF: 1.14, ARS: 1120.79, MXN: 22.05, INR: 106.42, KRW: 1680.34,
        SGD: 1.72, NOK: 13.92, SEK: 13.38, DKK: 8.80, PLN: 5.28, CZK: 30.05, HUF: 457.23
    }
};