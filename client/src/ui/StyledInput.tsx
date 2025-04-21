import { styled } from '@mui/material';

export const StyledInput = styled('input')(
	({ theme }) => `
    width: 100%;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.text.primary};
    background: ${theme.palette.background.paper};
    border: 1px solid ${theme.palette.divider};
    box-shadow: 0 2px 2px rgba(0,0,0,0.1);
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: ${theme.palette.primary.main};
    }
`,
);