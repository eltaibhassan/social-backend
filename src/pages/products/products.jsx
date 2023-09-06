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
import { getProductsAPI, UpdateProductAPI, DeleteProductAPI } from '../../api';
import { PRODUCTS_FETCHING, PRODUCTS_SUCCESS, PRODUCTS_FAILED } from '../../context/type';
import { useProductsState, useProductsDispatch } from '../../context';
import { MyButton } from '../../components/controls';
import { MySnackbar, ConfirmDialog, Popup, useTable, PublishMenu, MyProgress, Iconify } from '../../components/share';
import { PublishStatusSelector } from '../share/publishStatusSelector';
import { ProductsForm } from './productsForm';
import Image from '../../components/Image';
import { shareToSocialMedia } from '../../api/pubFunction';

const ProductsPage = () => {
  const { translate } = useLocales();
  const productsDispatch = useProductsDispatch();
  const productsState = useProductsState();
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
    { id: 'proName', label: translate('products_page.proName') },
    { id: 'createdAt', label: translate('share.createdAt') },
    { id: 'status', label: translate('control.status') },
    { id: 'actions', label: translate('control.action'), disableSorting: true },
  ];

  useEffect(() => {
    const FetchData = async () => {
      try {
        productsDispatch({ type: PRODUCTS_FETCHING });
        const result = await getProductsAPI();
        productsDispatch({ type: PRODUCTS_SUCCESS, payload: result });
      } catch (e) {
        productsDispatch({ type: PRODUCTS_FAILED });
      }
    };
    FetchData();
  }, [productsDispatch, fetchDB]);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(
    productsState.loading ? [] : productsState.products,
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
      proCat: item.featureImage,
      proName: item.featureImage,
      arrProName: item.featureImage,
      desc: item.featureImage,
      featureImage: item.featureImage,
      images: item.featureImage,
      whatsapp: item.featureImage,
      phone: item.featureImage,
      unitBy: item.featureImage,
      unitPrice: item.featureImage,
      address: item.featureImage,
      latitude: item.featureImage,
      longitude: item.featureImage,
      conmmentList: item.featureImage,
      isFeatured: item.featureImage,
      createdName: item.featureImage,
      createdBy: item.featureImage,
      createdAt: item.featureImage,
      status: 'Published',
      countryCode: item.featureImage,
    };
    await UpdateProductAPI(item.id, newItem);
    setFetchDB(`edit${Math.random()}`);
    await shareToSocialMedia(item.title, item.featureImage, item.accompanyingMobile);
    // reset();
    await new Promise((resolve) => setTimeout(resolve, 500));
    enqueueSnackbar('تم النشر بنجاح');
  };
  const onUnPublish = async (item) => {
    const newItem = {
      proCat: item.featureImage,
      proName: item.featureImage,
      arrProName: item.featureImage,
      desc: item.featureImage,
      featureImage: item.featureImage,
      images: item.featureImage,
      whatsapp: item.featureImage,
      phone: item.featureImage,
      unitBy: item.featureImage,
      unitPrice: item.featureImage,
      address: item.featureImage,
      latitude: item.featureImage,
      longitude: item.featureImage,
      conmmentList: item.featureImage,
      isFeatured: item.featureImage,
      createdName: item.featureImage,
      createdBy: item.featureImage,
      createdAt: item.featureImage,
      status: 'Pending',
      countryCode: item.featureImage,
    };
    await UpdateProductAPI(item.id, newItem);
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

    DeleteProductAPI(id);
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
            {translate('products_page.products')}
          </Typography>
        </Stack>

        <Card>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
            <TextField
              fullWidth
              // size="small"
              onChange={handleSearch}
              placeholder={`${translate('control.search')} ${translate('products_page.products')}`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <PublishStatusSelector onSelectPublishState={onSelectPublishState} selectedValue={publishState} />
            {/* <RHFSelect name="purpose" label={translate('products_page.purpose')} sx={{ mb: 1 }}>
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
          {productsState.loading ? (
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
                      <TableCell>{item.proName}</TableCell>
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
            title={`${translate('control.form')} ${translate('products_page.products')}`}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
          >
            <ProductsForm recordForEdit={recordForEdit} AfterAddOrEdit={AfterAddOrEdit} />
          </Popup>
          <MySnackbar notify={notify} setNotify={setNotify} />
          <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </Card>
      </Container>
    </Page>
  );
};
export default ProductsPage;
