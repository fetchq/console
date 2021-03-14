import { useState } from 'react';
import axios from 'axios';

export const SERVER_URL = process.env.REACT_APP_SERVER_URL || '';

const INITIAL_STATE = {
  isLoading: false,
  isFirstLoading: true,
  data: null,
  errors: null,
  response: null,
};

export const usePost = (url, options = {}) => {
  const [state, setState] = useState(INITIAL_STATE);
  const { ...fetchOptions } = options;

  const send = async (url, data, options) => {
    const endpointUrl = SERVER_URL + url;

    setState((state) => ({
      ...state,
      isLoading: true,
      errors: null,
      data: null,
      response: null,
    }));

    try {
      const response = await axios.post(endpointUrl, data, {
        ...fetchOptions,
        withCredentials: true,
      });
      setState((state) => ({
        ...state,
        isLoading: false,
        isFirstLoading: false,
        data: response.data.success ? response.data.data : null,
        errors: response.data.success ? null : response.data.errors,
        response,
      }));
      return response;
    } catch (error) {
      setState((state) => ({
        ...state,
        isLoading: false,
        isFirstLoading: false,
        data: null,
        errors: [error],
        response: error.response,
      }));
    }
  };

  return [
    state,
    {
      // Provide a lazy and fully customizable interface to Post
      send: (data, _options = fetchOptions, _url = url) =>
        send(_url, data, _options),
    },
  ];
};
