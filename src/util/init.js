import request from 'superagent/dist/superagent';
import { baseJsonUrl } from '../constants';

export async function init() {
	console.log('Initializing...');
	if (!window.localStorage.getItem('cached')) {
		console.log('No cache found, fetching...');
		try {
			const response = await request.get(`${baseJsonUrl}/boards.json`);
			const storage = {
				boards: response.body.boards,
			};
			window.localStorage.setItem('cached', JSON.stringify(storage));
		} catch (e) {
			alert("Couldn't initialize app. Try reloading or something.");
		} finally {
			window.localStorage.setItem('lastRequest', Date.now().toString());
		}
	}
}
