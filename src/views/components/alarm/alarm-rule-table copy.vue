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
    <el-button @click="addAlarmRule">{{ $t('addAlarmRule') }}</el-button>
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
        <el-button @click="dialogVisible = false" size="small">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="confirm" size="small">{{ $t('confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新建告警规则" :visible.sync="dialogRuleVisible" width="60%">
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="活动名称">
          <el-input v-model="form.name" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="资源类型">
          <span>服务</span>
        </el-form-item>
        <el-form-item label="资源范围">
          <el-select v-model="form.server" placeholder="全部服务">
            <el-option label="区域一" value="1"></el-option>
            <el-option label="区域二" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警规则">
          <el-select v-model="form.serverName">
            <el-option v-for="(item, index) in sevrverNameOption" :key="index" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="form.period">
            <el-option
              v-for="(item, index) in periodOption"
              :key="index"
              :label="item + '分钟'"
              :value="item"
            ></el-option>
          </el-select>
          <el-select v-model="form.count">
            <el-option v-for="(item, index) in countOption" :key="index" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="form.op">
            <el-option v-for="(item, index) in opOption" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRuleVisible = false" size="small">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="confirmForm" size="small">{{ $t('confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="js">
    export default {
      props:['data'],
      data(){
        return {
          detail:'',
          dialogVisible:false,
          dialogRuleVisible:false,
          form:{
            name:'规则名称',
            server:'',
            serverName:'服务可用率',
            period:'10',
            count:'2',
            op:'<'
          },
          sevrverNameOption:['服务可用率','服务响应时间(平均)','服务响应时间(p50)','服务响应时间(p75)','服务响应时间(p90)','服务响应时间(p95)','服务响应时间(p59)'],
          periodOption:['1','2','5','10','30'],
          countOption:['1','2','5','10'],
          opOption:['>', '>=', '<', '<=', '=']
        }
      },
      methods:{
        confirm() {
          console.log(this.detail);
          this.dialogVisible = false;
        },
        handleClick(row) {
          this.detail=row
          this.dialogVisible = true;
          console.log(row);
        },
        addAlarmRule(){
          this.dialogRuleVisible=true
        },
        confirmForm(){
          console.log(this.form)
        }
      }
  }
</script>

<style lang="scss" scoped>
  .rk-alarm-table {
    padding: 30px 20px 20px 40px;
    flex-grow: 1;
    overflow: auto;
    height: 100%;
    .dialog-footer {
      text-align: center;
    }
  }
</style>
