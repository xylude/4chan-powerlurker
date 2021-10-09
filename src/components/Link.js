import React from 'react';

export function Link({ onClick, style, children }) {
	return (
		<span
			style={{
				cursor: 'pointer',
				textDecoration: 'underline',
				...style,
			}}
			onClick={onClick}
		>
			{children}
		</span>
	);
}
