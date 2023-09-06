import React, { useEffect } from 'react';
import useLocales from '../../hooks/useLocales';
import { PROCATS_FETCHING, PROCATS_SUCCESS, PROCATS_FAILED } from '../../context/type';
import { getProCatsAPI } from '../../api';
import { useProCatsState, useProCatsDispatch } from '../../context';

import { MySelectProCats } from '../../components/controls';

const ProCatsSelector = (props) => {
  const { onSelectProCats, selectedValue } = props;
  const { translate } = useLocales();
  const proCatsDispatch = useProCatsDispatch();
  const proCatsState = useProCatsState();

  useEffect(() => {
    const FetchData = async () => {
      try {
        proCatsDispatch({ type: PROCATS_FETCHING });
        const result = await getProCatsAPI();
        console.log(result);
        proCatsDispatch({ type: PROCATS_SUCCESS, payload: result });
      } catch (e) {
        proCatsDispatch({ type: PROCATS_FAILED });
      }
    };
    FetchData();
  }, [proCatsDispatch]);

  const handleProCatsChange = (e) => {
    onSelectProCats(e.target.value);
  };

  return (
    <MySelectProCats
      label={translate('products_page.proCat')}
      name="proCat"
      value={proCatsState.loading ? '' : selectedValue}
      onChange={handleProCatsChange}
      options={proCatsState.loading ? [] : proCatsState.proCats}
      size={'small'}
    />
  );
};

export { ProCatsSelector };
