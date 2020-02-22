import {makeStyles} from '@material-ui/core';

const useCardStyles = makeStyles({
	root: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'initial'
	},

	title: {
		fontSize: 14
	},

	titleContainer: {
		padding: 10,
		paddingBottom: 0
	},

	content: {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default useCardStyles;
