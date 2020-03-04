import {Box, Button, makeStyles} from '@material-ui/core';
import {NavigateBefore, NavigateNext, Check} from '@material-ui/icons';
import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import Base from '../../components/Base';
import CountCard from '../../components/cards/CountCard';
import TimerCard from '../../components/cards/TimerCard';
import ToggleCard from '../../components/cards/ToggleCard';
import ScoutLayout from '../../components/ScoutLayout';
import useOrientation from '../../util/orientation';
import ScoutEntryContext from '../../util/ScoutEntryContext';

const useStyles = makeStyles({
	root: {
		display: 'grid'
	},

	autoLandscape: {
		gridTemplateRows: '48% 4% 48%',
		gridTemplateColumns: '48% 4% 23% 2% 23%',
		gridTemplateAreas: `'line . up-score . up-miss'
												'line . . . .'
												'line . low-score low-score low-score'`
	},

	autoPortrait: {
		gridTemplateRows: '23% 2% 23% 4% 48%',
		gridTemplateColumns: '48% 4% 48%',
		gridTemplateAreas: `'up-score . up-miss'
												'. . .'
												'low-score low-score low-score'
												'. . .'
												'line line line'`
	},

	teleopLandscape: {
		gridTemplateRows: '48% 4% 48%',
		gridTemplateColumns: '23% 2% 23% 4% 23% 2% 23%',
		gridTemplateAreas: `'rotation . position . up-score . up-miss'
												'. . . . . . .'
												'down . defense . low-score low-score low-score'`
	},

	teleopPortrait: {
		gridTemplateRows: '23% 2% 23% 4% 23% 2% 23%',
		gridTemplateColumns: '48% 4% 48%',
		gridTemplateAreas: `'up-score . up-miss'
												'. . .'
												'low-score low-score low-score'
												'. . .'
												'rotation . position'
												'. . .'
												'down . defense'`
	},

	endgameLandscape: {
		gridTemplateRows: '48% 4% 48%',
		gridTemplateColumns: '48% 4% 48%',
		gridTemplateAreas: `'time . success'
												'time . .'
												'time . level'`
	},

	endgamePortrait: {
		gridTemplateRows: '48% 4% 48%',
		gridTemplateColumns: '48% 4% 48%',
		gridTemplateAreas: `'time time time'
												'. . .'
												'success . level'`
	}
});

const Auto = props => {
	const classes = useStyles();
	const portrait = useOrientation();
	const {entryState, entryDispatch} = useContext(ScoutEntryContext);

	const setValue = field => value => entryDispatch({type: 'input', data: {[field]: value}});

	return (
		<ScoutLayout
			section='Auto'
			navButtons={[
				<Button key='teleop' variant='outlined' endIcon={<NavigateNext />} onClick={props.handleChangeView('teleop')}>
					Teleop
				</Button>
			]}
		>
			<Box height={1} className={clsx(classes.root, portrait ? classes.autoPortrait : classes.autoLandscape)}>
				<ToggleCard title='Crossed Initiation Line?' value={entryState.auto_crossed_line} setValue={setValue('auto_crossed_line')} gridArea='line' />

				<CountCard title='Upper Goal Scored' value={entryState.auto_uppergoal_scored} setValue={setValue('auto_uppergoal_scored')} gridArea='up-score' />
				<CountCard title='Upper Goal Missed' value={entryState.auto_uppergoal_missed} setValue={setValue('auto_uppergoal_missed')} gridArea='up-miss' />
				<CountCard title='Lower Goal Scored' value={entryState.auto_lowergoal_scored} setValue={setValue('auto_lowergoal_scored')} gridArea='low-score' />
			</Box>
		</ScoutLayout>
	);
};

Auto.propTypes = {
	handleChangeView: PropTypes.func.isRequired
};

const Teleop = props => {
	const classes = useStyles();
	const portrait = useOrientation();
	const {entryState, entryDispatch} = useContext(ScoutEntryContext);

	const setTime = field => value => entryDispatch({type: 'input', data: {[field]: value / 1000}});
	const setValue = field => value => entryDispatch({type: 'input', data: {[field]: value}});

	return (
		<ScoutLayout
			section='Teleop'
			navButtons={[
				<Button key='auto' startIcon={<NavigateBefore />} onClick={props.handleChangeView('auto')}>
					Auto
				</Button>,
				<Button key='endgame' variant='outlined' endIcon={<NavigateNext />} onClick={props.handleChangeView('endgame')}>
					Endgame
				</Button>
			]}
		>
			<Box height={1} className={clsx(classes.root, portrait ? classes.teleopPortrait : classes.teleopLandscape)}>
				<CountCard title='Upper Goal Scored' value={entryState.teleop_uppergoal_scored} setValue={setValue('teleop_uppergoal_scored')} gridArea='up-score' />
				<CountCard title='Upper Goal Missed' value={entryState.teleop_uppergoal_missed} setValue={setValue('teleop_uppergoal_missed')} gridArea='up-miss' />
				<CountCard title='Lower Goal Scored' value={entryState.teleop_lowergoal_scored} setValue={setValue('teleop_lowergoal_scored')} gridArea='low-score' />

				<ToggleCard title='Rotation Control' gridArea='rotation' value={entryState.rotation_control} setValue={setValue('rotation_control')} />
				<ToggleCard title='Position Control' gridArea='position' value={entryState.position_control} setValue={setValue('position_control')} />
				<TimerCard title='Down Time' gridArea='down' value={entryState.down_time * 1000} setValue={setTime('down_time')} />
				<TimerCard title='Defending Time' gridArea='defense' value={entryState.defending_time * 1000} setValue={setTime('defending_time')} />
			</Box>
		</ScoutLayout>
	);
};

Teleop.propTypes = {
	handleChangeView: PropTypes.func.isRequired
};

const Endgame = props => {
	const classes = useStyles();
	const portrait = useOrientation();
	const {entryState, entryDispatch} = useContext(ScoutEntryContext);

	const setHangTime = value => entryDispatch({type: 'input', data: {hang_time: value / 1000, hang_attempted: true}});
	const setValue = field => value => entryDispatch({type: 'input', data: {[field]: value}});

	const setHangSuccess = success => {
		entryDispatch({type: 'input', data: {hang_succeeded: success}});
		if (!success) entryDispatch({type: 'input', data: {hang_level: false}});
	};

	return (
		<ScoutLayout
			section='Endgame'
			navButtons={[
				<Button key='teleop' startIcon={<NavigateBefore />} onClick={props.handleChangeView('teleop')}>
					Teleop
				</Button>,
				<Link key='finish' passHref href='/scout/submit'>
					<Button disableElevation variant='contained' endIcon={<Check />} color='primary'>
						Finish
					</Button>
				</Link>
			]}
		>
			<Box height={1} className={clsx(classes.root, portrait ? classes.endgamePortrait : classes.endgameLandscape)}>
				<TimerCard title='Climb Time' gridArea='time' value={entryState.hang_time * 1000} setValue={setHangTime} />

				<ToggleCard
					title='Hang Successful?'
					disabled={!entryState.hang_attempted}
					value={entryState.hang_succeeded}
					setValue={setHangSuccess}
					gridArea='success'
				/>
				<ToggleCard
					title='Hang Level?'
					disabled={!entryState.hang_succeeded}
					value={entryState.hang_level}
					setValue={setValue('hang_level')}
					gridArea='level'
				/>
			</Box>
		</ScoutLayout>
	);
};

Endgame.propTypes = {
	handleChangeView: PropTypes.func.isRequired
};

const Scout = () => {
	const [view, setView] = useState('auto');
	const handleChangeView = view => () => setView(view);

	return (
		<Base title='Scout'>
			<Box display={view === 'auto' ? 'initial' : 'none'}>
				<Auto handleChangeView={handleChangeView} />
			</Box>
			<Box display={view === 'teleop' ? 'initial' : 'none'}>
				<Teleop handleChangeView={handleChangeView} />
			</Box>
			<Box display={view === 'endgame' ? 'initial' : 'none'}>
				<Endgame handleChangeView={handleChangeView} />
			</Box>
		</Base>
	);
};

export default Scout;
