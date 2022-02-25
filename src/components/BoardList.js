import request from 'superagent/dist/superagent';
import React, { useContext, useEffect, useState } from 'react';
import { StorageContext } from './StorageProvider';
import { usePromise } from './hooks/usePromise';
import { baseJsonUrl } from '../constants';
import { LocationContext } from './LocationProvider';
import { Link } from './Link';

function htmlDecode(input) {
	const doc = new DOMParser().parseFromString(input, 'text/html');
	return doc.documentElement.textContent;
}

function Board({ board, onChange }) {
	const { setLocation } = useContext(LocationContext);
	const { setItem, getItem } = useContext(StorageContext);
	const [favorite, setFavorite] = useState(
		getItem('favoriteBoards').includes(board.board)
	);

	return (
		<div
			style={{
				borderRadius: 5,
				margin: 10,
				padding: 10,
				boxShadow: '0px 0px 5px 0px rgba(50, 50, 50, 0.75)',
				position: 'relative',
				cursor: 'pointer',
			}}
			onClick={() => {
				setLocation(`board:${board.board}`);
			}}
		>
			<p>
				<strong>{board.title}</strong>
			</p>
			<p>{htmlDecode(board.meta_description)}</p>
			<p
				style={{
					textAlign: 'right',
					fontSize: 12,
				}}
			>
				{favorite ? (
					<Link
						onClick={(e) => {
							e.stopPropagation();
							setItem('favoriteBoards', (boards) =>
								boards.filter((currentBoard) => currentBoard !== board.board)
							);
							setFavorite(false);
							onChange();
						}}
					>
						Unfavorite
					</Link>
				) : (
					<Link
						onClick={(e) => {
							e.stopPropagation();
							setItem('favoriteBoards', (boards) =>
								boards.concat([board.board])
							);
							setFavorite(true);
							onChange();
						}}
					>
						Favorite
					</Link>
				)}
			</p>
		</div>
	);
}

export function BoardList() {
	const { setItem, getItem } = useContext(StorageContext);
	const { setLocation } = useContext(LocationContext);
	const [boardList, setBoardList] = useState([]);
	const [favorites, setFavorites] = useState([]);

	useEffect(() => setFavorites(getItem('favoriteBoards')), []);

	const [fetch] = usePromise(
		() =>
			request.get(`${baseJsonUrl}/boards.json`).then((response) => {
				setItem('boardsList', response.body.boards);
				setBoardList(response.body.boards);
			}),
		[],
		'BoardList'
	);

	useEffect(() => {
		const boards = getItem('boards');
		if (boards.length === 0) {
			fetch();
		} else {
			setBoardList(boards.boards);
		}
	}, []);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				overflow: 'hidden',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 110,
			}}
		>
			<div
				style={{
					height: 50,
					backgroundColor: '#000',
					color: '#fff',
					padding: 10,
					display: 'flex',
				}}
			>
				<Link
					onClick={() => {
						setLocation('settings');
					}}
				>
					Settings
				</Link>
			</div>
			<div
				style={{
					width: '100%',
					margin: '0 auto',
					height: '100%',
					overflowY: 'scroll',
				}}
			>
				<div
					style={{
						width: 1000,
						margin: '0 auto',
					}}
				>
					<h2>Favorites</h2>
					{boardList
						.filter((board) => favorites.includes(board.board))
						.map((board) => (
							<Board
								key={board.board}
								board={board}
								onChange={() => setFavorites(getItem('favoriteBoards'))}
							/>
						))}
					<h2>Other Boards</h2>
					{boardList
						.filter((board) => !favorites.includes(board.board))
						.map((board) => (
							<Board
								key={board.board}
								board={board}
								onChange={() => setFavorites(getItem('favoriteBoards'))}
							/>
						))}
				</div>
			</div>
		</div>
	);
}
