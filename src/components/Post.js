import React, { useContext } from 'react';
import { Media, ClickableLinks } from './Media';
import { baseMediaUrl } from '../constants';
import { Link } from './Link';
import { Flag } from './Flag';
import { StorageContext } from './StorageProvider';
import { exec } from 'child_process';

export function Post({
	post,
	board,
	parent = [],
	onViewPostClick,
	onIdClick,
	onClick,
	onHide,
	wrapperStyle,
}) {
	function getDigitsCount(number) {
		const numberArr = number.toString().split('').reverse();

		let digitsCount = 0;

		for (const num of numberArr) {
			if (num === numberArr[0]) {
				digitsCount++;
			} else {
				break;
			}
		}

		return digitsCount;
	}

	const digitsCount = getDigitsCount(post.no);

	const { getItem } = useContext(StorageContext);

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
				...wrapperStyle,
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
				{post.id && (
					<span
						style={{
							display: 'inline-block',
							paddingRight: 5,
							marginRight: 5,
							borderRight: '1px solid',
						}}
						onClick={() => onIdClick && onIdClick(post.id)}
					>
						<strong>
							{post.id} {post.postsById ? `(${post.postsById})` : ''}
						</strong>
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
						borderRight: '1px solid rgb(206, 202, 195)',
						color: digitsCount > 1 ? '#f55' : 'inherit',
					}}
				>
					#{post.no}
				</span>
				<span
					style={{
						display: 'inline-block',
						paddingRight: 5,
						marginRight: 5,
						borderRight: '1px solid',
					}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						const url = `https://boards.4channel.org/${board}/thread/${parent}#p${post.no}`;

						if (getItem('defaultOpenCommand')) {
							exec(getItem('defaultOpenCommand').replace('$URL', url));
						} else {
							nw.Window.open(url);
						}
					}}
				>
					Open in 4chan
				</span>
				<span
					style={{
						cursor: 'pointer',
						display: 'inline-block',
						paddingRight: 5,
						marginRight: 5,
						borderRight: '1px solid',
					}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						const url = `https://archive.4plebs.org/${board}/thread/${parent}`;
						if (getItem('defaultOpenCommand')) {
							exec(getItem('defaultOpenCommand').replace('$URL', url));
						} else {
							nw.Window.open(url);
						}
					}}
				>
					Open in Archive
				</span>
				<span
					style={{
						cursor: 'pointer',
						display: 'inline-block',
						paddingRight: 5,
						marginRight: 5,
						borderRight: '1px solid',
					}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onHide(post.no);
					}}
				>
					Hide Post
				</span>
				<span>{post.now}</span>
				{post.country && (
					<span
						style={{
							display: 'inline-block',
							position: 'absolute',
							top: 0,
							right: 0,
							opacity: 0.1,
						}}
					>
						<Flag
							countryCode={post.country}
							style={{
								width: 75,
							}}
							title={post.country_name}
							fallback={() => {
								return (
									<img
										src="reddit.png"
										title={post.country_name}
										alt="meme flag"
										style={{
											width: 75,
										}}
									/>
								);
							}}
						/>
					</span>
				)}
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
							thumbSrc={`${baseMediaUrl}/${board}/${post.tim}s.jpg`}
							src={`${baseMediaUrl}/${board}/${post.tim}${post.ext}`}
						/>
					</div>
				)}
				<div
					style={{
						flex: '1 1 auto',
					}}
				>
					{post.replies.length > 0 && (
						<div
							style={{
								fontSize: 12,
								paddingBottom: 10,
								marginBottom: 10,
								borderBottom: '1px solid',
							}}
						>
							{post.replies.map((r) => (
								<Link
									style={{
										display: 'inline-block',
										marginRight: 10,
									}}
									key={r}
									onClick={() => onViewPostClick(r)}
								>
									>>{r}
								</Link>
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
									.replace(/href="\//, `onClick="#link:/`),
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
					<ClickableLinks text={post.com} />
				</div>
			)}
			{typeof post.replies === 'number' ? (
				<div
					style={{
						fontSize: 12,
						textAlign: 'right',
					}}
				>
					{post.replies} replies
				</div>
			) : null}
			{post.replies.length > 0 ? (
				<div
					style={{
						fontSize: 12,
						textAlign: 'right',
					}}
				>
					{post.replies.length || 0} replies
				</div>
			) : null}
		</div>
	);
}
