import {createStyles, makeStyles} from '@material-ui/core';

/**
 * Material UI styles for a Floating Action Button (FAB) that is positioned in the corner of the screen.
 */
export const cornerFabStyles = makeStyles(theme => createStyles({fab: {position: 'absolute', bottom: theme.spacing(2), right: theme.spacing(2)}}));
