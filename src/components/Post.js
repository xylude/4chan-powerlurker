import React from 'react';
import { Media, YouTubeLinks } from './Media';
import { baseMediaUrl } from '../constants';

export function Post({ post, board, parent, replies = [], onClick }) {
	return (
		<div
			style={{
				borderRadius: 5,
				margin: 10,
				padding: 10,
				boxShadow: '0px 0px 5px 0px rgba(50, 50, 50, 0.75)',
				position: 'relative',
				cursor: onClick ? 'pointer' : 'default',
				backgroundColor: '#2d2d2d',
			}}
			onClick={onClick}
		>
			<div
				style={{
					fontSize: 12,
					marginBottom: 10,
				}}
			>
				<span
					style={{
						display: 'inline-block',
						paddingRight: 5,
						marginRight: 5,
						borderRight: '1px solid',
					}}
				>
					/{board}/
				</span>
				{post.filename && (
					<span
						style={{
							display: 'inline-block',
							paddingRight: 5,
							marginRight: 5,
							borderRight: '1px solid',
						}}
					>
						{post.filename.slice(0, 20)}
						{post.filename.length > 20 && '...'}
						{post.ext}
					</span>
				)}
				{post.name && (
					<span
						style={{
							display: 'inline-block',
							paddingRight: 5,
							marginRight: 5,
							borderRight: '1px solid',
						}}
					>
						<strong>{post.name}</strong>
					</span>
				)}
				{post.trip && (
					<span
						style={{
							display: 'inline-block',
							paddingRight: 5,
							marginRight: 5,
							borderRight: '1px solid',
						}}
					>
						{<strong>{post.trip}</strong>}
					</span>
				)}
				<span
					style={{
						display: 'inline-block',
						paddingRight: 5,
						marginRight: 5,
						borderRight: '1px solid',
					}}
				>
					#{post.no}
				</span>
				<span
					style={{ cursor: 'pointer' }}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						nw.Shell.openExternal(
							`https://boards.4channel.org/${board}/thread/${parent}#p${post.no}`
						);
					}}
				>
					Open in Browser
				</span>
			</div>
			<div
				key={post.no}
				style={{
					display: 'flex',
				}}
			>
				{post.filename && (
					<div
						style={{
							width: 200,
							flex: '0 0 auto',
							marginRight: 20,
						}}
					>
						<Media
							style={{
								width: '100%',
							}}
							src={`${baseMediaUrl}/${board}/${post.tim}${post.ext}`}
						/>
					</div>
				)}
				<div
					style={{
						flex: '1 1 auto',
					}}
				>
					{replies.length > 0 && (
						<div
							style={{
								fontSize: 12,
								paddingBottom: 10,
								marginBottom: 10,
								borderBottom: '1px solid',
							}}
						>
							{replies.map((r) => (
								<a
									style={{ display: 'inline-block', marginRight: 10 }}
									href={`#p${r.no}`}
								>
									>>{r.no}
								</a>
							))}
						</div>
					)}
					{post.sub && (
						<div
							style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}
							dangerouslySetInnerHTML={{ __html: post.sub }}
						/>
					)}
					<div
						style={{
							marginBottom: 20,
							lineHeight: '22px',
							fontSize: 18,
						}}
						dangerouslySetInnerHTML={{
							__html:
								post.com &&
								post.com
									.replace(/href="http(.+)"/g, /href="#link:http$1"/)
									.replace(/href="\//, `href="#link:/`),
						}}
					/>
				</div>
			</div>
			{post.com && (
				<div
					style={{
						fontSize: 12,
					}}
				>
					<YouTubeLinks text={post.com} />
				</div>
			)}
			{post.replies ? (
				<div
					style={{
						fontSize: 12,
						textAlign: 'right',
					}}
				>
					{post.replies || 0} replies
				</div>
			) : null}
		</div>
	);
}
