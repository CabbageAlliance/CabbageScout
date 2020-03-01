import React, {createContext, useReducer, useEffect} from 'react';
import PropTypes from 'prop-types';

const ScoutEntryContext = createContext();

const initialState = {
	match: 0,
	team: 0,

	// Auto
	auto_crossed_line: false,
	auto_uppergoal_scored: 0,
	auto_lowergoal_scored: 0,
	auto_uppergoal_missed: 0,

	// Teleop
	teleop_uppergoal_scored: 0,
	teleop_lowergoal_scored: 0,
	teleop_uppergoal_missed: 0,
	rotation_control_time: 0,
	position_control_time: 0,
	down_time: 0,
	defending_time: 0,

	// Endgame
	hang_attempted: false,
	hang_succeeded: false,
	hang_time: 0,
	hang_level: false,

	driver_rating: 3, // 1-5
	comments: '', // Max 512 chars
	received_foul: false
};

const reducer = (state, action) => {
	if (action.type === 'reset') {
		return {...initialState, ...action.data};
	}

	return {...state, ...action.data};
};

const ScoutEntryProvider = props => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// Fetch scout entry from previous reload
	useEffect(() => {
		const storedState = localStorage.getItem('scoutEntry');
		if (storedState) {
			dispatch({
				type: 'reset',
				data: JSON.parse(storedState)
			});
		}
	}, []);

	// Store scout entry between reloads
	useEffect(() => localStorage.setItem('scoutEntry', JSON.stringify(state)), [state]);

	return <ScoutEntryContext.Provider value={{entryState: state, entryDispatch: dispatch}}>{props.children}</ScoutEntryContext.Provider>;
};

ScoutEntryProvider.propTypes = {
	children: PropTypes.node.isRequired
};

export default ScoutEntryContext;
export {ScoutEntryProvider};
