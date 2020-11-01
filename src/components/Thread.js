import request from 'superagent/dist/superagent';
import React, { useState, useEffect, useContext } from 'react';
import { usePromise } from './hooks/usePromise';
import { baseJsonUrl, baseMediaUrl } from '../constants';
import { Post } from './Post';
import { Modal } from './Modal';
import { StorageContext } from './StorageProvider';
import { saveFileToCache } from './Media';

export function Thread({ board, threadNo, onExit }) {
	const { savedColl } = useContext(StorageContext);
	const [posts, setPosts] = useState([]);
	const [viewingPost, setViewingPost] = useState(null);
	const [saved, setSaved] = useState(
		!!savedColl.findOne({ type: 'thread', threadNo })
	);

	const [fetch, error, loading] = usePromise(
		() =>
			request
				.get(`${baseJsonUrl}/${board}/thread/${threadNo}.json`)
				.then((response) => {
					setPosts(response.body.posts);
					if (saved) {
						//update saved:
						saveThread();
					}
				}),
		[saved],
		'Thread'
	);

	useEffect(fetch, []);

	useEffect(() => {
		if (error) {
			// try fill from db:
			setPosts(
				savedColl
					.find({
						type: 'post',
						threadNo: threadNo,
					})
					.map((p) => p.post)
			);
		}
	}, [error]);

	useEffect(() => {
		function handleHashChange() {
			if (window.location.hash) {
				if (window.location.hash.startsWith('#p')) {
					setViewingPost(parseInt(window.location.hash.replace('#p', ''), 10));
				}
			}
		}
		window.addEventListener('hashchange', handleHashChange);

		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	function unsaveThread() {
		savedColl.removeWhere({ threadNo });
		setSaved(false);
	}

	async function saveThread() {
		if (!savedColl.findOne({ type: 'thread', threadNo })) {
			savedColl.insert({ type: 'thread', threadNo });
		}
		for (const post of posts) {
			// only update if post not exists:
			if (!savedColl.findOne({ type: 'post', threadNo, 'post.no': post.no })) {
				console.log('Inserting new post', post);
				savedColl.insert({
					type: 'post',
					board,
					threadNo,
					post,
				});
			} else {
				console.log(`Post ${post.no} exists, skipping update.`);
			}
			// save images:
			await saveFileToCache(`${baseMediaUrl}/${board}/${post.tim}${post.ext}`);
		}
		setSaved(true);
	}

	return loading ? (
		<div>LOADING JUDGE THREDD...</div>
	) : (
		<>
			<div
				style={{
					width: 1000,
					margin: '0 auto',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 20,
						right: 20,
						cursor: 'pointer',
					}}
				>
					{saved ? (
						<span style={{ cursor: 'pointer' }} onClick={unsaveThread}>
							Unsave Thread
						</span>
					) : (
						<span style={{ cursor: 'pointer' }} onClick={saveThread}>
							Save Thread
						</span>
					)}
				</div>
				<div
					style={{
						position: 'absolute',
						top: 20,
						right: 135,
						cursor: 'pointer',
					}}
					onClick={onExit}
				>
					Back
				</div>
				{posts.map((post, i) => (
					<Post
						key={post.no}
						board={board}
						post={post}
						replies={posts.filter(
							(p) => p.com && p.com.includes(`#p${post.no}`)
						)}
						parent={threadNo}
					/>
				))}
			</div>
			{viewingPost && (
				<Modal
					style={{
						width: '90%',
					}}
					onClickOutside={() => {
						setViewingPost(null);
						window.location.hash = '';
					}}
				>
					<Post
						board={board}
						post={posts.find((post) => post.no === viewingPost)}
					/>
				</Modal>
			)}
		</>
	);
}
