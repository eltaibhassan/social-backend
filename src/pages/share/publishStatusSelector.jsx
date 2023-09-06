import React from 'react';
import useLocales from '../../hooks/useLocales';
import { MySelect } from '../../components/controls';

const PublishStatusSelector = (props) => {
  const { onSelectPublishState, selectedValue } = props;
  const { translate } = useLocales();

  const pubStatus = [
    { id: 'Published', arName: 'Published' },
    { id: 'Pending', arName: 'Pending' },
  ];
  const handlePublish = (e) => {
    onSelectPublishState(e.target.value);
  };

  return (
    <MySelect
      label={translate('control.status')}
      name="arName"
      value={selectedValue}
      onChange={handlePublish}
      options={pubStatus}
      size={'large'}
    />
  );
};

export { PublishStatusSelector };
