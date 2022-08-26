import React, { useState, useEffect, useContext } from 'react';
import { basename, extname } from 'path';
import fs from 'fs';
import { Modal } from './Modal';
import { usePromise } from './hooks/usePromise';
import https from 'https';
import { StorageContext } from './StorageProvider';
import { exec } from 'child_process';

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

function OpenLink({ link }) {
	const style = {
		padding: '10px 5px',
		cursor: 'pointer',
		textDecoration: 'underline',
	};

	return (
		<div>
			<div
				style={style}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					if (getItem('defaultOpenCommand')) {
						exec(getItem('defaultOpenCommand').replace('$URL', link));
					} else {
						nw.Window.open(link);
					}
				}}
			>
				[View Link ({link})]
			</div>
		</div>
	);
}

export function ClickableLinks({ text }) {
	const links = text
		.replace(/(<wbr>|<\/wbr>)/g, '')
		.match(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
		);

	return links
		? [...new Set([...links])]
				.map((link) => link.replace('<', '').trim())
				.map((link, i) => <OpenLink key={i} link={link} />)
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

export function Media({ src, thumbSrc, style }) {
	const { getItem } = useContext(StorageContext);
	const [viewing, setViewing] = useState(false);
	const [saved, setSaved] = useState(false);

	return (
		<>
			<MediaComponent
				style={{
					cursor: 'pointer',
					...style,
				}}
				src={thumbSrc}
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
						src={src}
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
