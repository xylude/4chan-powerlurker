import React, { useContext, useEffect } from 'react';
import { LocationContext } from './LocationProvider';
import { BoardList } from './BoardList';
import { Board } from './Board';
import { Navigation } from './Navigation';
import { Saved } from './Saved';

export default function () {
	const { location } = useContext(LocationContext);

	useEffect(() => {
		function handleHashChange() {
			if (window.location.hash) {
				console.log('hashchange', window.location.hash);
				if (window.location.hash.startsWith('#link')) {
					nw.Shell.openExternal(window.location.hash.replace('#link:', ''));
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
				<Board board={location.split(':')[1]} />
			)}
			{location === 'saved' && <Saved />}
		</div>
	);
}
