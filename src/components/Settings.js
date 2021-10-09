import request from 'superagent/dist/superagent';
import React, { useContext, useEffect, useState } from 'react';
import { StorageContext } from './StorageProvider';
import { usePromise } from './hooks/usePromise';
import { baseJsonUrl } from '../constants';
import { LocationContext } from './LocationProvider';
import { Link } from './Link';

export function Settings() {
	const { setItem, getItem } = useContext(StorageContext);
	const { setLocation } = useContext(LocationContext);

	const [mediaPath, setMediaPath] = useState(getItem('mediaPath') || '');

	return (
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
				<Link
					onClick={() => {
						setLocation('home');
					}}
				>
					Home
				</Link>
			</div>
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
					}}
				>
					<h2>Settings</h2>
					<p>Select folder to save media to</p>
					<p>
						<label style={{ cursor: 'pointer' }}>
							{mediaPath}
							<input
								style={{
									display: 'none',
								}}
								onChange={(e) => {
									setItem('mediaPath', e.target.value);
									setMediaPath(e.target.value);
								}}
								type="file"
								nwdirectory={''}
							/>
						</label>
					</p>
				</div>
			</div>
		</div>
	);
}
