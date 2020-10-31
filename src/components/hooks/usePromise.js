import { useState, useCallback } from 'react';

export function usePromise(fn, deps, debug = '') {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetch = useCallback(function (...args) {
		setLoading(true);

		const lastRequest = parseInt(
			window.localStorage.getItem('lastRequest'),
			10
		);
		const throttleTime =
			Date.now() - lastRequest < 1000 ? Date.now() - lastRequest : 0;

		setTimeout(() => {
			fn(...args)
				.catch((e) => setError(e))
				.finally(() => {
					setLoading(false);
					window.localStorage.setItem('lastRequest', Date.now().toString());
				});
		}, throttleTime);
	}, deps);

	return [fetch, loading, error];
}

function Example() {
	const { fetch, loading, error } = usePromise(
		() => new Promise.then((response) => alert('hi'))
	);
}
