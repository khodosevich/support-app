import { DashboardItemData } from '../../types/type.ts';
import { Box, useTheme } from '@mui/material';
import DashboardItemHeader from './DashboardItemHeader.tsx';
import DashboardItemMiddle from './DashboardItemMiddle.tsx';
import DashboardItemBody from './DashboardItemBody.tsx';
import React from 'react';

const DashboardItem: React.FC<DashboardItemData> = ({ title, subtitle, total, icon, items, path, type }) => {
	const theme = useTheme();

	return (
		<Box sx={{
			backgroundColor: theme.palette.background.paper,
			borderRadius: '12px',
			border: `1px solid ${theme.palette.divider}`,
			boxShadow: theme.shadows[1],
		}}>
			<DashboardItemHeader title={title} total={total} icon={icon}/>
			<Box sx={{ padding: '24px' }}>
				<DashboardItemMiddle subtitle={subtitle} path={path}/>
				<DashboardItemBody items={items} type={type} src={icon}/>
			</Box>
		</Box>
	);
};

export default DashboardItem;