import React, { useContext, useState } from 'react';
import { StorageContext } from './StorageProvider';
import { Post } from './Post';
import { Thread } from './Thread';

export function Saved() {
	const [viewing, setViewing] = useState(null);
	const { savedColl } = useContext(StorageContext);
	const threads = savedColl.find({ type: 'thread' });

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
					display: viewing ? 'none' : 'block',
					padding: '20px 0',
				}}
			>
				{threads.map((thread) => {
					const firstPost = savedColl.findOne({
						type: 'post',
						threadNo: thread.threadNo,
					});
					console.log('found post', firstPost);
					return (
						<Post
							board={firstPost.board}
							post={firstPost.post}
							onClick={() => setViewing([firstPost.board, thread.threadNo])}
						/>
					);
				})}
			</div>
			{viewing && (
				<Thread
					board={viewing[0]}
					threadNo={viewing[1]}
					onExit={() => setViewing(null)}
				/>
			)}
		</div>
	);
}
