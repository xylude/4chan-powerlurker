import React from 'react';
import { countries } from '../util/countries.js';

export function Flag({ countryCode, style, fallback, ...props }) {
	if (!countries[countryCode]) {
		return fallback();
	}

	return (
		<img
			style={{ ...style }}
			src={`country-flags/${countryCode.toLowerCase()}.svg`}
			{...props}
		/>
	);
}
