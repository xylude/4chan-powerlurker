import React, { createContext, useState } from 'react';

const history = ['home'];

export const LocationContext = createContext({
	location: null,
	back: () => {},
	setLocation: () => {},
});

export function LocationProvider({ children }) {
	const [location, _setLocation] = useState('home');

	function setLocation(loc) {
		if (loc !== history.slice(-1)[0]) {
			console.log(`pushing ${loc} on to history`);
			history.push(loc);
		}
		_setLocation(loc);
	}

	return (
		<LocationContext.Provider
			value={{
				location,
				setLocation,
				back: () => {
					if (history.length > 1) {
						history.pop();
						const loc = history.slice(-1)[0];
						console.log('going back to ', loc, history);
						if (loc) {
							setLocation(loc);
						}
					}
				},
			}}
		>
			{children}
		</LocationContext.Provider>
	);
}
