import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { lightTheme, darkTheme } from '../theme';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
	mode: ThemeMode;
	toggleTheme: () => void;
	currentTheme: typeof lightTheme;
};

const ThemeContext = createContext<ThemeContextType>({
	mode: 'light',
	toggleTheme: () => {},
	currentTheme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	// Получаем сохраненную тему из localStorage или используем светлую по умолчанию
	const getInitialTheme = (): ThemeMode => {
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
			if (savedTheme) return savedTheme;

			// Проверка предпочтений системы
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			return prefersDark ? 'dark' : 'light';
		}
		return 'light';
	};

	const [mode, setMode] = useState<ThemeMode>(getInitialTheme);

	// Сохраняем тему в localStorage при изменении
	useEffect(() => {
		localStorage.setItem('theme', mode);

		// Для применения темы к корневому элементу HTML (опционально)
		document.documentElement.setAttribute('data-theme', mode);
	}, [mode]);

	const toggleTheme = () => {
		console.log(mode);
		setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
	};

	const currentTheme = useMemo(() => {
		return mode === 'light' ? lightTheme : darkTheme;
	}, [mode]);

	// Подписка на изменения системных предпочтений (опционально)
	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			setMode(e.matches ? 'dark' : 'light');
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, []);

	return (
		<ThemeContext.Provider value={{ mode, toggleTheme, currentTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

// Кастомный хук для удобного использования контекста
export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useThemeContext must be used within a ThemeProvider');
	}
	return context;
};