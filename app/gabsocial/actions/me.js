import api from '../api';
import { importFetchedAccount } from './importer';

export const ME_FETCH_REQUEST = 'ME_FETCH_REQUEST';
export const ME_FETCH_SUCCESS = 'ME_FETCH_SUCCESS';
export const ME_FETCH_FAIL    = 'ME_FETCH_FAIL';
export const ME_FETCH_SKIP    = 'ME_FETCH_SKIP';

export const ME_PATCH_REQUEST = 'ME_PATCH_REQUEST';
export const ME_PATCH_FAIL    = 'ME_PATCH_FAIL';

function hasToken(getState) {
  const accessToken = getState().getIn(['auth', 'user', 'access_token']);
  return Boolean(accessToken);
}

export function fetchMe() {
  return (dispatch, getState) => {

    if (!hasToken(getState)) {
      dispatch({ type: ME_FETCH_SKIP }); return;
    };

    dispatch(fetchMeRequest());

    api(getState).get('/api/v1/accounts/verify_credentials').then(response => {
      dispatch(fetchMeSuccess(response.data));
    }).catch(error => {
      dispatch(fetchMeFail(error));
    });
  };
}

export function patchMe(params) {
  return (dispatch, getState) => {
    dispatch(patchMeRequest());
    return api(getState)
      .patch('/api/v1/accounts/update_credentials', params)
      .then(response => {
        dispatch(fetchMeSuccess(response.data));
      }).catch(error => {
        dispatch(patchMeFail(error));
      });
  };
}

export function fetchMeRequest() {
  return {
    type: ME_FETCH_REQUEST,
  };
}

export function fetchMeSuccess(me) {
  return (dispatch, getState) => {
    dispatch(importFetchedAccount(me));
    dispatch({
      type: ME_FETCH_SUCCESS,
      me,
    });
  };
}

export function fetchMeFail(error) {
  return {
    type: ME_FETCH_FAIL,
    error,
  };
};

export function patchMeRequest() {
  return {
    type: ME_PATCH_REQUEST,
  };
}

export function patchMeFail(error) {
  return {
    type: ME_PATCH_FAIL,
    error,
  };
};
