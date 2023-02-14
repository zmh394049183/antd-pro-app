// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /getUserInfo */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/getUserInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 POST /login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户列表 GET /getUserList */
export async function getUserList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.DataList>('/getUserList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改用户 PUT /updateUser */
export async function updateUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/updateUser', {
    method: 'post',
    ...(options || {}),
  });
}

/** 新建用户 POST /register */
export async function addUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/register', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除用户 POST /removeUser */
export async function removeUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/removeUser', {
    method: 'POST',
    ...(options || {}),
  });
}
