import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import {
  TableBody,
  Container,
  Typography,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  Stack,
  Card,
} from '@mui/material';
import { Page } from '../../components/Page';
import { useAuth } from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import { getUsersAPI, AddUserAPI, UpdateUserAPI, DeleteUserAPI } from '../../api/usersAPI';
import { USER_FETCHING, USER_SUCCESS, USER_FAILED } from '../../context/type';
import { useUsersState, useUsersDispatch } from '../../context/usersContext';
import { MyButton, MyInput } from '../../components/controls';
import { MySnackbar, ConfirmDialog, Popup, useTable, UserMoreMenu, MyProgress, Iconify } from '../../components/share';
import { UsersForm } from './usersForm';

const headCells = [
  { id: 'icon', label: 'الرمز' },
  { id: 'arName', label: 'الاسم العربي' },
  { id: 'enName', label: 'الاسم الانجليزي' },
  { id: 'actions', label: 'الاجراء', disableSorting: true },
];

const Users = () => {
  const { user } = useAuth();
  const { translate } = useLocales();
  const usersDispatch = useUsersDispatch();
  const usersState = useUsersState();
  const [recordForEdit, setRecordForEdit] = useState(null);

  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const [fetchDB, setFetchDB] = useState(null);

  useEffect(() => {
    const FetchData = async () => {
      try {
        usersDispatch({ type: USER_FETCHING });
        const result = await getUsersAPI(user);
        usersDispatch({ type: USER_SUCCESS, payload: result.data });
      } catch (e) {
        usersDispatch({ type: USER_FAILED });
      }
    };
    FetchData();
  }, [usersDispatch, fetchDB, user]);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(
    usersState.loading ? [] : usersState.users,
    headCells,
    filterFn
  );

  const handleSearch = (e) => {
    const { value } = e.target;
    setFilterFn({
      fn: (items) => {
        if (value === '') return items;
        return items.filter((x) => x.arName.toLowerCase().includes(value));
      },
    });
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
    DeleteUserAPI(id);
    setFetchDB(`deleted${Math.random()}`);
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      type: 'error',
    });
  };

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" gutterBottom>
            {translate('users')}
          </Typography>
        </Stack>

        <Card>
          <Toolbar sx={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <MyInput
              mysx="75%"
              label="Search Employees"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
            />
            <MyButton
              text="Add New"
              variant="outlined"
              startIcon={<AddIcon />}
              className="{classes.newButton}"
              onClick={() => {
                setOpenPopup(true);
                setRecordForEdit(null);
              }}
            />
          </Toolbar>
          {usersState.loading ? (
            <MyProgress />
          ) : (
            <>
              <TblContainer>
                <TblHead />
                <TableBody>
                  {Array.isArray(recordsAfterPagingAndSorting())
                    ? recordsAfterPagingAndSorting().map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <Iconify icon={item.icon} sx={{ width: 40, height: 40, ml: 1 }} />
                          </TableCell>
                          <TableCell>{item.arName}</TableCell>
                          <TableCell>{item.enName}</TableCell>
                          <TableCell>
                            <UserMoreMenu
                              onEdit={() => {
                                openInPopup(item);
                              }}
                              onDelete={() => {
                                setConfirmDialog({
                                  isOpen: true,
                                  title: translate('Are_you_sure_to_delete_this_record'),
                                  subTitle: translate('You_cant_undo_this_operation'),
                                  onConfirm: () => {
                                    onDelete(item.id);
                                  },
                                });
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    : []}
                </TableBody>
              </TblContainer>
              <TblPagination />
            </>
          )}
          <Popup title={translate('')} openPopup={openPopup} setOpenPopup={setOpenPopup}>
            <UsersForm recordForEdit={recordForEdit} />
          </Popup>
          <MySnackbar notify={notify} setNotify={setNotify} />
          <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </Card>
      </Container>
    </Page>
  );
};
export default Users;
