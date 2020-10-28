import request from 'superagent/dist/superagent';
import React, { useContext, useEffect, useState } from 'react';
import { StorageContext } from './StorageProvider';
import { usePromise } from './hooks/usePromise';
import { baseJsonUrl } from '../constants';
import set from '@babel/runtime/helpers/esm/set';
import { LocationContext } from './LocationProvider';

function htmlDecode(input) {
	var doc = new DOMParser().parseFromString(input, 'text/html');
	return doc.documentElement.textContent;
}

function Board({ board, onUpdate }) {
	const { savedColl } = useContext(StorageContext);
	const { setLocation } = useContext(LocationContext);
	const [favorite, setFavorite] = useState(
		!!savedColl.findOne({ type: 'board', name: board.board })
	);

	function toggleSaved() {
		if (savedColl.findOne({ type: 'board', name: board.board })) {
			savedColl.findAndRemove({ type: 'board', name: board.board });
		} else {
			savedColl.insert({ type: 'board', name: board.board });
		}
		setFavorite((f) => !f);
		onUpdate();
	}

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
		</div>
	);
}

export function BoardList() {
	const { boardsColl, savedColl } = useContext(StorageContext);
	const [boardList, _setBoardList] = useState([]);

	const [fetch] = usePromise(
		() =>
			request.get(`${baseJsonUrl}/boards.json`).then((response) => {
				boardsColl.insert({
					boards: response.body.boards,
				});
			}),
		[],
		'BoardList'
	);

	function setBoardList(boards) {
		_setBoardList(
			boards.filter((board) =>
				savedColl.findOne({ type: 'board', name: board.board })
			)
		);
	}

	useEffect(() => {
		const boards = boardsColl.findOne({});
		if (!boards) {
			console.log('fetching boards');
			fetch();
		} else {
			console.log('found boards');
			setBoardList(boards.boards);
		}
	}, []);

	return (
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
				{boardList.length === 0 && "You don't have any favorite boards."}
				{boardList.map((board) => (
					<Board key={board.board} board={board} />
				))}
			</div>
		</div>
	);
}
