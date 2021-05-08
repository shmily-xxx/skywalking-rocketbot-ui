<!-- Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. -->
<template>
  <div class="rk-alarm-table clear">
    <el-button @click="addAlarmRule" size="small" type="primary">{{ $t('addAlarmRule') }}</el-button>
    <AlarmRuleTable
      :tableData="rocketAlarm.alarmRule"
      :total="rocketAlarm.totalRule"
      @ruleDetail="ruleDetail"
    ></AlarmRuleTable>
    <rk-sidebox width="740px" :show.sync="showDetail" :title="$t(title)">
      <AlarmRuleDetail
        v-if="showDetail"
        ref="alarmRuleDetail"
        :typeFlag="typeFlag"
        :detailData="detailData"
      ></AlarmRuleDetail>
    </rk-sidebox>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { State, Getter, Mutation } from 'vuex-class';
  import AlarmRuleTable from './alarm-rule-table.vue';
  import AlarmRuleDetail from './alarm-rule-detail.vue';
  import { ruleDetail, metricNameOption } from './constant';
  import _ from 'lodash';
  @Component({
    components: { AlarmRuleTable, AlarmRuleDetail },
  })
  export default class AlarmRule extends Vue {
    @State('rocketAlarm') private rocketAlarm!: any;
    private detailData = _.cloneDeep(ruleDetail);
    private showDetail: boolean = false;
    private typeFlag: boolean = true;
    private title: string = 'addAlarmRule';
    private addAlarmRule() {
      this.showDetail = true;
      this.detailData = _.cloneDeep(ruleDetail);
      this.title = 'addAlarmRule';
      this.typeFlag = true;
      this.showDetail = true;
      this.$nextTick(() => {
        (this.$refs.alarmRuleDetail as any).changeSelect();
      });
    }
    private confirm(row: any) {
      this.showDetail = false;
    }
    private ruleDetail(row: any) {
      const obj = _.cloneDeep(row);
      // 返回值转化为表单所需值
      obj.thresholdInit = obj.threshold;
      metricNameOption.forEach((item, index) => {
        if (item.value === obj.metricsName && item.alias === obj.metricsAlias) {
          obj.metric = item;
          if (index >= 2) {
            obj.thresholdInit = obj.threshold.split(',')[index - 2];
          }
        }
      });
      if (obj.userIdSet.length) {
        obj.selectVal = 1;
      } else {
        obj.selectVal = 0;
      }
      this.detailData = obj;
      this.title = 'editAlarmRule';
      this.showDetail = true;
      this.typeFlag = false;
      this.$nextTick(() => {
        (this.$refs.alarmRuleDetail as any).changeSelect();
      });
    }
  }
</script>

<style lang="scss" scoped>
  .rk-alarm-table {
    padding: 20px;
    flex-grow: 1;
    overflow: auto;
    height: 100%;
  }
  .rk-alarm-time-line {
    padding: 14px 30px;
    min-height: 63px;
    max-width: 132px;
  }
  .rk-alarm-table-i {
    padding: 10px 15px;
    border-left: 4px solid rgba(46, 47, 51, 0.05);
    position: relative;
    &:after {
      content: '';
      display: inline-block;
      position: absolute;
      width: 7px;
      height: 7px;
      left: -23px;
      top: 25px;
      border-radius: 4px;
      background-color: #448dfe;
    }
    &:before {
      content: '';
      display: inline-block;
      position: absolute;
      width: 1px;
      height: calc(100% + 11px);
      top: 0;
      left: -20px;
      border-radius: 5px;
      background-color: #448dfe99;
    }
  }
  .rk-alarm-table-i-scope {
    display: inline-block;
    padding: 0px 8px;
    border: 1px solid;
    margin-top: -1px;
    border-radius: 4px;
  }
</style>
