import React, { useState, useEffect, createContext } from 'react';
import loki from 'lokijs';

export const StorageContext = createContext({
	db: null,
});

export function StorageProvider({ children }) {
	const [db, setDb] = useState(null);

	useEffect(() => {
		const _db = new loki('cache/caches.db', {
			autoload: true,
			autoloadCallback: () => {
				if (!_db.getCollection('boards')) {
					_db.addCollection('boards');
					_db.addCollection('threads');
					_db.addCollection('posts');
					_db.addCollection('saved');
					_db.addCollection('media');
				}
				setDb(_db);
			},
			autosave: true,
			autosaveInterval: 4000,
		});
	}, []);

	return db ? (
		<StorageContext.Provider
			value={{
				boardsColl: db.getCollection('boards'),
				threadsColl: db.getCollection('threads'),
				postsColl: db.getCollection('posts'),
				savedColl: db.getCollection('saved'),
				mediaColl: db.getCollection('media'),
			}}
		>
			{children}
		</StorageContext.Provider>
	) : (
		<div>Initializing caches...</div>
	);
}
