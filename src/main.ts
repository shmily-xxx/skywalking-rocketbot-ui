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

import Vue from 'vue';
import moment from 'dayjs';
import clickout from '@/utils/clickout';
import tooltip from '@/utils/tooltip';
import eventBus from './event-bus';
import App from './App.vue';
import routes from './router';
import store from './store';
import i18n from './i18n';
import components from './components';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/graph';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/heatmap';
import 'echarts/lib/chart/sankey';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import VModal from 'vue-js-modal';
import { queryOAPTimeInfo } from './utils/localtime';
import './assets';
import 'element-ui/lib/theme-chalk/index.css';
import './utils/elementUi';
Vue.use(eventBus);
Vue.use(components);
Vue.use(VModal, { dialog: true });
Vue.directive('clickout', clickout);
Vue.directive('tooltip', tooltip);

Vue.filter('dateformat', (dataStr: any, pattern: string = 'YYYY-MM-DD HH:mm:ss') => moment(dataStr).format(pattern));

if (!window.Promise) {
  window.Promise = Promise;
}
Vue.config.productionTip = false;
declare const window: Window & { __POWERED_BY_QIANKUN__: any };
let router: any = null;
let instance: any = null;
function render(props: any) {
  const { container } = props;
  router = routes;
  queryOAPTimeInfo().then(() => {
    instance = new Vue({
      i18n,
      router,
      store,
      render: (h) => h(App),
    }).$mount(container ? container.querySelector('#app') : '#app');
  });
}
// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}
export async function mount(props: any) {
  console.log('[vue] props from main framework', props);
  render(props);
}
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}
