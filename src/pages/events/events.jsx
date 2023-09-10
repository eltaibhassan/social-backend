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
import { getEventsAPI, UpdateEventAPI, DeleteEventAPI } from '../../api';
import { EVENTS_FETCHING, EVENTS_SUCCESS, EVENTS_FAILED } from '../../context/type';
import { useEventsState, useEventsDispatch } from '../../context';
import { MyButton } from '../../components/controls';
import { MySnackbar, ConfirmDialog, Popup, useTable, PublishMenu, MyProgress, Iconify } from '../../components/share';
import { PublishStatusSelector } from '../share/publishStatusSelector';
import { EventsForm } from './eventsForm';
import Image from '../../components/Image';
import { shareToSocialMedia } from '../../api/pubFunction';

const EventsPage = () => {
  const { translate } = useLocales();
  const eventsDispatch = useEventsDispatch();
  const eventsState = useEventsState();
  const { enqueueSnackbar } = useSnackbar();
  // const nav = useNavigate();

  const [recordForEdit, setRecordForEdit] = useState(null);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const [fetchDB, setFetchDB] = useState(null);
  const [publishState, setPublishState] = useState('');

  const headCells = [
    { id: 'image', label: translate('share.image') },
    { id: 'title', label: translate('events_page.title') },
    { id: 'createdAt', label: translate('share.createdAt') },
    { id: 'status', label: translate('control.status') },
    { id: 'actions', label: translate('control.action'), disableSorting: true },
  ];

  useEffect(() => {
    const FetchData = async () => {
      try {
        eventsDispatch({ type: EVENTS_FETCHING });
        const result = await getEventsAPI();
        eventsDispatch({ type: EVENTS_SUCCESS, payload: result });
      } catch (e) {
        eventsDispatch({ type: EVENTS_FAILED });
      }
    };
    FetchData();
  }, [eventsDispatch, fetchDB]);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(
    eventsState.loading ? [] : eventsState.events,
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
            x.title.toLowerCase().includes(value) ||
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
      title: item.title,
      arrTitle: item.arrTitle,
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
    await UpdateEventAPI(item.id, newItem);
    setFetchDB(`edit${Math.random()}`);
    await shareToSocialMedia(item.title, item.featureImage, item.accompanyingMobile);
    // reset();
    await new Promise((resolve) => setTimeout(resolve, 500));
    enqueueSnackbar('تم النشر بنجاح');
  };
  const onUnPublish = async (item) => {
    const newItem = {
      featureImage: item.featureImage,
      title: item.title,
      arrTitle: item.arrTitle,
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
    await UpdateEventAPI(item.id, newItem);
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

    DeleteEventAPI(id);
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
            {translate('events_page.events')}
          </Typography>
        </Stack>

        <Card>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
            <TextField
              fullWidth
              // size="small"
              onChange={handleSearch}
              placeholder={`${translate('control.search')} ${translate('events_page.events')}`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <PublishStatusSelector onSelectPublishState={onSelectPublishState} selectedValue={publishState} />
            {/* <RHFSelect name="purpose" label={translate('events_page.purpose')} sx={{ mb: 1 }}>
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
          {eventsState.loading ? (
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
            title={`${translate('control.form')} ${translate('events_page.events')}`}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
          >
            <EventsForm recordForEdit={recordForEdit} AfterAddOrEdit={AfterAddOrEdit} />
          </Popup>
          <MySnackbar notify={notify} setNotify={setNotify} />
          <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </Card>
      </Container>
    </Page>
  );
};
export default EventsPage;
