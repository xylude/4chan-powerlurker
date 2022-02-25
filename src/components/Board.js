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
	const [hiddenPosts, setHiddenPosts] = useState(getItem('hiddenPosts'));
	const [showHidden, setShowHidden] = useState(false);

	const scrollRef = useRef(null);

	function reset() {
		setPage(0);
		setThreads([[]]);
		setThread(null);
	}

	function hidePost(threadNo) {
		const updated = [...new Set([...hiddenPosts, threadNo])];
		setItem('hiddenPosts', updated);
		setHiddenPosts(updated);
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
						{showHidden ? (
							<Link
								style={{ display: 'inline-block', marginLeft: 10 }}
								onClick={() => setShowHidden(false)}
							>
								Hide Hidden
							</Link>
						) : (
							<Link
								style={{ display: 'inline-block', marginLeft: 10 }}
								onClick={() => setShowHidden(true)}
							>
								Show Hidden
							</Link>
						)}
						<div style={{ flexGrow: 1, textAlign: 'center' }}>/{board}/</div>
					</div>
					<div>
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
						{threads[page]
							.filter((thread) =>
								showHidden ? true : !hiddenPosts.includes(thread.no)
							)
							.map((thread, i) => (
								<Post
									onClick={() => setThread(thread.no)}
									onHide={hidePost}
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
