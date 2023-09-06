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
import { getAssociationsAPI, UpdateAssociationAPI, DeleteAssociationAPI } from '../../api';
import { ASSOCIATIONS_FETCHING, ASSOCIATIONS_SUCCESS, ASSOCIATIONS_FAILED } from '../../context/type';
import { useAssociationsState, useAssociationsDispatch } from '../../context';
import { MyButton } from '../../components/controls';
import { MySnackbar, ConfirmDialog, Popup, useTable, PublishMenu, MyProgress, Iconify } from '../../components/share';
import { PublishStatusSelector } from '../share/publishStatusSelector';
import { AssociationsForm } from './associationsForm';
import Image from '../../components/Image';
import { shareToSocialMedia } from '../../api/pubFunction';

const AssociationsPage = () => {
  const { translate } = useLocales();
  const eventDispatch = useAssociationsDispatch();
  const eventState = useAssociationsState();
  const { enqueueSnackbar } = useSnackbar();

  const [recordForEdit, setRecordForEdit] = useState(null);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const [fetchDB, setFetchDB] = useState(null);
  const [publishState, setPublishState] = useState('');

  const headCells = [
    { id: 'image', label: translate('share.image') },
    { id: 'name', label: translate('association_page.name') },
    { id: 'status', label: translate('control.status') },
    { id: 'actions', label: translate('control.action'), disableSorting: true },
  ];

  useEffect(() => {
    const FetchData = async () => {
      try {
        eventDispatch({ type: ASSOCIATIONS_FETCHING });
        const result = await getAssociationsAPI();
        eventDispatch({ type: ASSOCIATIONS_SUCCESS, payload: result });
      } catch (e) {
        eventDispatch({ type: ASSOCIATIONS_FAILED });
      }
    };
    FetchData();
  }, [eventDispatch, fetchDB]);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(
    eventState.loading ? [] : eventState.associations,
    headCells,
    filterFn
  );

  const handleSearch = (e) => {
    const { value } = e.target;
    setFilterFn({
      fn: (items) => {
        if (value === '') return items;
        return items.filter(
          (x) =>
            x.name.toLowerCase().includes(value) ||
            x.location.toLowerCase().includes(value) ||
            x.hostedBy.toLowerCase().includes(value) ||
            x.phone.toLowerCase().includes(value)
        );
      },
    });
  };

  const onSelectPublishState = (value) => {
    setPublishState(value);
    setFilterFn({
      fn: (items) => items.filter((x) => x.status === value),
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
      featureImage: item.featureImage,
      name: item.name,
      arrTitle: item.name,
      desc: item.desc,
      link: item.link,
      linkText: item.linkText,
      eventType: item.eventType,
      location: item.location,
      hostedBy: item.hostedBy,
      phone: item.phone,
      whatsapp: item.whatsapp,
      startDate: item.startDate,
      startTime: item.startTime,
      latitude: item.latitude,
      longitude: item.longitude,
      createdAt: item.createdAt,
      createdName: item.createdName,
      createdBy: item.createdBy,
      status: 'Published',
      countryCode: item.countryCode,
    };
    await UpdateAssociationAPI(item.id, newItem);
    setFetchDB(`edit${Math.random()}`);
    await shareToSocialMedia(item.name, item.featureImage, item.accompanyingMobile);
    // reset();
    await new Promise((resolve) => setTimeout(resolve, 500));
    enqueueSnackbar('تم النشر بنجاح');
  };
  const onUnPublish = async (item) => {
    const newItem = {
      featureImage: item.featureImage,
      name: item.name,
      arrTitle: item.name,
      desc: item.desc,
      link: item.link,
      linkText: item.linkText,
      eventType: item.eventType,
      location: item.location,
      hostedBy: item.hostedBy,
      phone: item.phone,
      whatsapp: item.whatsapp,
      startDate: item.startDate,
      startTime: item.startTime,
      latitude: item.latitude,
      longitude: item.longitude,
      createdAt: item.createdAt,
      createdName: item.createdName,
      createdBy: item.createdBy,
      status: 'Pending',
      countryCode: item.countryCode,
    };
    await UpdateAssociationAPI(item.id, newItem);
    setFetchDB(`edit${Math.random()}`);
    // reset();
    await new Promise((resolve) => setTimeout(resolve, 500));
    enqueueSnackbar('تم الغاء النشر بنجاح');
  };

  const onDelete = async (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    console.log('-----------delete--------------');
    console.log(id);
    console.log('-------------------------------');

    DeleteAssociationAPI(id);
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
            {translate('association_page.associations')}
          </Typography>
        </Stack>

        <Card>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
            <TextField
              fullWidth
              // size="small"
              onChange={handleSearch}
              placeholder={`${translate('control.search')} ${translate('association_page.associations')}`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <PublishStatusSelector onSelectPublishState={onSelectPublishState} selectedValue={publishState} />
            {/* <RHFSelect name="purpose" label={translate('association_page.purpose')} sx={{ mb: 1 }}>
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
          {eventState.loading ? (
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
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{format(item.createdAt, 'ar')}</TableCell>
                      <TableCell>{translate(`control.${item.status}`)}</TableCell>
                      {/* <TableCell>{moment('20111031', 'YYYYMMDD').fromNow()}</TableCell> */}
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
          <Popup
            title={`${translate('control.form')} ${translate('association_page.associations')}`}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
          >
            <AssociationsForm recordForEdit={recordForEdit} AfterAddOrEdit={AfterAddOrEdit} />
          </Popup>
          <MySnackbar notify={notify} setNotify={setNotify} />
          <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </Card>
      </Container>
    </Page>
  );
};
export default AssociationsPage;
