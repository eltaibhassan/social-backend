import React, { useEffect } from 'react';
import useLocales from '../../hooks/useLocales';
import { getHelpTypesAPI } from '../../api/helpTypesAPI';
import { HELPS_TYPE_FETCHING, HELPS_TYPE_SUCCESS, HELPS_TYPE_FAILED } from '../../context/type';
import { useHelpTypeState, useHelpTypeDispatch } from '../../context/helpTypesContext';

// import { MySelectHelpType } from '../../components/controls';
import { MySelectHelpType } from '../../components/controls';

const HelpTypeSelector = (props) => {
  const { onSelectHelpType, selectedValue } = props;
  const { translate } = useLocales();
  const helpTypeDispatch = useHelpTypeDispatch();
  const helpTypeState = useHelpTypeState();

  useEffect(() => {
    const FetchData = async () => {
      try {
        helpTypeDispatch({ type: HELPS_TYPE_FETCHING });
        const result = await getHelpTypesAPI();
        helpTypeDispatch({ type: HELPS_TYPE_SUCCESS, payload: result });
      } catch (e) {
        helpTypeDispatch({ type: HELPS_TYPE_FAILED });
      }
    };
    FetchData();
  }, [helpTypeDispatch]);

  const handleHelpTypeChange = (e) => {
    onSelectHelpType(e.target.value);
  };

  return (
    <MySelectHelpType
      label={translate('helps_page.helpType')}
      name="arName"
      value={helpTypeState.loading ? '' : selectedValue}
      onChange={handleHelpTypeChange}
      options={helpTypeState.loading ? [] : helpTypeState.helpTypes}
      size={'small'}
    />
  );
};

export { HelpTypeSelector };
