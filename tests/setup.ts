import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage with actual storage
const storage: Record<string, string> = {};

const localStorageMock = {
	getItem: vi.fn((key: string) => storage[key] || null),
	setItem: vi.fn((key: string, value: string) => {
		storage[key] = value;
	}),
	removeItem: vi.fn((key: string) => {
		delete storage[key];
	}),
	clear: vi.fn(() => {
		Object.keys(storage).forEach(key => delete storage[key]);
	})
};

Object.defineProperty(global, 'localStorage', {
	value: localStorageMock,
	writable: true
});

// Mock navigator.clipboard
Object.assign(navigator, {
	clipboard: {
		writeText: vi.fn().mockResolvedValue(undefined)
	}
});

// Mock window.alert and window.prompt
global.alert = vi.fn();
global.prompt = vi.fn();
