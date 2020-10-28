import React, {createContext, useState} from 'react';

export const LocationContext = createContext({
	location: null,
})

export function LocationProvider({ children }) {
	const [location, setLocation] = useState('home');
	return (
		<LocationContext.Provider value={{
			location,
			setLocation,
		}}>
			{ children }
		</LocationContext.Provider>
	)
}