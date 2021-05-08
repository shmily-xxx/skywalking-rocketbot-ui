import axios from 'axios';
import { Message, Loading } from 'element-ui';
import i18n from '@/i18n';
import Vue from 'vue';

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 25000,
});

// request interceptor
const record: any = [];
let loadingInstance: any;
request.interceptors.request.use(
  (config) => {
    const showLoading = true;
    if (showLoading) {
      record.push(config.url);
      loadingInstance = Loading.service({
        fullscreen: true,
        background: 'rgba(0, 0, 0, 0)',
      });
    }
    config.headers['Content-Type'] = 'application/json';
    config.headers['X-XSS-Protection'] = '1';
    config.headers['X-Content-Type-Options'] = 'nosniff';
    config.headers['Content-Security-Policy'] = 'default-src';
    if (config.method === 'get') {
      config.params = {
        t: +new Date(),
        ...config.params,
      };
    }
    return config;
  },
  (error) => {
    // console.log(error); // for debug
    return Promise.reject(error);
  },
);

// response interceptor
request.interceptors.response.use(
  (response) => {
    record.pop();
    if (record.length < 1 && loadingInstance) {
      Vue.nextTick(() => {
        loadingInstance.close();
      });
    }
    if (Math.floor(response.status / 100) === 2) {
      // 正常处理
      return response.data;
    } else {
      Message({
        message: 'Error',
        type: 'error',
        duration: 3 * 1000,
      });
    }
  },
  (error) => {
    const { response } = error;
    record.pop();
    if (record.length < 1 && loadingInstance) {
      Vue.nextTick(() => {
        loadingInstance.close();
      });
    }
    if (response) {
      if (error.message.includes('timeout')) {
        // 判断请求异常信息中是否含有超时timeout字符串
        Message({
          message: i18n.tc('resErrorMsg'),
          type: 'error',
          duration: 3 * 1000,
        });
        return Promise.reject(error);
      }
      switch (response.status) {
        case 401:
        case 302:
          Message({
            message: error.response.data.message || i18n.tc('forbiddenErrorMsg'),
            type: 'warning',
            duration: 3 * 1000,
          });
          break;
        case 403:
          Message({
            message: error.response.data.message || i18n.tc('forbiddenErrorMsg'),
            type: 'warning',
            duration: 3 * 1000,
          });
          break;
        case 404:
          Message({
            message: error.response.data.message || i18n.tc('res404ErrorMsg'),
            type: 'warning',
            duration: 3 * 1000,
          });
          break;
        case 509:
          Message({
            message: error.response.data.message || i18n.tc('resErrorMsg'),
            type: 'warning',
            duration: 3 * 1000,
          });
          break;
        default:
          Message({
            message: error.response.data.message || i18n.tc('resErrorMsg'),
            type: 'error',
            duration: 3 * 1000,
          });
          break;
      }

      return Promise.reject(error);
    } else {
      Message({
        message: i18n.tc('resErrorMsg'),
        type: 'error',
        duration: 3 * 1000,
      });
      return Promise.reject(error);
    }
  },
);

export default request;
