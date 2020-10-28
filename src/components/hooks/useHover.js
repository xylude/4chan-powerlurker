import { useCallback, useEffect, useState } from 'react';

export default function useHover(ref) {
	const [is_hovered, setHovered] = useState(false);

	const enter_listener = useCallback(() => setHovered(true), [setHovered]);

	const leave_listener = useCallback(() => setHovered(false), [setHovered]);

	useEffect(() => {
		if (ref.current) {
			const { current } = ref;
			current.addEventListener('mouseenter', enter_listener, false);
			current.addEventListener('mouseleave', leave_listener, false);

			return () => {
				current.removeEventListener('mouseenter', enter_listener, false);
				current.removeEventListener('mouseleave', leave_listener, false);
			};
		}
	}, [enter_listener, leave_listener, ref]);

	return is_hovered;
}
