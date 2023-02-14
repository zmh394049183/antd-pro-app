import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      console.log('%c [ res ]-32', 'font-size:13px; background:pink; color:#bf2c9f;', res);
      const { success, errorMessage } = res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = '错误';
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any) => {
      console.log('%c [ error ]-43', 'font-size:13px; background:pink; color:#bf2c9f;', error);
      if (error?.message) return message.error(error.message);
      if (error?.info) return message.error(error.info);
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      let headers = config.headers;
      const token = localStorage.getItem('token');
      if (headers) {
        if (token) {
          headers['authorization'] = token;
        }
        headers['content-type'] = 'application/json';
      }
      return { ...config, headers };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      if (data?.code !== 200 && data.message) {
        const error: any = new Error(data.message);
        error.info = data.message;
        throw error;
      }
      return response;
    },
  ],
};
