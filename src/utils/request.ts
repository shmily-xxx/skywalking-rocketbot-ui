import axios from 'axios';
import store from '@/store';
import Vue from 'vue';

const whiteMenu = ['collection/status', 'resources/manager', 'cmdb/manage/resource/list']; // 'resource/list',
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 25000,
});

// request interceptor
const record: any[] = [];
let isAlertReloadBox = true;
request.interceptors.request.use(
  (config) => {
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
    console.log(error); // for debug
    return Promise.reject(error);
  },
);

// response interceptor
request.interceptors.response.use(
  (response) => {
    record.pop();
    if (Math.floor(response.status / 100) === 2) {
      // 正常处理
      return response.data;
    } else {
      console.log(222);
    }
  },
  (error) => {
    const { response } = error;
    record.pop();
    if (response) {
      if (error.message.includes('timeout')) {
        // 判断请求异常信息中是否含有超时timeout字符串
        console.log(222);
        return Promise.reject(error);
      }
      switch (response.status) {
        case 401:
        case 302:
          if (sessionStorage.getItem('isFirst') === 'true' && isAlertReloadBox) {
            isAlertReloadBox = false;
            console.log(222);
          } /* else {
              store.dispatch('user/logout');
            } */
          break;
        case 403:
          console.log(222);
          break;
        case 404:
          console.log(222);
          break;
        case 509:
          console.log(222);
          break;
        default:
          console.log(222);
          break;
      }

      return Promise.reject(error);
    } else {
      console.log(222);
      return Promise.reject(error);
    }
  },
);

export default request;
