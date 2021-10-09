import request from 'superagent/dist/superagent';
import React, { useRef, useEffect, useState, useContext } from 'react';
import { usePromise } from './hooks/usePromise';
import { baseJsonUrl } from '../constants';
import { Post } from './Post';
import { Pagination } from './Pagination';
import { Thread } from './Thread';
import { Link } from './Link';
import { LocationContext } from './LocationProvider';
import { StorageContext } from './StorageProvider';

export function Board({ board }) {
	const { setLocation } = useContext(LocationContext);
	const { setItem, getItem } = useContext(StorageContext);

	const [threads, setThreads] = useState([[]]);
	const [page, setPage] = useState(0);
	const [thread, setThread] = useState(null);
	const [favorite, setFavorite] = useState(
		getItem('favoriteBoards').includes(board)
	);

	const scrollRef = useRef(null);

	function reset() {
		setPage(0);
		setThreads([[]]);
		setThread(null);
	}

	const [fetch, loading] = usePromise(
		() => {
			reset();
			return request
				.get(`${baseJsonUrl}/${board}/catalog.json`)
				.then((response) => {
					setThreads(response.body.map((t) => t.threads));
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
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					overflow: 'hidden',
					visibility: thread ? 'hidden' : 'visible',
					position: 'absolute',
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					zIndex: 100,
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
					<div
						style={{
							flexGrow: 1,
							display: 'flex',
						}}
					>
						<Link
							style={{ display: 'inline-block', marginLeft: 10 }}
							onClick={() => setLocation('home')}
						>
							Back
						</Link>
						<div style={{ flexGrow: 1, textAlign: 'center' }}>/{board}/</div>
					</div>
					<div>
						{favorite ? (
							<Link
								onClick={() => {
									setItem('favoriteBoards', (boards) =>
										boards.filter(board !== board)
									);
									setFavorite(false);
								}}
							>
								Unfavorite
							</Link>
						) : (
							<Link
								onClick={() => {
									setItem('favoriteBoards', (boards) => boards.concat([board]));
									setFavorite(true);
								}}
							>
								Favorite
							</Link>
						)}
						<Link
							style={{ display: 'inline-block', marginLeft: 10 }}
							onClick={fetch}
						>
							Refresh
						</Link>
					</div>
				</div>
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
							width: 1000,
							margin: '0 auto',
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
								onClick={() => setThread(thread.no)}
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
				</div>
			</div>
			{thread && (
				<Thread
					board={board}
					threadNo={thread}
					onExit={() => {
						setThread(null);
					}}
				/>
			)}
		</>
	);
}
