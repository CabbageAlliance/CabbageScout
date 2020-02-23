import {
	AppBar,
	Box,
	Container,
	Toolbar,
	Button,
	Typography,
	makeStyles,
	IconButton,
	Hidden,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuButton from '@material-ui/icons/Menu';
import HomeButton from '@material-ui/icons/Home';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import Base from './Base';
import Link from 'next/link';

const useStyles = makeStyles({
	spacing: {
		flexGrow: 1
	},
	drawerList: {
		width: 200
	}
});

const Layout = props => {
	const classes = useStyles();

	const [drawer, setDrawer] = useState(false);

	const toggleDrawer = open => () => setDrawer(open);

	return (
		<Base title={props.title}>
			<Drawer open={drawer} onClose={toggleDrawer(false)}>
				<List className={classes.drawerList} onClick={toggleDrawer(false)}>
					<Link passHref href='/'>
						<ListItem button>
							<ListItemIcon>
								<HomeButton />
							</ListItemIcon>
							<ListItemText primary='Home' />
						</ListItem>
					</Link>
				</List>

				<Divider />

				<List className={classes.drawerList} onClick={toggleDrawer(false)}>
					<Link passHref href='/settings'>
						<ListItem button>
							<ListItemIcon>
								<SettingsIcon />
							</ListItemIcon>
							<ListItemText primary='Settings' />
						</ListItem>
					</Link>
				</List>
			</Drawer>

			<AppBar position='relative'>
				<Toolbar>
					<Hidden smUp>
						<Box mr={2}>
							<IconButton color='inherit' onClick={toggleDrawer(true)}>
								<MenuButton />
							</IconButton>
						</Box>
					</Hidden>

					<Link passHref href='/'>
						<Typography variant='h6' style={{cursor: 'pointer'}}>
							CabbageScout
						</Typography>
					</Link>

					<div className={classes.spacing} />

					<Link passHref href='/scout/new'>
						<Button variant='outlined' size='large'>
							New
						</Button>
					</Link>

					<Hidden xsDown>
						<Box ml={2}>
							<Link passHref href='/settings'>
								<IconButton color='inherit'>
									<SettingsIcon />
								</IconButton>
							</Link>
						</Box>
					</Hidden>
				</Toolbar>
			</AppBar>

			<Box my={2.5}>
				<Container maxWidth='sm'>{props.children}</Container>
			</Box>
		</Base>
	);
};

Layout.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
};

export default Layout;
