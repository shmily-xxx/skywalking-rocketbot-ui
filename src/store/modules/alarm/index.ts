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
    // baseURL: process.env.VUE_APP_BASE_API,
    // url: `${process.env.VUE_APP_MODULE_MONITOR}/api/v1/strategies/`,
    baseURL: '/gateway',
    url: `/monitor/api/v1/strategies/`,
    method: 'get',
    params,
  });
}
export interface State {
  alarmService: Alarm[];
  alarmRule: Alarm[];
  total: number;
  alarmPageType: number;
}
const initState: State = {
  alarmRule: [],
  alarmService: [],
  total: 0,
  alarmPageType: 0,
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
    state.total = data.total;
  },
  [types.CLEAR_ALARM_RULE](state: State): void {
    state.alarmRule = [];
    state.total = 0;
  },
  [types.SET_ALARM_PAGE_TYPE](state: State, data): void {
    state.alarmPageType = data;
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
    return queryAlarmsRuls(params).then((res) => {
      context.commit(types.SET_ALARM_RULE, res);
    });
  },
  CLEAR_ALARM_RULE(context: { commit: Commit; state: State }): void {
    context.commit(types.CLEAR_ALARM_RULE);
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
