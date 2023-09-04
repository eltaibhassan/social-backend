// import React from 'react';
// import useLocales from '../../hooks/useLocales';
// import { MySelectPurpose } from '../../components/controls';

// const PurposeSelector = (props) => {
//   const { onSelectPurpose, selectedValue } = props;
//   const { translate } = useLocales();

//   const handlePurposeChange = (e) => {
//     onSelectPurpose(e.target.value);
//   };

//   const purposeList = [
//     {
//       id: 'need_call',
//       name: translate('helps_page.need_call'),
//     },
//     {
//       id: 'available',
//       name: translate('helps_page.available'),
//     },
//     {
//       id: 'missingPerson',
//       name: translate('helps_page.missingPerson'),
//     },
//     {
//       id: 'missingSomething',
//       name: translate('helps_page.missingSomething'),
//     },
//   ];

//   return (
//     <MySelectPurpose
//       label={translate('helps_page.purpose')}
//       name="purpose"
//       value={selectedValue}
//       onChange={handlePurposeChange}
//       options={purposeList}
//       size={'small'}
//     />
//   );
// };

// export { PurposeSelector };
