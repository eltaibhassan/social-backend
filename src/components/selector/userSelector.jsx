import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import { getUsersAPI } from '../../api/usersAPI';
import { USER_FETCHING, USER_SUCCESS, USER_FAILED } from '../../context/type';
import { useUsersState, useUsersDispatch } from '../../context/usersContext';
import { MySelect } from '../controls';

const UserSelector = (props) => {
  const { onSelectUser, selectedValue, fname, size } = props;

  const { user } = useAuth();
  const { translate } = useLocales();
  const usersDispatch = useUsersDispatch();
  const usersState = useUsersState();

  useEffect(() => {
    const FetchData = async () => {
      try {
        usersDispatch({ type: USER_FETCHING });
        const result = await getUsersAPI(user);
        usersDispatch({ type: USER_SUCCESS, payload: result.data });
      } catch (e) {
        usersDispatch({ type: USER_FAILED });
      }
    };
    FetchData();
  }, [usersDispatch, user]);

  const handleChange = (e) => {
    onSelectUser(e.target.value);
  };

  return (
    <MySelect
      label={translate('users')}
      name="arName"
      value={usersState.loading ? '' : selectedValue}
      onChange={handleChange}
      options={usersState.loading ? [] : usersState.users}
      size={size || 'small'}
    />
  );
};

export { UserSelector };
