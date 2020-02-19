import React, {createContext, useReducer, useEffect} from 'react';
import PropTypes from 'prop-types';

const ScoutEntryContext = createContext();

const initialState = {
	actions: [],
	entry: {
		match: 0,
		team: 0,

		// Auto
		auto_crossed_line: false,
		auto_uppergoal_scored: 0,
		auto_lowergoal_scored: 0,

		// Teleop
		teleop_uppergoal_scored: 0,
		teleop_lowergoal_scored: 0,
		teleop_uppergoal_misssed: 0,
		rotation_control_time: 0,
		position_control_time: 0,
		defending_time: 0,

		// Endgame
		hang_attempted: false,
		hang_suceeded: false,
		hang_time: 0,
		hang_level: false,

		driver_rating: 0,
		down_time: 0,
		comments: '',
		recieved_foul: false
	}
};

const reducer = (state, action) => {
	if (action.type === 'storage') {
		return action.data;
	}

	if (action.type === 'new') {
		return {
			actions: [],
			entry: {...initialState.entry, ...action.data}
		};
	}

	if (action.type === 'undo') {
		// Specific undo logic will be handled per-case in the scout component itself since it needs to for changing the page state anyway
		state.actions.pop();
	} else if (action.type !== 'submit') {
		// Form input at the last step doesn't need undos
		state.actions.push(action.type);
	}

	console.log(action);

	return {
		actions: state.actions,
		entry: {...state.entry, ...action.data}
	};
};

const ScoutEntryProvider = props => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// Fetch scout entry from previous reload
	useEffect(() => {
		const storedState = localStorage.getItem('scoutEntry');
		if (storedState) {
			dispatch({
				type: 'storage',
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
