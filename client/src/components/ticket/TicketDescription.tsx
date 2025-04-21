import { Box, useTheme } from '@mui/material';
import TextInfo from '../TextInfo.tsx';

const TicketDescription = ({text}: {text: string}) => {
	const theme = useTheme();

	return (
		<Box sx={{
			backgroundColor: theme.palette.background.paper,
			padding: '24px',
			borderRadius: '12px',
			marginTop: '24px',
			boxShadow: theme.shadows[1],
		}}>
			<TextInfo title={'Описание проблемы'} value={text}/>
		</Box>
	);
};

export default TicketDescription;