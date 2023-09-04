import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  TableBody,
  Container,
  Typography,
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
  Stack,
  Card,
} from '@mui/material';
import { Page } from '../../components/Page';
import useLocales from '../../hooks/useLocales';
import { Scrollbar } from '../../components/Scrollbar';
import { getStatesAPI, DeleteStateAPI } from '../../api/statesAPI';
import { CANDIDATES_FETCHING, CANDIDATES_SUCCESS, CANDIDATES_FAILED } from '../../context/type';
import { useStateState, useStateDispatch } from '../../context/statesContext';
import { MyButton } from '../../components/controls';
import { MySnackbar, ConfirmDialog, Popup, useTable, UserMoreMenu, MyProgress, Iconify } from '../../components/share';
import { StateForm } from './stateForm';
import { CategoriesSelector } from '../category/categorySelector';

const StatesPage = () => {
  const { translate } = useLocales();
  const stateDispatch = useStateDispatch();
  const stateState = useStateState();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const [fetchDB, setFetchDB] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const headCells = [
    { id: 'indNo', label: translate('indNo') },
    { id: 'name', label: translate('name') },
    { id: 'catId', label: translate('catId') },
    { id: 'actions', label: translate('action'), disableSorting: true },
  ];

  useEffect(() => {
    const FetchData = async () => {
      try {
        stateDispatch({ type: CANDIDATES_FETCHING });
        const result = await getStatesAPI(selectedCategory);
        stateDispatch({ type: CANDIDATES_SUCCESS, payload: result });
      } catch (e) {
        stateDispatch({ type: CANDIDATES_FAILED });
      }
    };
    FetchData();
  }, [stateDispatch, selectedCategory, fetchDB]);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(
    stateState.loading ? [] : stateState.states,
    headCells,
    filterFn
  );
  const handleCategoryChange = (val) => {
    setSelectedCategory(val);
  };
  const handleSearch = (e) => {
    const { value } = e.target;
    setFilterFn({
      fn: (items) => {
        if (value === '') return items;
        return items.filter(
          (x) =>
            x.name.toLowerCase().includes(value) ||
            x.mobile.toLowerCase().includes(value) ||
            x.qId.toLowerCase().includes(value)
        );
      },
    });
  };

  const AfterAddOrEdit = () => {
    setFetchDB(`edit${Math.random()}`);
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDelete = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    DeleteStateAPI(id);
    setFetchDB(`deleted${Math.random()}`);
    setNotify({
      isOpen: true,
      message: translate('message.seleted_successfully'),
      type: 'error',
    });
  };

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            {translate('states')}
          </Typography>
        </Stack>

        <Card>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
            <TextField
              fullWidth
              onChange={handleSearch}
              placeholder={`${translate('search')} ${translate('states')}`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <CategoriesSelector onSelectCategory={handleCategoryChange} selectedValue={selectedCategory} />
            <MyButton
              text={translate('addnew')}
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                setOpenPopup(true);
                setRecordForEdit(null);
              }}
              sx={{
                height: 60,
                minWidth: { sm: 150 },
                textTransform: 'capitalize',
              }}
            />
          </Stack>
          {stateState.loading ? (
            <MyProgress />
          ) : (
            <Scrollbar>
              <TblContainer>
                <TblHead />
                <TableBody>
                  {recordsAfterPagingAndSorting().map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.indNo}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.catId}</TableCell>
                      <TableCell>
                        <UserMoreMenu
                          onEdit={() => {
                            openInPopup(item);
                          }}
                          onDelete={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: translate('message.Are_you_sure_to_delete_this_record'),
                              subTitle: translate('message.You_cant_undo_this_operation'),
                              onConfirm: () => {
                                onDelete(item.id);
                              },
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TblContainer>
              <TblPagination />
            </Scrollbar>
          )}
          <Popup
            title={`${translate('form')} ${translate('states')}`}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
          >
            <StateForm recordForEdit={recordForEdit} AfterAddOrEdit={AfterAddOrEdit} />
          </Popup>
          <MySnackbar notify={notify} setNotify={setNotify} />
          <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </Card>
      </Container>
    </Page>
  );
};
export default StatesPage;
