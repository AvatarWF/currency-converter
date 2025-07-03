// Força o modo dark ao carregar o app
export function forceDarkMode() {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }
}
