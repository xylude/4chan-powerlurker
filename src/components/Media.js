import React, { useState, useEffect, useContext } from 'react';
import { basename, extname } from 'path';
import fs from 'fs';
import { Modal } from './Modal';
import { usePromise } from './hooks/usePromise';
import https from 'https';
import { StorageContext } from './StorageProvider';

export function saveFileToCache(path, location) {
	return new Promise((resolve, reject) => {
		fs.stat(`${path}/${basename(location)}`, (err, stat) => {
			if (err) {
				try {
					// fetch and save locally:
					const fStream = fs.createWriteStream(`${path}/${basename(location)}`);
					https.get(location, (res) => {
						res.pipe(fStream).on('finish', () => {
							resolve();
						});
					});
				} catch (e) {
					reject(e);
				}
			} else {
				resolve();
			}
		});
	});
}

function ToggleEmbed({ link }) {
	const [viewing, setViewing] = useState(false);
	const style = {
		padding: '10px 5px',
		cursor: 'pointer',
		textDecoration: 'underline',
	};

	return (
		<div>
			{viewing ? (
				<>
					<div
						style={style}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							setViewing(false);
						}}
					>
						[Close Embed ({link})]
					</div>
					<iframe
						width="560"
						height="315"
						src={link}
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					></iframe>
				</>
			) : (
				<div
					style={style}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setViewing(true);
					}}
				>
					[View Embed ({link})]
				</div>
			)}
		</div>
	);
}

export function YouTubeLinks({ text }) {
	const links = text
		.replace(/(<wbr>|<\/wbr>)/g, '')
		.match(/https?:\/\/((w{3}|m)\.)?(youtube\.com|youtu\.be)(.+?)(\s|<|$)/gi);

	return links
		? links
				.map((link) => link.replace('<', '').trim())
				.map((link) => {
					const url = new URL(link);
					const search = new URLSearchParams(url.search);

					const vid = search.has('v')
						? search.get('v')
						: url.pathname.split('/').filter((p) => p)[0];

					return `https://www.youtube.com/embed/${vid}`;
				})
				.map((link, i) => <ToggleEmbed key={i} link={link} />)
		: null;
}

function getFileUrl(location) {
	return new Promise((resolve) => {
		fs.stat(`./cache/images/${basename(location)}`, (err, stat) => {
			if (err) {
				resolve(location);
			} else {
				resolve(`../cache/images/${basename(location)}`);
			}
		});
	});
}

function MediaComponent({ src, style, videoAttributes, onClick }) {
	const ext = extname(src);
	if (ext.match(/(gif|jpg|png|jpeg)/)) {
		return <img style={style} src={src} onClick={onClick} />;
	} else {
		return (
			<video onClick={onClick} {...videoAttributes} style={style}>
				<source src={src} type={'video/webm'} />
			</video>
		);
	}
}

export function Media({ src, style }) {
	const { getItem } = useContext(StorageContext);
	const [viewing, setViewing] = useState(false);
	const [saved, setSaved] = useState(false);
	const [location, setLocation] = useState(null);

	const [getUrl, loading] = usePromise(
		() => getFileUrl(src).then(setLocation),
		[],
		'Media'
	);

	useEffect(getUrl, []);

	return loading || !location ? null : (
		<>
			<MediaComponent
				style={{
					cursor: 'pointer',
					...style,
				}}
				src={location}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setViewing(true);
				}}
			/>
			{viewing && (
				<Modal
					style={{
						maxWidth: '50%',
					}}
					onClickOutside={() => setViewing(false)}
				>
					<MediaComponent
						videoAttributes={{
							controls: 'true',
						}}
						style={{ width: '100%' }}
						src={location}
					/>
					<div
						style={{
							marginTop: 10,
						}}
					>
						<span
							onClick={() => {
								if (!saved) {
									saveFileToCache(getItem('mediaPath'), src).then(() => {
										setSaved(true);
									});
								}
							}}
							style={{
								display: 'inline-block',
								marginRight: 20,
								cursor: 'pointer',
							}}
						>
							{saved ? 'Saved' : 'Save'}
						</span>
						<span
							style={{
								cursor: 'pointer',
								display: 'inline-block',
								marginRight: 20,
							}}
							onClick={() => {
								nw.Window.open(src);
							}}
						>
							View Original
						</span>
						<span
							style={{ cursor: 'pointer' }}
							onClick={() => nw.Shell.openExternal(src)}
						>
							Browser
						</span>
					</div>
				</Modal>
			)}
		</>
	);
}
