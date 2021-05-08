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
  <div class="rk-alarm-box">
    <div class="rk-alarm-btn-box">
      <a class="rk-alarm-btn mr-10" :class="{ active: !rocketAlarm.alarmPageType }" @click="alarmHistoryPage(1)">
        <span>{{ $t('alarmHistory') }}</span>
      </a>
      <a class="rk-alarm-btn mr-10" :class="{ active: rocketAlarm.alarmPageType }" @click="alarmStrategyPage(1)">
        <span>{{ $t('alarmStrategy') }}</span>
      </a>
    </div>
    <template v-if="!rocketAlarm.alarmPageType">
      <nav class="rk-alarm-tool flex-h">
        <AlarmSelect
          :title="$t('filterScope')"
          :value="alarmOption"
          @input="
            (option) => {
              alarmOption = option;
              handleRefresh(1);
            }
          "
          :data="alarmOptions"
        />
        <div class="mr-10" style="padding: 3px 15px 0">
          <div class="sm grey">{{ $t('searchKeyword') }}</div>
          <input type="text" v-model="keyword" class="rk-alarm-tool-input" @input="handleRefresh(1)" />
        </div>
        <RkPage
          class="mt-15"
          :currentSize="20"
          :currentPage="pageNum"
          @changePage="(pageNum) => handleRefresh(pageNum)"
          :total="total"
        />
      </nav>
    </template>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Action, Mutation, Getter } from 'vuex-class';
  import AlarmSelect from './alarm-select.vue';
  import { State } from 'vuex-class';
  interface Option {
    key: string | number;
    label: string | number;
  }

  @Component({ components: { AlarmSelect } })
  export default class AlarmTool extends Vue {
    @Getter('durationTime') private durationTime: any;
    @Mutation('SET_EVENTS') private SET_EVENTS: any;
    @Action('rocketAlarm/GET_ALARM') private GET_ALARM: any;
    @Action('rocketAlarm/GET_ALARM_RULE') private GET_ALARM_RULE: any;
    @Mutation('rocketAlarm/SET_ALARM_PAGE_TYPE') private SET_ALARM_PAGE_TYPE: any;
    @State('rocketAlarm') private rocketAlarm!: any;
    @Prop() private total!: number;
    private pageNum: number = 1;
    private alarmOption: Option = { label: 'Service', key: 'Service' };
    private alarmOptions: Option[] = [
      // { label: 'All', key: '' },
      { label: 'Service', key: 'Service' },
      //   { label: 'ServiceInstance', key: 'ServiceInstance' },
      //   { label: 'Endpoint', key: 'Endpoint' },
      //   { label: 'ServiceRelation', key: 'ServiceRelation' },
      //   { label: 'ServiceInstanceRelation', key: 'ServiceInstanceRelation' },
      //   { label: 'EndpointRelation', key: 'EndpointRelation' },
    ];
    private keyword: string = '';

    private handleRefresh(pageNum: number) {
      this.pageNum = pageNum;
      const params: any = {
        duration: this.durationTime,
        paging: {
          pageNum,
          pageSize: 20,
          needTotal: true,
        },
      };
      if (this.alarmOption.key) {
        params.scope = this.alarmOption.key;
      }
      if (this.keyword) {
        params.keyword = this.keyword;
      }
      this.GET_ALARM(params);
    }

    private beforeMount() {
      this.SET_EVENTS([
        () => {
          this.handleRefresh(1);
        },
      ]);
      this.handleRefresh(1);
    }
    private beforeDestroy() {
      this.SET_EVENTS([]);
    }
    private alarmHistoryPage(pageNum: number) {
      if (this.rocketAlarm.alarmPageType === 0) {
        return;
      }
      this.SET_ALARM_PAGE_TYPE(0);
      this.pageNum = pageNum;
      const params: any = {
        duration: this.durationTime,
        paging: {
          pageNum,
          pageSize: 20,
          needTotal: true,
        },
      };
      if (this.alarmOption.key) {
        params.scope = this.alarmOption.key;
      }
      if (this.keyword) {
        params.keyword = this.keyword;
      }
      this.GET_ALARM(params);
    }
    private alarmStrategyPage(pageNum: number) {
      if (this.rocketAlarm.alarmPageType === 1) {
        return;
      }
      this.SET_ALARM_PAGE_TYPE(1);
    }
  }
</script>

<style lang="scss">
  .rk-alarm-box {
    background-color: #f3f4f9;
    .rk-alarm-btn-box {
      display: flex;
      align-items: center;
      padding: 10px 30px;
      .rk-alarm-btn {
        position: relative;
        padding: 3px 14px;
        color: #6d7383;
        background-color: #dbdeea;
        border-radius: 4px;
      }
      .active {
        color: #000;
        &::after {
          content: '';
          position: absolute;
          display: inline-block;
          width: 5px;
          height: 10px;
          border-radius: 4px;
          background-color: #448dfe;
          top: 9px;
          left: 4px;
        }
      }
    }

    .rk-alarm-tool {
      // border-bottom: 1px solid #c1c5ca41;
      height: 52px;
      background-color: #f3f4f9;
      padding: 0 15px;
      // color: #efefef;
      flex-shrink: 0;
    }

    .rk-alarm-tool-input {
      border-style: unset;
      outline: 0;
      padding: 2px 5px;
      border-radius: 3px;
    }
  }
</style>
