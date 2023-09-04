import React, { useEffect } from 'react';
import useLocales from '../../hooks/useLocales';
import { STATE_FETCHING, STATE_SUCCESS, STATE_FAILED } from '../../context/type';
import { getStatesAPI } from '../../api/statesAPI';
import { useStateState, useStateDispatch } from '../../context/statesContext';
import { MySelectState } from '../../components/controls';

const StatesSelector = (props) => {
  const { onSelectState, selectedValue } = props;
  const { translate } = useLocales();
  const stateDispatch = useStateDispatch();
  const stateState = useStateState();

  useEffect(() => {
    const FetchData = async () => {
      try {
        stateDispatch({ type: STATE_FETCHING });
        const result = await getStatesAPI();
        stateDispatch({ type: STATE_SUCCESS, payload: result });
      } catch (e) {
        stateDispatch({ type: STATE_FAILED });
      }
    };
    FetchData();
  }, [stateDispatch]);

  const handleStateChange = (e) => {
    onSelectState(e.target.value);
  };

  return (
    <MySelectState
      label={translate('helps_page.cityid')}
      name="arName"
      value={stateState.loading ? '' : selectedValue}
      onChange={handleStateChange}
      options={stateState.loading ? [] : stateState.states}
      size={'small'}
    />
  );
};

export { StatesSelector };
