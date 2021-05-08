/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Commit, ActionTree, MutationTree } from 'vuex';
import * as types from '@/store/mutation-types';
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import { Alarm, AlarmParams } from '@/types/alarm';
import request from '@/utils/request';

function queryAlarmsRuls(params: any) {
  return request({
    url: `${process.env.VUE_APP_MODULE_MONITOR}/api/v1/strategies/`,
    method: 'get',
    params,
  });
}
// 告警模板---查询用户列表
export function userinfogroup(params: any) {
  return request({
    url: `${process.env.VUE_APP_MODULE_MONITOR}/api/v1/users`,
    method: 'get',
    params,
  });
}
// 告警模板---监控告警-根据用户组查看对象
export function notification(params: any) {
  return request({
    url: `${process.env.VUE_APP_MODULE_MONITOR}/api/v1/users/groups`,
    method: 'get',
    params,
  });
}
// 告警规则新建
export function addApmRules(data: any) {
  return request({
    url: `${process.env.VUE_APP_MODULE_MONITOR}/api/v1/apm-rules`,
    method: 'POST',
    data,
  });
}
// 告警规则修改
export function editApmRules(data: any) {
  return request({
    url: `${process.env.VUE_APP_MODULE_MONITOR}/api/v1/apm-rules`,
    method: 'PUT',
    data,
  });
}
// 告警规则列表删除
export function deleteApmRules(id: any) {
  return request({
    url: `${process.env.VUE_APP_MODULE_MONITOR}/api/v1/apm-rules/${id}`,
    method: 'PATCH',
  });
}
// 告警规则列表查询
export function apmRulesList(params: any) {
  return request({
    url: `${process.env.VUE_APP_MODULE_MONITOR}/api/v1/apm-rules`,
    method: 'GET',
    params,
  });
}
export interface State {
  alarmService: Alarm[];
  alarmRule: Alarm[];
  total: number;
  totalRule: number;
  alarmPageType: number;
  userList: any[];
  userGroupList: any[];
  totalUser: number;
}
const initState: State = {
  alarmRule: [],
  alarmService: [],
  total: 0,
  totalRule: -1,
  totalUser: -1,
  alarmPageType: 0,
  userList: [],
  userGroupList: [],
};

// getters
const getters = {};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_ALARM](state: State, data: { items: Alarm[]; total: number }): void {
    state.alarmService = data.items;
    state.total = data.total;
  },
  [types.CLEAR_ALARM](state: State): void {
    state.alarmService = [];
    state.total = 0;
  },
  [types.SET_ALARM_RULE](state: State, data: { rows: Alarm[]; total: number }): void {
    state.alarmRule = data.rows;
    state.totalRule = data.total;
  },
  [types.CLEAR_ALARM_RULE](state: State): void {
    state.alarmRule = [];
    state.totalRule = -1;
  },
  [types.SET_ALARM_PAGE_TYPE](state: State, data): void {
    state.alarmPageType = data;
  },
  [types.SET_USER_LIST](state: State, data: { rows: any[]; total: number }): void {
    state.userList = data.rows;
    state.totalUser = data.total;
  },
  [types.SET_USER_GROUP_LIST](state: State, data: { rows: any[]; total: number }): void {
    state.userGroupList = data.rows;
    state.totalUser = data.total;
  },
  [types.CLEAR_NOTIC_TABLE_LIST](state: State): void {
    state.userList = [];
    state.userGroupList = [];
    state.totalUser = -1;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_ALARM(context: { commit: Commit; state: State }, params: AlarmParams): Promise<void> {
    return graph
      .query('queryAlarms')
      .params(params)
      .then((res: AxiosResponse<any>) => {
        if (res.data.data.getAlarm.items) {
          context.commit(types.SET_ALARM, res.data.data.getAlarm);
        }
      });
  },
  CLEAR_ALARM(context: { commit: Commit; state: State }): void {
    context.commit(types.CLEAR_ALARM);
  },
  GET_ALARM_RULE(context: { commit: Commit; state: State }, params: any): Promise<void> {
    return apmRulesList(params).then((res) => {
      context.commit(types.SET_ALARM_RULE, res);
    });
  },
  CLEAR_ALARM_RULE(context: { commit: Commit; state: State }): void {
    context.commit(types.CLEAR_ALARM_RULE);
  },
  ADD_APM_RULE(context: { commit: Commit; state: State }, params: any) {
    return addApmRules(params).then(() => {
      return;
    });
  },
  EDIT_APM_RULE(context: { commit: Commit }, params: any) {
    return editApmRules(params).then();
  },
  DELETE_ALARM_RULE(context: { commit: Commit }, params: any) {
    return deleteApmRules(params).then();
  },
  GET_USER_LIST(context: { commit: Commit }, params: any) {
    return userinfogroup(params).then((res) => {
      context.commit(types.SET_USER_LIST, res);
      return res;
    });
  },
  GET_USER_GROUP_LIST(context: { commit: Commit; state: State }, params: any) {
    return notification(params).then((res) => {
      context.commit(types.SET_USER_GROUP_LIST, res);
      return res;
    });
  },
  GET_SERVICES(context: { commit: Commit }, params: { keyword: string }) {
    if (!params.keyword) {
      params.keyword = '';
    }
    return graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
        return res.data.data.services || [];
      });
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
