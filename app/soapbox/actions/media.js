import api from '../api';
import { getFeatures } from 'soapbox/utils/features';

const noOp = () => {};

export function uploadMediaV1(data, onUploadProgress = noOp) {
  return (dispatch, getState) => {
    return api(getState).post('/api/v1/media', data, {
      onUploadProgress: onUploadProgress,
    });
  };
}

export function uploadMediaV2(data, onUploadProgress = noOp) {
  return (dispatch, getState) => {
    return api(getState).post('/api/v2/media', data, {
      onUploadProgress: onUploadProgress,
    });
  };
}

export function uploadMedia(data, onUploadProgress = noOp) {
  return (dispatch, getState) => {
    const state = getState();
    const instance = state.get('instance');
    const features = getFeatures(instance);

    if (features.mediaV2) {
      return dispatch(uploadMediaV2(data, onUploadProgress));
    } else {
      return dispatch(uploadMediaV1(data, onUploadProgress));
    }
  };
}
