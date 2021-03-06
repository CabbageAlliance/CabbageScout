import {
	AppBar,
	Box,
	Button,
	Container,
	Divider,
	Drawer,
	Hidden,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
	Menu,
	MenuItem,
	Toolbar,
	Typography
} from '@material-ui/core';
import {Assessment, Home, Menu as MenuIcon, Settings} from '@material-ui/icons';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import Base from './Base';

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
								<Home />
							</ListItemIcon>
							<ListItemText primary='Home' />
						</ListItem>
					</Link>

					<ListItem>
						<ListItemIcon>
							<Assessment />
						</ListItemIcon>
						<ListItemText primary='Data' />
					</ListItem>
					<List className={classes.nestedMenu}>
						<Link passHref href='/data/teams'>
							<ListItem button>
								<ListItemText primary='Team Search' />
							</ListItem>
						</Link>
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
								<Settings />
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
						<Menu keepMounted anchorEl={dataAnchor} open={Boolean(dataAnchor)} onClose={handleDataMenuClose}>
							<MenuItem>
								<Link passHref href='/data/teams'>
									<div>Team Search</div>
								</Link>
							</MenuItem>
							<MenuItem>
								<Link passHref href='/data/download'>
									<div>Download</div>
								</Link>
							</MenuItem>
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
									<Settings />
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
