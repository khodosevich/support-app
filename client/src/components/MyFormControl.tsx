import { FormControl, FormLabel, useTheme } from '@mui/material';
import { StyledInput } from '../ui/StyledInput.tsx';
import { FormControlType } from '../types/type.ts';

const MyFormControl = ({ labelValue, placeholder, labelRequired, inputType, name, value, onChange, error }: FormControlType) => {
	const theme = useTheme();

	return (
		<FormControl defaultValue="" required error={!!error}>
			<FormLabel required={labelRequired} sx={{ color: theme.palette.text.primary }}>
				{labelValue}
			</FormLabel>
			<StyledInput
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				type={inputType}
				sx={{
					marginTop: '5px',
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
				}}
			/>
		</FormControl>
	);
};

export default MyFormControl;