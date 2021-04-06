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
    啊水电费快来睡觉的福利开机啊收到了付款就离开手机的福利款设计的分类
    <div @click="dialogConfigVisible = true">创建</div>
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="name" label="规则名称" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="middleCategoryCode" label="资源范围" width="180"></el-table-column>
      <el-table-column prop="metrics" label="告警规则"></el-table-column>
      <el-table-column width="100" prop="address" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title :visible.sync="dialogVisible" width="30%">
      <span>是否删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State, Getter, Mutation } from 'vuex-class';
  import { TraceDetailChartTable } from '../common';

  @Component({
    components: { TraceDetailChartTable },
  })
  export default class AlarmRuleTable extends Vue {
    @Prop({ default: () => [] }) private data: any;
    private dialogVisible: boolean = false;
    private detail: any;
    private dialogConfigVisible = false;
    private chartRender() {
      // console.log(22);
    }
    private selectSpan() {
      // console.log(222);
    }
    private handleClick(row: any) {
      this.detail = row;
      this.dialogVisible = true;
      console.log(row);
    }
    private confirm(row: any) {
      console.log(row);
      this.dialogVisible = false;
    }
    private mounted() {
      // console.log(this.data);
    }
  }
</script>

<style lang="scss" scoped>
  .rk-alarm-table {
    padding: 30px 20px 20px 40px;
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
