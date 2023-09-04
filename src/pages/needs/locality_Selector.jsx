import React, { useEffect } from 'react';
import useLocales from '../../hooks/useLocales';
import { LOCALITY_FETCHING, LOCALITY_SUCCESS, LOCALITY_FAILED } from '../../context/type';
import { getLocalitiesAPI } from '../../api/localitiesAPI';
import { useLocalityState, useLocalityDispatch } from '../../context/localitiesContext';
import { MySelectLocality } from '../../components/controls';

const LocalitySelector = (props) => {
  const { onSelectLocality, selectedValue, stateId } = props;
  const { translate } = useLocales();
  const localityDispatch = useLocalityDispatch();
  const localityState = useLocalityState();

  useEffect(() => {
    const FetchData = async () => {
      try {
        localityDispatch({ type: LOCALITY_FETCHING });
        const result = await getLocalitiesAPI(stateId);
        localityDispatch({ type: LOCALITY_SUCCESS, payload: result });
      } catch (e) {
        localityDispatch({ type: LOCALITY_FAILED });
      }
    };
    FetchData();
  }, [localityDispatch, stateId]);

  const handleLocalityChange = (e) => {
    onSelectLocality(e.target.value);
  };

  return (
    <MySelectLocality
      label={translate('helps_page.areaid')}
      name="arName"
      value={localityState.loading ? '' : selectedValue}
      onChange={handleLocalityChange}
      options={localityState.localities != null ? localityState.localities : []}
      size={'small'}
    />
  );
};

export { LocalitySelector };
