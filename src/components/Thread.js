import request from 'superagent/dist/superagent';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { usePromise } from './hooks/usePromise';
import { baseJsonUrl, baseMediaUrl } from '../constants';
import { Post } from './Post';
import { Modal } from './Modal';
import { Link } from './Link';

export function Thread({ board, threadNo, onExit }) {
	const [posts, setPosts] = useState([]);
	const [viewingPosts, setViewingPosts] = useState([]);
	const [highlightedId, setHighlightedId] = useState(null);
	const [timeoutActive, setTimeoutActive] = useState(false);

	const postMap = posts.reduce((postsAcc, post) => {
		postsAcc[post.no] = {
			...post,
			replies: posts
				.filter((p) => p.com && p.com.includes(`#p${post.no}`))
				.map((p) => p.no),
			postsById: posts.filter((p) => p.id === post.id).length,
		};

		return postsAcc;
	}, {});

	const [fetch, error, loading] = usePromise(
		() =>
			request
				.get(`${baseJsonUrl}/${board}/thread/${threadNo}.json`)
				.then((response) => {
					setPosts(response.body.posts);
				}),
		[],
		'Thread'
	);

	useEffect(() => {
		function handleHashChange() {
			// console.log('hashchange', window.location.hash);
			if (window.location.hash) {
				console.log('hashchange', window.location.hash);
				if (window.location.hash.startsWith('#p')) {
					setViewingPosts([window.location.hash.replace('#p', '')]);
				} else {
					window.open(window.location.hash);
				}
				window.location.hash = '';
			}
		}
		window.addEventListener('hashchange', handleHashChange);

		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	useEffect(fetch, []);

	const timedRefresh = useCallback(() => {
		if (!timeoutActive) {
			setTimeoutActive(true);
			fetch();
			setTimeout(() => setTimeoutActive(false), 5000);
		}
	}, []);

	const handleSetViewingPost = useCallback(
		(no) => setViewingPosts((viewingPosts) => viewingPosts.concat([no])),
		[]
	);

	const handleSetHighlightedId = useCallback((id) => setHighlightedId(id), []);

	return (
		<>
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
					<div
						style={{
							flexGrow: 1,
						}}
					>
						<Link
							style={{ display: 'inline-block', marginRight: 10 }}
							onClick={onExit}
						>
							Back
						</Link>
						{highlightedId && (
							<Link
								style={{ display: 'inline-block', marginRight: 10 }}
								onClick={() => setHighlightedId(null)}
							>
								Unhighlight Posts
							</Link>
						)}
					</div>
					<div>
						<Link
							style={{
								display: 'inline-block',
								marginRight: 10,
								color: timeoutActive ? '#f00' : 'inherit',
							}}
							onClick={timedRefresh}
						>
							Refresh
						</Link>
					</div>
				</div>
				<div
					style={{
						width: '100%',
						margin: '0 auto',
						height: '100%',
						overflowY: 'scroll',
					}}
				>
					{loading ? (
						<div>
							The thread didn't load, either your internet sucks or it got{' '}
							<Link
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									nw.Shell.openExternal(
										`https://archive.4plebs.org/${board}/thread/${threadNo}`
									);
								}}
							>
								archived
							</Link>
							.
						</div>
					) : (
						<div
							style={{
								width: 1000,
								margin: '0 auto',
								padding: '20px 0',
							}}
						>
							{Object.values(postMap).map((post, i) => (
								<Post
									key={post.no}
									board={board}
									post={post}
									parent={threadNo}
									onViewPostClick={handleSetViewingPost}
									wrapperStyle={{
										border:
											highlightedId === post.id ? '1px solid #fff' : 'none',
									}}
									onIdClick={handleSetHighlightedId}
								/>
							))}
						</div>
					)}
				</div>
			</div>
			{viewingPosts.length > 0 && (
				<Modal
					style={{
						width: '90%',
					}}
					onClickOutside={() => {
						setViewingPosts([]);
						window.location.hash = '';
					}}
				>
					{viewingPosts.map((no, i) => (
						<div key={`${no}:${i}`} style={{ position: 'relative' }}>
							<Post
								board={board}
								post={postMap[no]}
								parent={threadNo}
								onViewPostClick={(no) =>
									setViewingPosts((viewingPosts) => viewingPosts.concat([no]))
								}
							/>
							{i >= 1 && (
								<div
									style={{
										backgroundColor: '#000',
										width: 20,
										height: 20,
										fontSize: 10,
										padding: 4,
										textAlign: 'center',
										borderRadius: '50%',
										position: 'absolute',
										right: 0,
										top: -5,
										cursor: 'pointer',
									}}
									onClick={() => {
										setViewingPosts((posts) =>
											posts.filter((_, idx) => idx !== i)
										);
									}}
								>
									X
								</div>
							)}
						</div>
					))}
				</Modal>
			)}
		</>
	);
}
