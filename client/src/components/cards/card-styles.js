import {makeStyles} from '@material-ui/core';

const useCardStyles = makeStyles(theme => ({
	root: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'initial'
	},

	disabledRoot: {
		backgroundColor: theme.palette.action.disabledBackground,
		color: theme.palette.action.disabled,
		boxShadow: 'none'
	},

	title: {
		fontSize: 15
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
}));

export default useCardStyles;
