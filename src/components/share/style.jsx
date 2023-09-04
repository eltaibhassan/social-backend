import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#253053',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    fontWidth: 700,
  },
  root: {
    '&.MuiTableRow-hover:hover': {
      backgroundColor: 'blue',
    },
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f2f2f2',
  },
  '&:last-child td, &:last-child th': {
    border: 1,
  },
  '&:.MuiTableRow-hover': {
    backgroundColor: '#f2f2f2',
  },
}));

export { StyledTableCell, StyledTableRow };
