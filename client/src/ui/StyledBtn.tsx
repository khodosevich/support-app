import { styled } from '@mui/material';

export const StyledBtn = styled('button')(
	({ theme }) => `
    width: 100%;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 10px 100px;
    border-radius: 70px;
    color: ${theme.palette.primary.contrastText};
    background: ${theme.palette.primary.main};
    border: none;
    box-shadow: none;
    transition: background 0.3s ease-in-out;
    cursor: pointer;
    
    &:hover {
      background: #18cd9e;
    }
`,
);