import {useEffect, useState} from 'react';

const useOrientation = () => {
	const [portrait, setOrientation] = useState(false);
	useEffect(() => {
		const updateOrientation = () => setOrientation(window.innerHeight > window.innerWidth);
		updateOrientation();
		window.addEventListener('resize', updateOrientation);
		return () => window.removeEventListener('resize', updateOrientation);
	});

	return portrait;
};

export default useOrientation;
