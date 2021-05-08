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
  <div class="rk-alarm-rule clear">
    <el-table :data="tableData" tooltip-effect="light" border class="table-drag table">
      <el-table-column prop="alias" show-overflow-tooltip :label="$t('ruleName')">
        <template slot-scope="scope">
          <span class="color" @click="ruleDetail(scope.row)">{{ scope.row.alias }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="resourceIdSet" :label="$t('resourceRange')">
        <template slot-scope="scope">{{
          scope.row.resourceIdSet.length ? scope.row.resourceIdSet.join() : $t('allServer')
        }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="metrics" :label="$t('alarmRule')">
        <template slot-scope="scope">{{ scope.row | metricsInit }}</template>
      </el-table-column>
      <el-table-column width="150" prop="address" :label="$t('operate')">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
      <div v-show="total !== -1 && tableData.length === 0" slot="empty">{{ $t('noData') }}</div>
    </el-table>
    <el-dialog
      :title="$t('tip')"
      :visible.sync="dialogVisible"
      width="300px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span>{{ $t('deleteMsg') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button size="mini" type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-row v-if="total && total > 0" type="flex" justify="end" class="mt14">
      <el-pagination
        background
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="size"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        class="cus-page"
        @size-change="sizeChange"
        @current-change="currentChange"
      ></el-pagination>
    </el-row>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State, Getter, Mutation, Action } from 'vuex-class';
  import { TraceDetailChartTable } from '../common';
  import { metricNameOption } from './constant';

  @Component({
    components: { TraceDetailChartTable },
    filters: {
      metricsInit(row: any) {
        let thresholdInit;
        metricNameOption.forEach((item: any, index: number) => {
          if (item.value === row.metricsName && item.alias === row.metricsAlias) {
            if (index >= 2) {
              thresholdInit = row.threshold.split(',')[index - 2];
            }
          }
        });
        return (
          row.metricsAlias +
          row.period +
          '分钟内有' +
          row.count +
          '次' +
          row.op +
          (thresholdInit || row.threshold) +
          row.unit
        );
      },
    },
  })
  export default class AlarmRuleTable extends Vue {
    @Prop({ default: () => [] }) private tableData: any;
    @Prop({ default: -1 }) private total: any;
    @Action('rocketAlarm/GET_ALARM_RULE') private GET_ALARM_RULE: any;
    @Action('rocketAlarm/DELETE_ALARM_RULE') private DELETE_ALARM_RULE: any;
    @Action('rocketAlarm/CLEAR_ALARM_RULE') private CLEAR_ALARM_RULE: any;

    private dialogVisible: boolean = false;
    private dialogConfigVisible = false;
    private page: number = 1;
    private size: number = 10;
    private pageSizes: number[] = [10, 20, 30, 50];
    private currentDetail: any;
    private handleClick(row: any) {
      this.currentDetail = row;
      this.dialogVisible = true;
    }
    private confirm() {
      this.DELETE_ALARM_RULE(this.currentDetail.id).then(() => {
        if (this.tableData.length === 1) {
          this.page -= 1;
        }
        this.getAlarmRule(this.page, this.size);
        this.dialogVisible = false;
      });
    }
    private ruleDetail(row: any) {
      this.$emit('ruleDetail', row);
    }
    private sizeChange(val: number) {
      this.size = val;
      this.getAlarmRule(1, val);
    }
    private currentChange(val: number) {
      this.page = val;
      this.getAlarmRule(val, this.size);
    }
    private getAlarmRule(page: number, size: number) {
      const params: any = {
        size,
        page,
      };
      this.GET_ALARM_RULE(params);
    }
    private mounted() {
      this.getAlarmRule(1, 10);
      this.$eventBus.$on('CONFIRM_FORM', this, () => {
        this.getAlarmRule(this.page, this.size);
      });
    }
    private destroyed() {
      this.CLEAR_ALARM_RULE();
    }
  }
</script>

<style lang="scss" scoped>
  .rk-alarm-rule {
    .table {
      width: 100%;
      min-height: 418px;
      .color {
        color: #3369ff;
        cursor: pointer;
      }
    }
  }
</style>
