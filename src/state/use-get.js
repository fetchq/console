/**
 * React hook interface to `axios.get`.
 * It follows the API's convention to always return 200
 * with a `success:boolean` flag and `data` or `errors`
 * keywords in the payload
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { buildUrl } from '../lib/url';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || '';

const INITIAL_STATE = {
  isLoading: false,
  isFirstLoading: true,
  data: null,
  errors: null,
  response: null,
};

export const useGet = (
  url,
  options = {
    lazy: false,
    poll: null, // interval in ms, must be above 0 to work
  },
) => {
  const [state, setState] = useState(INITIAL_STATE);
  const [isFirstCall, setIsFirstCall] = useState(true);
  const { lazy, poll, ...fetchOptions } = options;
  const endpointUrl = SERVER_URL + url;

  const fetch = async (url, options = {}) => {
    const {
      keepData,
      keepErrors,
      keepResponse,
      skipIsLoading,
      ...localFetchOptions
    } = options;

    setState((state) => ({
      ...state,
      ...(skipIsLoading ? {} : { isLoading: true }),
      ...(keepData ? {} : { data: null }),
      ...(keepErrors ? {} : { errors: null }),
      ...(keepResponse ? {} : { response: null }),
    }));

    try {
      const response = await axios.get(url, {
        ...localFetchOptions,
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
    } catch (error) {
      // Extract errors from the server response:
      const errors =
        error.response && error.response.data && error.response.data.errors
          ? error.response.data.errors
          : [error];

      setState((state) => ({
        ...state,
        isLoading: false,
        isFirstLoading: false,
        data: null,
        errors,
        response: error.response,
      }));
    }
  };

  // Handles automatic fetching on url change only if not
  // running in "lazy" mode.
  // In "lazy" mode it's up to the caller to actually run
  // the correct calls.
  useEffect(() => {
    if (!lazy) {
      if (isFirstCall) {
        setIsFirstCall(false);
        fetch(endpointUrl, fetchOptions);
      } else {
        fetch(SERVER_URL + url, fetchOptions);
      }
    }
  }, [url]); // eslint-disable-line

  // Polling
  useEffect(() => {
    let t = null;
    if (poll) {
      t = setInterval(
        () => fetch(endpointUrl, { ...fetchOptions, keepData: true }),
        poll,
      );
    }

    return () => {
      clearInterval(t);
    };
  }, []); // eslint-disable-line

  // useEffect(() => {
  //   console.log('@changed url', url);
  // }, [url]);

  return [
    state,
    {
      buildUrl: (query = {}, _url = endpointUrl) => buildUrl(_url, query),
      // Provide a lazy and fully customizable interface to Fetch
      fetch: (_options = fetchOptions, _url = endpointUrl) =>
        fetch(_url, _options),
    },
  ];
};
