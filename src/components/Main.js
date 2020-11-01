import React, { useContext, useEffect } from 'react';
import { LocationContext } from './LocationProvider';
import { BoardList } from './BoardList';
import { Board } from './Board';
import { Navigation } from './Navigation';
import { Saved } from './Saved';

export default function () {
	const { location, setLocation } = useContext(LocationContext);

	useEffect(() => {
		function handleHashChange() {
			// console.log('hashchange', window.location.hash);
			if (window.location.hash) {
				if (window.location.hash.startsWith('#link')) {
					const loc = window.location.hash.replace('#link:', '');
					if (loc.startsWith('/')) {
						const localLocation = loc.split('/').filter((p) => p);
						setLocation(
							`board:${localLocation[0]}${
								localLocation[1] ? `:${localLocation[1]}` : ''
							}`
						);
					} else {
						window.open(loc);
					}
					window.location.hash = '';
				}
			}
		}
		window.addEventListener('hashchange', handleHashChange);

		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	return (
		<div
			style={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: 'rgb(24, 26, 27)',
				color: 'rgb(206, 202, 195)',
			}}
		>
			<Navigation title={'Home'} />
			{location === 'home' && <BoardList />}
			{location.startsWith('board:') && (
				<Board board={location.split(':')[1]} thread={location.split(':')[2]} />
			)}
			{location === 'saved' && <Saved />}
		</div>
	);
}
