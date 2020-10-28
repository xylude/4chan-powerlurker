import React, { useState, useEffect, useContext } from 'react';
import request from 'request';
import { basename, extname } from 'path';
import fs from 'fs';
import { Modal } from './Modal';
import { usePromise } from './hooks/usePromise';
import { StorageContext } from './StorageProvider';

export function saveFileToCache(location) {
	return new Promise((resolve) => {
		fs.stat(`./cache/images/${basename(location)}`, (err, stat) => {
			if (err) {
				// fetch and save locally:
				const fStream = fs.createWriteStream(
					`./cache/images/${basename(location)}`
				);
				request(location)
					.pipe(fStream)
					.on('finish', () => {
						resolve();
					});
			} else {
				resolve();
			}
		});
	});
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
	const { savedColl } = useContext(StorageContext);
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
									saveFileToCache(src).then(() => {
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
