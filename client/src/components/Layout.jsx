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
	Divider,
	Menu,
	MenuItem
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import AssessmentIcon from '@material-ui/icons/Assessment';

import PropTypes from 'prop-types';
import React, {useState} from 'react';
import Base from './Base';
import Link from 'next/link';

const useStyles = makeStyles(theme => ({
	spacing: {
		flexGrow: 1
	},
	drawerList: {
		width: 200
	},
	nestedMenu: {
		paddingLeft: theme.spacing(4)
	}
}));

const Layout = props => {
	const classes = useStyles();

	const [drawer, setDrawer] = useState(false);
	const toggleDrawer = open => () => setDrawer(open);

	const [dataAnchor, setDataAnchor] = useState(null);
	const handleDataMenuOpen = event => setDataAnchor(event.currentTarget);
	const handleDataMenuClose = () => setDataAnchor(null);

	return (
		<Base title={props.title}>
			<Drawer open={drawer} onClose={toggleDrawer(false)}>
				<List className={classes.drawerList} onClick={toggleDrawer(false)}>
					<Link passHref href='/'>
						<ListItem button>
							<ListItemIcon>
								<HomeIcon />
							</ListItemIcon>
							<ListItemText primary='Home' />
						</ListItem>
					</Link>

					<ListItem>
						<ListItemIcon>
							<AssessmentIcon />
						</ListItemIcon>
						<ListItemText primary='Data' />
					</ListItem>
					<List className={classes.nestedMenu}>
						<Link passHref href='/data/download'>
							<ListItem button>
								<ListItemText primary='Download' />
							</ListItem>
						</Link>
					</List>
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

			<AppBar position='sticky'>
				<Toolbar>
					<Hidden smUp>
						<Box mr={2}>
							<IconButton color='inherit' onClick={toggleDrawer(true)}>
								<MenuIcon />
							</IconButton>
						</Box>
					</Hidden>

					<Link passHref href='/'>
						<Typography variant='h6' style={{cursor: 'pointer'}}>
							CabbageScout
						</Typography>
					</Link>

					<div className={classes.spacing} />

					<Hidden xsDown>
						<Box ml={2}>
							<Button size='large' color='inherit' onClick={handleDataMenuOpen}>
								Data
							</Button>
						</Box>
						<Menu keepMounted anchorEl={dataAnchor} open={dataAnchor} onClose={handleDataMenuClose}>
							<Link passHref href='/data/download'>
								<MenuItem>Download</MenuItem>
							</Link>
						</Menu>
					</Hidden>

					<Box ml={2}>
						<Link passHref href='/scout/new'>
							<Button variant='outlined' color='inherit' size='large'>
								New
							</Button>
						</Link>
					</Box>

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
