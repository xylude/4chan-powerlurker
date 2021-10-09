import React, { useState, useEffect, createContext } from 'react';

export const StorageContext = createContext({
	setItem: () => {},
	getItem: () => {},
});

const initialAppStore = {
	initialized: true,
	favoriteBoards: [],
	boards: [],
	mediaPath: './cache/images/',
};

export function StorageProvider({ children }) {
	const [storage, setStorage] = useState(
		window.localStorage.getItem('appStore')
			? JSON.parse(window.localStorage.getItem('appStore'))
			: {}
	);

	useEffect(() => {
		if (!storage.initialized) {
			window.localStorage.setItem('appStore', JSON.stringify(initialAppStore));
			setStorage(initialAppStore);
		}
	}, []);

	const setItem = (key, value) => {
		const appStore = JSON.parse(window.localStorage.getItem('appStore'));

		if (typeof value === 'function') {
			appStore[key] = value(appStore[key]);
		} else {
			appStore[key] = value;
		}

		window.localStorage.setItem('appStore', JSON.stringify(appStore));
		setStorage(appStore);
	};
	const getItem = (key) =>
		JSON.parse(window.localStorage.getItem('appStore'))[key];

	return storage.initialized ? (
		<StorageContext.Provider
			value={{
				setItem,
				getItem,
			}}
		>
			{children}
		</StorageContext.Provider>
	) : (
		<div>Initializing...</div>
	);
}
