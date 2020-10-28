import React, { useState } from 'react';

export function Pagination({ totalPages, page, onPageChange }) {
	return (
		<div
			style={{
				textAlign: 'center',
			}}
		>
			<span
				style={{
					display: 'inline-block',
					padding: '2px 5px',
					cursor: 'pointer',
				}}
				onClick={() => {
					page > 0 && onPageChange(page - 1);
				}}
			>
				Prev
			</span>
			{new Array(totalPages).fill('').map((_, i) => (
				<span
					style={{
						display: 'inline-block',
						padding: '2px 5px',
						cursor: 'pointer',
						textDecoration: i === page ? 'underline' : 'none',
					}}
					onClick={() => onPageChange(i)}
					key={i}
				>
					{i + 1}
				</span>
			))}
			<span
				style={{
					display: 'inline-block',
					padding: '2px 5px',
					cursor: 'pointer',
				}}
				onClick={() => page < totalPages - 1 && onPageChange(page + 1)}
			>
				Next
			</span>
		</div>
	);
}
