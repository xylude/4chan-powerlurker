import request from 'superagent/dist/superagent';
import React, { useRef, useContext, useEffect, useState } from 'react';
import { usePromise } from './hooks/usePromise';
import { baseJsonUrl } from '../constants';
import { Post } from './Post';
import { Pagination } from './Pagination';
import { Thread } from './Thread';
import { StorageContext } from './StorageProvider';
import { LocationContext } from './LocationProvider';

export function Board({ board, thread }) {
	const { savedColl } = useContext(StorageContext);
	const { setLocation } = useContext(LocationContext);

	const [threads, setThreads] = useState([[]]);
	const [page, setPage] = useState(0);
	const [favorite, setFavorite] = useState(false);

	const scrollRef = useRef(null);

	function reset() {
		setPage(0);
		setThreads([[]]);
		setFavorite(false);
		setLocation(`board:${board}`);
	}

	const [fetch, loading] = usePromise(
		() => {
			reset();
			return request
				.get(`${baseJsonUrl}/${board}/catalog.json`)
				.then((response) => {
					setThreads(response.body.map((t) => t.threads));
					setFavorite(!!savedColl.findOne({ type: 'board', name: board }));
				});
		},
		[board],
		'Board'
	);

	useEffect(() => {
		reset();
		fetch();
	}, [board]);

	useEffect(() => {
		scrollRef.current.scrollTop = 0;
	}, [page]);

	return (
		<div
			ref={scrollRef}
			style={{
				width: '100%',
				margin: '0 auto',
				height: '100%',
				overflowY: 'scroll',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 20,
					right: 20,
					display: thread ? 'none' : 'block',
				}}
			>
				{favorite ? (
					<span
						onClick={() => {
							savedColl.removeWhere({ type: 'board', name: board });
							setFavorite(false);
						}}
					>
						Unvavorite Board
					</span>
				) : (
					<span
						style={{ cursor: 'pointer' }}
						onClick={() => {
							savedColl.insert({ type: 'board', name: board });
							setFavorite(true);
						}}
					>
						Favorite Board
					</span>
				)}
			</div>
			<div
				style={{
					position: 'absolute',
					top: 20,
					right: 165,
					cursor: 'pointer',
					display: thread ? 'none' : 'block',
				}}
				onClick={fetch}
			>
				Refresh
			</div>
			<div
				style={{
					width: 1000,
					margin: '0 auto',
					display: thread ? 'none' : 'block',
					padding: '20px 0',
				}}
			>
				<Pagination
					page={page}
					totalPages={threads.length}
					onPageChange={setPage}
				/>
				{loading && 'Loading...'}
				{threads[page].map((thread, i) => (
					<Post
						onClick={() => {
							setLocation(`board:${board}:${thread.no}`);
						}}
						key={thread.no}
						idx={i}
						board={board}
						post={thread}
						parent={thread.no}
					/>
				))}
				<Pagination
					page={page}
					totalPages={threads.length}
					onPageChange={setPage}
				/>
			</div>
			{thread && (
				<Thread
					board={board}
					threadNo={thread}
					onExit={() => setLocation(`board:${board}`)}
				/>
			)}
		</div>
	);
}
