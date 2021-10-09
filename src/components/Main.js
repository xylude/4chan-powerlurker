import React, { useContext } from 'react';
import { LocationContext } from './LocationProvider';
import { BoardList } from './BoardList';
import { Board } from './Board';
import { Settings } from './Settings';

export default function () {
	const { location } = useContext(LocationContext);

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
			{location === 'home' && <BoardList />}
			{location === 'settings' && <Settings />}
			{location.startsWith('board:') && (
				<Board board={location.split(':')[1]} />
			)}
		</div>
	);
}
