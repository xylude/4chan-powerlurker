import React, { createContext, useState } from 'react';

export const LocationContext = createContext({
	location: null,
	setLocation: () => {},
});

export function LocationProvider({ children }) {
	const [location, setLocation] = useState('home');

	return (
		<LocationContext.Provider
			value={{
				setLocation,
				location,
			}}
		>
			{children}
		</LocationContext.Provider>
	);
}
