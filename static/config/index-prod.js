/**
 * 生产环境
 */
;(function() {
  window.SITE_CONFIG = {}

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://demo.open.renren.io/renren-fast-server';
  window.SITE_CONFIG['baseUrl'] = 'http://128.194.224.239:8080'

  // grafana url
  window.SITE_CONFIG['grafanaUrl'] = 'http://128.194.223.5:33000'

  // caas接口请求地址
  window.SITE_CONFIG['caasUrl'] = 'http://caas.dev.jh'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = '' // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] =
    window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
