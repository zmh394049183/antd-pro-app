// @ts-ignore
/* eslint-disable */

declare namespace API {
  type LoginResult = {
    data: string;
    code: number;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };
  type CurrentUser = {
    _id?: string;
    username: string;
    name?: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
    role?: 0 | 1;
  };
  type DataList = {
    data?: CurrentUser[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type LoginParams = {
    username?: string;
    password?: string;
  };
}
