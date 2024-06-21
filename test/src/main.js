import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 延迟加载插件
function lazyLoadPlugins() {
  Promise.all([
    import('../../packages/core/dist/index.esm.js'),
    import('../../packages/recordscreen/dist/index.esm.js')
  ])
  .then(([webSee, recordscreen]) => {
    console.log('🚀 ~ recordscreen:', recordscreen);

    // 注册 webSee 插件
    Vue.use(webSee.default, {
      dsn: 'http://localhost:8083/reportData',
      apikey: 'ortho'
    });

    // 注册 recordscreen 插件到 webSee
    webSee.default.use(recordscreen.default, { recordScreentime: 3 });
  })
  .catch(error => {
    console.error('Failed to load plugins:', error);
  });
}

// 延迟执行插件加载
lazyLoadPlugins()




// import webSee from '@websee/core';
// import performance from '@websee/performance';
// import recordscreen from '@websee/recordscreen';
// 这里用的是8080,开发环境是在devServer中配置的代理，在生产环境中是在nginx配置


Vue.use(ElementUI, { size: 'mini' });
Vue.config.productionTip = false;

setTimeout(() => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
}, 2000);
