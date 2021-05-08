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
interface Metric {
  name: string;
  value: string;
  alias: string;
}
interface Rules {
  alias: string;
  resourceIdSet: string[];
  resourceTypeCode: string;
  metric: Metric;
  period: number;
  count: number;
  op: string;
  thresholdInit: string;
  silencePeriod: number;
  selectVal: number;
  noticeWays: string[];
  userIdSet: string[];
  userGroupIdSet: string[];
  unit: string;
}
export const ruleDetail: Rules = {
  count: 2,
  metric: { name: 'serviceSla', value: 'service_sla', alias: '服务可用率' },
  alias: '',
  resourceTypeCode: 'service',
  noticeWays: [],
  thresholdInit: '',
  op: '<',
  period: 10,
  selectVal: 0,
  resourceIdSet: [],
  silencePeriod: 10,
  userIdSet: [],
  userGroupIdSet: [],
  unit: '%',
};
export const inpTypeOption = [
  {
    value: 0,
    label: 'userGroup',
  },
  {
    value: 1,
    label: 'user',
  },
];
export const metricNameOption = [
  { name: 'serviceSla', value: 'service_sla', alias: '服务可用率' },
  { name: 'serviceRespTime', value: 'service_resp_time', alias: '服务响应时间(平均)' },
  { name: 'servicePercentilep50', value: 'service_percentile', alias: '服务响应时间(p50)' },
  { name: 'servicePercentilep75', value: 'service_percentile', alias: '服务响应时间(p75)' },
  { name: 'servicePercentilep90', value: 'service_percentile', alias: '服务响应时间(p90)' },
  { name: 'servicePercentilep95', value: 'service_percentile', alias: '服务响应时间(p95)' },
  { name: 'servicePercentilep99', value: 'service_percentile', alias: '服务响应时间(p99)' },
];
