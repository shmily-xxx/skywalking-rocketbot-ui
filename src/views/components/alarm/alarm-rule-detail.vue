<template>
  <div class="detail-box">
    <el-form ref="ruleForm" :model="detailData" label-width="100px" size="small" :rules="rules" label-position="left">
      <el-form-item
        :label="$t('ruleName') + ':'"
        prop="alias"
        :rules="[
          { pattern: /^[\u4e00-\u9fa5\w\-]+$/, trigger: 'blur', message: this.$t('inputRuleNameMsg') },
          { required: true, trigger: 'blur', message: this.$t('inputRuleName') },
        ]"
      >
        <el-input
          :placeholder="$t('inputRuleName')"
          class="input-width"
          v-model="detailData.alias"
          maxlength="30"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('resourceType') + ':'" class="required-no" label-width="90px">
        <el-input class="input-width" disabled v-model="resourceType"></el-input>
      </el-form-item>
      <el-form-item :label="$t('resourceRange') + ':'" required>
        <el-select
          class="input-width"
          v-model="detailData.resourceIdSet"
          multiple
          collapse-tags
          filterable
          :placeholder="$t('allServer')"
        >
          <el-option
            v-for="(item, index) in sevrverList"
            :key="index"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('alarmRule') + ':'" required>
        <el-select v-model="detailData.metric" class="rule-item1" @change="metricChange" value-key="name">
          <el-option
            v-for="(item, index) in metricNameOption"
            :key="index"
            :label="$t(item.name)"
            :value="item"
          ></el-option>
        </el-select>
        <el-select v-model="detailData.period" class="ml10 rule-item2">
          <el-option
            v-for="(item, index) in periodOption"
            :key="index"
            :label="item + $t('minute')"
            :value="item"
          ></el-option>
        </el-select>
        <span class="ml10 have">{{ $t('have') }}</span>
        <el-select v-model="detailData.count" class="ml10 rule-item3">
          <el-option v-for="(item, index) in countOption" :key="index" :label="item" :value="item"></el-option>
        </el-select>
        <span class="ml10 frequency">{{ $t('frequency') }}</span>
        <el-select v-model="detailData.op" class="op ml10">
          <el-option v-for="(item, index) in opOption" :key="index" :label="item" :value="item"></el-option>
        </el-select>
        <el-input-number
          :controls="false"
          class="num ml10"
          :min="0"
          :max="1000000000000000000"
          :precision="2"
          v-model="detailData.thresholdInit"
          maxlength="30"
        ></el-input-number>
        <span class="unit">{{ detailData.unit }}</span>
      </el-form-item>
      <el-form-item :label="$t('alarmSilence') + ':'" required>
        <el-select v-model="detailData.silencePeriod" class="period">
          <el-option
            v-for="(item, index) in periodOption"
            :key="index"
            :label="item + $t('minute')"
            :value="item"
          ></el-option>
        </el-select>
        <span class="ml10">{{ $t('ruleAlarmSilenceMsg') }}</span>
      </el-form-item>
      <el-form-item :label="$t('notificationMethod') + ':'" class="required-no" label-width="90px">
        <el-checkbox-group v-model="detailData.noticeWays">
          <el-checkbox label="EMAIL">{{ $t('mail') }}</el-checkbox>
          <el-checkbox label="MESSAGE">{{ $t('shortMessage') }}</el-checkbox>
          <el-checkbox label="LETTER">{{ $t('stationMail') }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        :label="$t('notificationObject') + ':'"
        :label-width="noticeWaysFlag ? '100px' : '90px'"
        :class="{ 'required-no': !noticeWaysFlag }"
        :required="noticeWaysFlag"
      >
        <div class="notice-box">
          <div>
            <div class="search-box">
              <el-input v-model="inpValue" @change="() => inputChange(false)" clearable :placeholder="$t(noticeSearch)">
                <el-select
                  v-model="detailData.selectVal"
                  slot="prepend"
                  @change="() => changeSelect(true)"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in inpTypeOption"
                    :key="item.value"
                    :label="$t(item.label)"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="changeSelect(false)"></el-button>
              </el-input>
            </div>
            <el-table
              ref="user"
              :data="tableData"
              height="240"
              tooltip-effect="light"
              @selection-change="change"
              @select-all="selectAll"
            >
              <el-table-column type="selection" width="45"></el-table-column>
              <el-table-column prop="name" :label="$t(tableName)" show-overflow-tooltip></el-table-column>
              <el-table-column
                prop="mobile"
                v-if="detailData.selectVal"
                :label="$t('mobilePhone')"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="email"
                v-if="detailData.selectVal"
                :label="$t('mail')"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="userStr"
                v-if="!detailData.selectVal"
                :label="$t('includeUsers')"
                show-overflow-tooltip
              ></el-table-column>
              <div v-show="rocketAlarm.totalUser !== -1 && tableData.length === 0" slot="empty">{{ $t('noData') }}</div>
            </el-table>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-button @click="$parent.$parent.showDetail = false" size="mini">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="confirmForm" size="mini">{{ $t('confirm') }}</el-button>
    </div>
  </div>
</template>
<script lang="ts">
  import { State, Getter, Mutation, Action } from 'vuex-class';
  import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
  import { inpTypeOption, metricNameOption } from './constant';
  @Component
  export default class AlarmRuleTableDetail extends Vue {
    @Getter('durationTime') public durationTime: any;
    @State('rocketAlarm') private rocketAlarm!: any;
    @Prop() private detailData!: any;
    @Prop() private typeFlag!: boolean;
    @Mutation('rocketAlarm/CLEAR_NOTIC_TABLE_LIST') private CLEAR_NOTIC_TABLE_LIST: any;
    @Action('rocketAlarm/GET_USER_LIST') private GET_USER_LIST: any;
    @Action('rocketAlarm/GET_USER_GROUP_LIST') private GET_USER_GROUP_LIST: any;
    @Action('rocketAlarm/GET_SERVICES') private GET_SERVICES: any;
    @Action('rocketAlarm/ADD_APM_RULE') private ADD_APM_RULE: any;
    @Action('rocketAlarm/EDIT_APM_RULE') private EDIT_APM_RULE: any;
    private rules: any = {};
    private noticeSearch: string = 'inputUserGroupName';
    private sevrverList: any = [];
    private metricNameOption: any = metricNameOption;
    private periodOption: number[] = [1, 2, 5, 10, 30];
    private countOption: number[] = [1, 2, 3, 5, 10];
    private opOption: string[] = ['>', '>=', '<', '<=', '='];
    private inpTypeOption: any = inpTypeOption;
    private tableName: string = this.detailData.selectVal ? 'fullName' : 'userGroup';
    private inpValue: string = '';
    private selectArr: any = [];
    @Watch('detailData.selectVal')
    private selectValChange(newVal: number) {
      if (newVal) {
        this.noticeSearch = 'inputUserOrFullName';
        this.tableName = 'fullName';
      } else {
        this.noticeSearch = 'inputUserGroupName';
        this.tableName = 'userGroup';
      }
    }
    get noticeWaysFlag() {
      return !!this.detailData.noticeWays.length;
    }
    get resourceType() {
      return this.$t('service');
    }
    get tableData() {
      return this.detailData.selectVal ? this.rocketAlarm.userList : this.rocketAlarm.userGroupList;
    }
    private metricChange(row: any) {
      if (row.value === 'service_resp_time') {
        this.detailData.unit = 'ms';
      } else {
        this.detailData.unit = '%';
      }
    }
    private change(val: any) {
      this.selectArr = val;
    }
    // 更改搜索内容
    private inputChange(flag: boolean) {
      this.changeSelect(flag);
    }
    // 更改用户或用户组
    private changeSelect(flag: boolean) {
      if (flag) {
        this.inpValue = '';
      }
      this.CLEAR_NOTIC_TABLE_LIST();
      const params: any = {
        tenantId: '80766653910319104',
        name: this.inpValue,
        size: 10000,
        page: 1,
      };
      if (this.detailData.selectVal) {
        this.GET_USER_LIST(params).then((res: any) => {
          if (!this.detailData.userIdSet.length || !res.total) {
            return;
          }
          res.rows.forEach((item: any) => {
            this.detailData.userIdSet.forEach((ite: string) => {
              if (item.id === ite) {
                (this.$refs.user as any).toggleRowSelection(item, true);
              }
            });
          });
        });
      } else {
        this.GET_USER_GROUP_LIST(params).then((res: any) => {
          if (!this.detailData.userGroupIdSet.length || !res.total) {
            return;
          }
          res.rows.forEach((item: any) => {
            this.detailData.userGroupIdSet.forEach((ite: string) => {
              if (item.id === ite) {
                (this.$refs.user as any).toggleRowSelection(item, true);
              }
            });
          });
        });
      }
    }
    // 全选
    private selectAll(val: any) {
      if (val.length === 0) {
        (this.$refs.user as any).clearSelection();
        return false;
      }
    }
    private filterHandler(value: any, row: any, column: any) {
      console.log(value, row, column);
    }
    // 确认
    private confirmForm() {
      (this.$refs.ruleForm as any).validate((valid: boolean) => {
        if (valid) {
          if (this.detailData.noticeWays.length && !this.selectArr.length) {
            this.$message(this.$t('notificationObjectMsg') as any);
            return;
          }
          const selectArr = this.selectArr.map((item: any) => {
            return item.id;
          });
          let params: any = {
            alias: this.detailData.alias,
            resourceTypeCode: this.detailData.resourceTypeCode,
            resourceIdSet: this.detailData.resourceIdSet,
            metricsName: this.detailData.metric.value,
            metricsAlias: this.detailData.metric.alias,
            period: this.detailData.period,
            count: this.detailData.count,
            op: this.detailData.op,
            unit: this.detailData.unit,
            silencePeriod: this.detailData.silencePeriod,
            noticeWays: this.detailData.noticeWays,
            userGroupIdSet: this.detailData.selectVal ? [] : selectArr,
            userIdSet: this.detailData.selectVal ? selectArr : [],
          };
          const arr = ['-', '-', '-', '-', '-'];
          const arr1 = ['50', '75', '90', '95', '99'];
          let ind: any;
          arr1.forEach((item, index) => {
            if (this.detailData.metric.name.includes(item)) {
              ind = index;
            }
          });
          if (!isNaN(ind)) {
            arr[ind] = this.detailData.thresholdInit;
            params.threshold = arr.join();
          } else {
            params.threshold = this.detailData.thresholdInit;
          }
          if (this.typeFlag) {
            this.ADD_APM_RULE(params).then(() => {
              (this.$parent.$parent as any).showDetail = false;
              this.$eventBus.$emit('CONFIRM_FORM');
            });
          } else {
            params = {
              ...params,
              ...{
                id: this.detailData.id,
                tenantId: this.detailData.tenantId,
                createUserId: this.detailData.createUserId,
                createTime: this.detailData.createTime,
              },
            };
            this.EDIT_APM_RULE(params).then(() => {
              (this.$parent.$parent as any).showDetail = false;
              this.$eventBus.$emit('CONFIRM_FORM');
            });
          }
        }
      });
    }
    private mounted() {
      this.GET_SERVICES({ duration: this.durationTime }).then(
        (res: Array<{ key: string; label: string; group: string }>) => {
          this.sevrverList = res;
        },
      );
    }
  }
</script>
<style scoped lang="scss">
  .detail-box {
    .required-no {
      padding-left: 10px;
    }
    .input-width {
      width: 582px;
    }
    .rule-item1 {
      width: 152px;
    }
    .rule-item2 {
      width: 90px;
    }
    .have {
      display: inline-block;
      width: 28px;
      text-align: center;
    }
    .rule-item3 {
      width: 62px;
    }
    .frequency {
      display: inline-block;
      width: 36px;
      text-align: center;
    }
    .op {
      width: 66px;
    }
    .num {
      width: 58px;
    }
    .unit {
      vertical-align: bottom;
      display: inline-block;
      width: 30px;
      height: 28px;
      box-sizing: border-box;
      background: #eee;
      border: 1px solid #dcdfe6;
      border-left: none;
      text-align: center;
    }
    .period {
      width: 152px;
    }
    .notice-box {
      width: 400px;
      border: 1px solid #dcdde0;
      border-bottom: none;
      .search-box {
        width: 340px;
        margin: 20px auto;
        >>> .el-select .el-input {
          width: 112px;
        }
      }
    }
    .btn-box {
      text-align: center;
    }
  }
</style>
