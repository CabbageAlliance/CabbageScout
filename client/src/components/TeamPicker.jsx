import {CircularProgress, TextField, Typography, Grid} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {createFilterOptions} from '@material-ui/lab/Autocomplete';
import propTypes from 'prop-types';
import React from 'react';
import useSWR from 'swr';
import {json} from '../util/data-fetching';

const TeamPicker = props => {
	const {data, error} = useSWR('/teams.json', json);
	const [open, setOpen] = React.useState(false);
	/** @param {boolean} val Value to use */
	const useOpen = val => () => setOpen(val);
	const [teams, setTeams] = React.useState([]);
	const loading = open && teams.length === 0;

	React.useEffect(() => {
		let active = true;

		if (!loading) {
			return undefined;
		}

		(async () => {
			if (!error && active) {
				setTeams(data);
			}
		})();

		return () => {
			active = false;
		};
	}, [data, error, loading]);

	React.useEffect(() => {
		if (!open) {
			setTeams([]);
		}
	}, [open]);

	const filterOptions = createFilterOptions({
		matchFrom: 'any',
		stringify: option => [option.num.toString(), option.name].join(''),
		limit: 5,
		trim: true
	});

	return (
		<Autocomplete
			open={open}
			getOptionSelected={(option, value) => option.num === value.num}
			getOptionLabel={option => option.num?.toString()}
			options={teams}
			loading={loading}
			freeSolo
			filterOptions={filterOptions}
			onInputChange={props.onInputChange}
			renderInput={params => (
				<TextField
					{...params}
					label='Team'
					variant='outlined'
					{...props.textFieldProps}
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<>
								{loading ? <CircularProgress color='inherit' size={20} /> : null}
								{params.InputProps.endAdornment}
							</>
						)
					}}
				/>
			)}
			renderOption={option => (
				<Grid container direction='row' justify='flex-start' alignItems='flex-start' spacing={2}>
					<Grid item >
						<Typography>{option.name}</Typography>
					</Grid>
					<Grid item>
						<Typography color='textSecondary'>{option.num}</Typography>
					</Grid>
				</Grid>
			)}
			onOpen={useOpen(true)}
			onClose={useOpen(false)}
		/>
	);
};

TeamPicker.propTypes = {
	onInputChange: propTypes.func.isRequired,
	textFieldProps: propTypes.object
};

export default TeamPicker;
