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
import { useSnackbar } from 'notistack';
import { format } from 'timeago.js';
import { Page } from '../../components/Page';
import useLocales from '../../hooks/useLocales';
import { Scrollbar } from '../../components/Scrollbar';
import { getHelpsAPI, UpdateHelpAPI, DeleteHelpAPI } from '../../api/newsAPI';
import { HELPS_FETCHING, HELPS_SUCCESS, HELPS_FAILED } from '../../context/type';
import { useHelpState, useHelpDispatch } from '../../context/newsContext';
import { MyButton } from '../../components/controls';
import { MySnackbar, ConfirmDialog, Popup, useTable, PublishMenu, MyProgress, Iconify } from '../../components/share';
import { PublishStatusSelector } from './publishStatusSelector';
import { HelpForm } from './carForm';
import Image from '../../components/Image';
import { shareToSocialMedia } from '../../api/pubFunction';

const NewsPage = () => {
  const { translate } = useLocales();
  const helpDispatch = useHelpDispatch();
  const helpState = useHelpState();
  const { enqueueSnackbar } = useSnackbar();
  // const nav = useNavigate();

  const [recordForEdit, setRecordForEdit] = useState(null);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const [fetchDB, setFetchDB] = useState(null);
  // const [publishState, setPublishState] = useState('');

  const locPurpose = 'sVfnoGyFShDF0o4HrHTt';

  const headCells = [
    { id: 'image', label: translate('helps_page.image') },
    { id: 'title', label: translate('helps_page.title') },
    { id: 'carNo', label: translate('helps_page.carNo') },
    { id: 'createdAt', label: translate('helps_page.createdAt') },
    { id: 'helpStatus', label: translate('helps_page.helpStatus') },
    { id: 'actions', label: translate('control.action'), disableSorting: true },
  ];

  useEffect(() => {
    const FetchData = async () => {
      try {
        helpDispatch({ type: HELPS_FETCHING });
        const result = await getHelpsAPI(locPurpose);
        helpDispatch({ type: HELPS_SUCCESS, payload: result });
      } catch (e) {
        helpDispatch({ type: HELPS_FAILED });
      }
    };
    FetchData();
  }, [helpDispatch, fetchDB]);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(
    helpState.loading ? [] : helpState.helps,
    headCells,
    filterFn
  );

  const handleSearch = (e) => {
    const { value } = e.target;
    setFilterFn({
      fn: (items) => {
        if (value === '') return items;
        return items.filter(
          (x) => x.carNo.toLowerCase().includes(value) || x.accompanyingName.toLowerCase().includes(value)
        );
      },
    });
  };

  const onSelectPublishState = (value) => {
    console.log('---------------------------');
    console.log(value);
    // setPublishState(value);
    setFilterFn({
      fn: (items) => items.filter((x) => x.helpStatus === value),
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

  const onPublish = async (item) => {
    const newItem = {
      id: item.id,
      featureImage: item.featureImage,
      title: item.title,
      arrTitle: item?.arrTitle ?? [],
      purpose: item.purpose,
      helpType: item.helpType,
      cityid: item.cityid,
      areaid: item.areaid,
      carNo: item.carNo,
      carNoLetter: item?.carNoLetter ?? '',
      shasNo: item.shasNo,
      address: item.address,
      description: item.description,
      latitude: item.latitude,
      longitude: item.longitude,
      isFeatured: item.isFeatured,
      youCanPay: item.youCanPay,
      accompanyingName: item.accompanyingName,
      accompanyingMobile: item.accompanyingMobile,
      ccPhoneNo: item?.ccPhoneNo ?? '',
      createdAt: new Date().getTime(),
      helpStatus: 'Published',
      favoriteList: item.favoriteList,
      mobile: item.mobile,
      status: item.status,
      createdName: item.createdName,
      createdBy: item.createdBy,
    };
    await UpdateHelpAPI(newItem);
    await shareToSocialMedia(item.title, item.featureImage, item.accompanyingMobile);
    await new Promise((resolve) => setTimeout(resolve, 500));
    enqueueSnackbar('تم النشر بنجاح');
    // setFetchDB(`edit${Math.random()}`);
  };
  const onUnPublish = async (item) => {
    const newItem = {
      id: item.id,
      featureImage: item.featureImage,
      title: item.title,
      arrTitle: item.arrTitle,
      purpose: item.purpose,
      helpType: item.helpType,
      cityid: item.cityid,
      areaid: item.areaid,
      carNo: item.carNo,
      carNoLetter: item.carNoLetter,
      shasNo: item.shasNo,
      address: item.address,
      description: item.description,
      latitude: item.latitude,
      longitude: item.longitude,
      isFeatured: item.isFeatured,
      youCanPay: item.youCanPay,
      accompanyingName: item.accompanyingName,
      accompanyingMobile: item.accompanyingMobile,
      ccPhoneNo: item.ccPhoneNo,
      createdAt: new Date().getTime(),
      helpStatus: 'Pending',
      favoriteList: item.favoriteList,
      mobile: item.mobile,
      status: item.status,
      createdName: item.createdName,
      createdBy: item.createdBy,
    };
    await UpdateHelpAPI(newItem);
    // reset();
    await new Promise((resolve) => setTimeout(resolve, 500));
    enqueueSnackbar('Create success!');
    // setFetchDB(`edit${Math.random()}`);
  };

  const onDelete = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    DeleteHelpAPI(id);
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
            {translate('helps_page.helps')}
          </Typography>
        </Stack>

        <Card>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
            <TextField
              fullWidth
              // size="small"
              onChange={handleSearch}
              placeholder={`${translate('control.search')} ${translate('helps_page.helps')}`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <PublishStatusSelector onSelectPublishState={onSelectPublishState} />
            {/* <RHFSelect name="purpose" label={translate('helps_page.purpose')} sx={{ mb: 1 }}>
              {pubStatus.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </RHFSelect> */}
            <MyButton
              text={translate('control.addnew')}
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={async () => {
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
          {helpState.loading ? (
            <MyProgress />
          ) : (
            <Scrollbar>
              <TblContainer>
                <TblHead />
                <TableBody>
                  {recordsAfterPagingAndSorting().map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Image
                          alt="City Image"
                          src={item.featureImage}
                          sx={{ width: 100, height: 100, borderRadius: 1 }}
                        />
                      </TableCell>

                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.carNo}</TableCell>
                      <TableCell>
                        {translate(format(item.createdAt, 'ar.ts'))}
                        <br />
                        <br />
                        {item.createdAt}
                      </TableCell>
                      <TableCell>{translate(`helps_page.${item.helpStatus}`)}</TableCell>
                      <TableCell>
                        <PublishMenu
                          onPublish={() => {
                            onPublish(item);
                          }}
                          onUnPublish={() => {
                            onUnPublish(item);
                          }}
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
          <Popup title={`${translate('form')} ${translate('helps')}`} openPopup={openPopup} setOpenPopup={setOpenPopup}>
            <HelpForm recordForEdit={recordForEdit} AfterAddOrEdit={AfterAddOrEdit} />
          </Popup>
          <MySnackbar notify={notify} setNotify={setNotify} />
          <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </Card>
      </Container>
    </Page>
  );
};
export default NewsPage;
