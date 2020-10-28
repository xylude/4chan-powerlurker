import React, { useContext, useState } from 'react';
import { LocationContext } from './LocationProvider';
import { StorageContext } from './StorageProvider';

function BoardSelect() {
	const { boardsColl } = useContext(StorageContext);
	const { setLocation, location } = useContext(LocationContext);

	const actualLocation = location.startsWith('board:')
		? location.split(':')[1]
		: '';

	return (
		<select
			onChange={(e) => {
				setLocation(`board:${e.target.value}`);
			}}
			value={actualLocation}
		>
			<option value={''}>Select a Board</option>
			{boardsColl.findOne({}).boards.map((board) => (
				<option key={board.board} value={board.board}>
					{board.title}
				</option>
			))}
		</select>
	);
}

function NavItem({ children, onClick }) {
	return (
		<div style={{ margin: '0 10px', cursor: 'pointer' }} onClick={onClick}>
			{children}
		</div>
	);
}

export function Navigation() {
	const { setLocation } = useContext(LocationContext);

	return (
		<div
			style={{
				height: 60,
				display: 'flex',
				flexDirection: 'row',
				fontSize: 16,
				fontWeight: 'bold',
				padding: 20,
				boxSizing: 'border-box',
				backgroundColor: '#000',
			}}
		>
			<NavItem onClick={() => setLocation('home')}>Home</NavItem>
			<NavItem onClick={() => setLocation('saved')}>Saved Threads</NavItem>
			<div>
				<BoardSelect />
			</div>
		</div>
	);
}
