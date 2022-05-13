/******/ var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports_authing__, __webpack_require_authing__) => {

    __webpack_require_authing__.r(__webpack_exports_authing__);
    /* harmony export */ __webpack_require_authing__.d(__webpack_exports_authing__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _instance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require_authing__(2);
    /* harmony import */ var _global_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require_authing__(3);



    (0,_global_api__WEBPACK_IMPORTED_MODULE_1__.initGlobalApi)(_instance__WEBPACK_IMPORTED_MODULE_0__["default"])

    _instance__WEBPACK_IMPORTED_MODULE_0__["default"].version = "0.0.1-alpha.0"

    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_instance__WEBPACK_IMPORTED_MODULE_0__["default"]);

    __webpack_require_authing__.g.AuthingMove = _instance__WEBPACK_IMPORTED_MODULE_0__["default"]


    /***/ }),
    /* 2 */
    /***/ ((__unused_webpack_module, __webpack_exports_authing__, __webpack_require_authing__) => {

    __webpack_require_authing__.r(__webpack_exports_authing__);
    /* harmony export */ __webpack_require_authing__.d(__webpack_exports_authing__, {
    /* harmony export */   "default": () => (/* binding */ AuthingMove)
    /* harmony export */ });
    function AuthingMove () {}

    /***/ }),
    /* 3 */
    /***/ ((__unused_webpack_module, __webpack_exports_authing__, __webpack_require_authing__) => {

    __webpack_require_authing__.r(__webpack_exports_authing__);
    /* harmony export */ __webpack_require_authing__.d(__webpack_exports_authing__, {
    /* harmony export */   "initGlobalApi": () => (/* binding */ initGlobalApi)
    /* harmony export */ });
    /* harmony import */ var _use__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require_authing__(4);


    function initGlobalApi (AuthingMove) {
      (0,_use__WEBPACK_IMPORTED_MODULE_0__.initUse)(AuthingMove)
    }


    /***/ }),
    /* 4 */
    /***/ ((__unused_webpack_module, __webpack_exports_authing__, __webpack_require_authing__) => {

    __webpack_require_authing__.r(__webpack_exports_authing__);
    /* harmony export */ __webpack_require_authing__.d(__webpack_exports_authing__, {
    /* harmony export */   "initUse": () => (/* binding */ initUse)
    /* harmony export */ });
    function initUse (AuthingMove) {
      AuthingMove.use = function use (plugin, options = {}) {
        const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))

        if (installedPlugins.indexOf(plugin) > -1) {
          return this
        }

        const args = [options]

        args.unshift(this)

        if (typeof plugin.install === 'function') {
          plugin.install.apply(plugin, args)
        } else if (typeof plugin === 'function') {
          plugin.apply(null, args)
        }

        installedPlugins.push(plugin)

        return this
      }
    }


    /***/ }),
    /* 5 */
    /***/ ((__unused_webpack_module, __webpack_exports_authing__, __webpack_require_authing__) => {

    __webpack_require_authing__.r(__webpack_exports_authing__);
    /* harmony export */ __webpack_require_authing__.d(__webpack_exports_authing__, {
    /* harmony export */   "default": () => (/* binding */ install)
    /* harmony export */ });
    /* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require_authing__(6);
    /* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require_authing__(7);



    function install (AuthingMove, options = {}) {
      if (to === 'uni') {
        return
      }

      const {
        custom = {} // 自定义转换规则
      } = options
      const from = "wx" || 0
      const to = "swan" || 0

      const transformedApi = (0,_transform__WEBPACK_IMPORTED_MODULE_0__["default"])({
        from,
        to,
        custom
      })

      Object.keys(transformedApi).forEach(api => {
        try {
          if (typeof transformedApi[api] !== 'function') {
            AuthingMove[api] = transformedApi[api]
            return
          }

          AuthingMove[api] = (...args) => transformedApi[api].apply(AuthingMove, args)
        } catch (e) {
          (0,_shared__WEBPACK_IMPORTED_MODULE_1__.error)(`Call ${AuthingMove}.${api} error:` + JSON.stringify(e))
        }
      })
    }


    /***/ }),
    /* 6 */
    /***/ ((__unused_webpack_module, __webpack_exports_authing__, __webpack_require_authing__) => {

    __webpack_require_authing__.r(__webpack_exports_authing__);
    /* harmony export */ __webpack_require_authing__.d(__webpack_exports_authing__, {
    /* harmony export */   "default": () => (/* binding */ transformApi)
    /* harmony export */ });
    /* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require_authing__(7);
    /* harmony import */ var _platforms_wx_ali__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require_authing__(8);



    const fromMap = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.generateFromMap)()

    function joinName (from = '', to = '') {
      const _from = `__authing_move_src_mode_${from}__`
      return `${fromMap[_from]}_${to}`
    }

    function transformApi (options) {
      const envContext = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.getEnvContext)()
      const { from, to } = options
      const fromTo = joinName(from, to)
      const platformMap = {
        'wx_ali': (0,_platforms_wx_ali__WEBPACK_IMPORTED_MODULE_1__["default"])()
      }
      const needProxy = Object.create(null)
      const transformedApi = platformMap[fromTo] || {}

      Object.keys(envContext).concat(Object.keys(transformedApi)).forEach(key => {
        needProxy[key] = envContext[key] || transformedApi[key]
      })

      const apis = Object.create(null)

      Object.keys(needProxy).forEach(api => {
        if (typeof needProxy[api] !== 'function') {
          apis[api] = needProxy[api]
          return
        }

        apis[api] = (...args) => {
          let from = options.from
          const to = options.to

          if (args.length) {
            from = args.pop()

            if (typeof from !== 'string' || !fromMap[from]) {
              args.push(from)
              from = options.from
            }
          }

          const fromTo = joinName(from, to)

          if (options.custom[fromTo] && options.custom[fromTo][api]) {
            return options.custom[fromTo][api].apply(this, args)
          }

          if (platformMap[fromTo] && platformMap[fromTo][api]) {
            return platformMap[fromTo][api].apply(this, args)
          }

          if (envContext[api]) {
            return envContext[api].apply(this, args)
          }

          (0,_shared__WEBPACK_IMPORTED_MODULE_0__.error)(`当前小程序环境不存在 ${api} 方法`)
        }
      })

      return apis
    }


    /***/ }),
    /* 7 */
    /***/ ((__unused_webpack_module, __webpack_exports_authing__, __webpack_require_authing__) => {

    /* AuthongMove cjs variable */ var AuthingMove = __webpack_require_authing__(1).default;
    __webpack_require_authing__.r(__webpack_exports_authing__);
    /* harmony export */ __webpack_require_authing__.d(__webpack_exports_authing__, {
    /* harmony export */   "adaptOptions": () => (/* binding */ adaptOptions),
    /* harmony export */   "error": () => (/* binding */ error),
    /* harmony export */   "generateFromMap": () => (/* binding */ generateFromMap),
    /* harmony export */   "getEnvContext": () => (/* binding */ getEnvContext),
    /* harmony export */   "handleSuccess": () => (/* binding */ handleSuccess),
    /* harmony export */   "makeMap": () => (/* binding */ makeMap),
    /* harmony export */   "noop": () => (/* binding */ noop),
    /* harmony export */   "warn": () => (/* binding */ warn)
    /* harmony export */ });
    function getEnvContext () {
      switch ("swan") {
        case 'wx':
          return /* AuthingMove replacement */AuthingMove
        case 'ali':
          return my
        case 'swan':
          return swan
        case 'qq':
          return qq
        case 'tt':
          return tt
        case 'jd':
          return jd
        case 'qa':
          return qa
        case 'Taro':
          return Taro
        case 'uni':
          return uni
      }
    }

    function generateFromMap () {
      const platforms = ['wx', 'ali', 'baidu', 'qq', 'tt', 'jd', 'qa']
      return platforms.reduce((map, platform) => {
        map[`__authing_move_src_mode_${platform}__`] = platform
        return map
      }, {})
    }

    function makeMap (arr) {
      return arr.reduce((map, item) => {
        map[item] = true
        return map
      }, {})
    }

    function warn (message) {
      console.warn && console.warn(`[AuthingMove/api-proxy warn]:\n ${message}`)
    }

    function error (message) {
      console.error && console.error(`[AuthingMove/api-proxy error]:\n ${message}`)
    }

    function noop () {}

    function adaptOptions (originalOptions, matchedOptions, extraOptions) {
      let options = {}

      Object.keys(originalOptions).forEach(key => {
        const _key = matchedOptions.hasOwnProperty(key) ? matchedOptions[key] : key
        if (_key) {
          options[_key] = originalOptions[key]
        }
      })

      options = Object.assign({}, options, extraOptions)

      return options
    }

    function handleSuccess (originalOptions, wrappedSuccess = noop, context) {
      if (!originalOptions.success) {
        return
      }

      const _this = context || this
      const cachedSuccess = originalOptions.success

      originalOptions.success = res => cachedSuccess.call(_this, wrappedSuccess(res) || res)
    }


    /***/ }),
    /* 8 */
    /***/ ((__unused_webpack_module, __webpack_exports_authing__, __webpack_require_authing__) => {

    __webpack_require_authing__.r(__webpack_exports_authing__);
    /* harmony export */ __webpack_require_authing__.d(__webpack_exports_authing__, {
    /* harmony export */   "default": () => (/* binding */ getWxToAliApi)
    /* harmony export */ });
    /* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require_authing__(7);


    const envContext = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.getEnvContext)()

    function getWxToAliApi () {
      return {
        /**
         * 网络
         */
        request (options = {}) {
          const _options = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.adaptOptions)(options, {
            header: 'headers'
          })

          ;(0,_shared__WEBPACK_IMPORTED_MODULE_0__.handleSuccess)(_options, res => {
            return (0,_shared__WEBPACK_IMPORTED_MODULE_0__.adaptOptions)(res, {
              Headers: 'header',
              status: 'statusCode'
            })
          })

          // version > 1.11.0
          if (envContext.canIUse('request')) {
            return envContext.request(_options)
          }

          // will be archived, support dingding miniprogram
          return envContext.httpRequest(_options)
        },

        /**
         * 数据缓存
         */
        setStorageSync (key, data) {
          envContext.setStorageSync({
            key,
            data
          })
        },

        removeStorageSync (key) {
          envContext.removeStorageSync({ key })
        },

        getStorageSync (key) {
          return envContext.getStorageSync({ key }).data
        },

        /**
         * 扫码
         */
        scanCode (options = {}) {
          const _options = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.adaptOptions)(options, {
            onlyFromCamera: 'hideAlbum',
            scanType: 'type'
          })

          const typeMap = {
            barCode: 'bar',
            qrCode: 'qr'
          }

          if (_options.type) {
            const _type = typeMap[_options.type]
            if (_type) {
              _options.type = _type
            } else {
              (0,_shared__WEBPACK_IMPORTED_MODULE_0__.error)('支付宝小程序只能扫描【条形码】和【二维码】，请将 type 设置为 barCode 或 qrCode !!!')
              _options.type = 'qr'
            }
          }

          (0,_shared__WEBPACK_IMPORTED_MODULE_0__.handleSuccess)(_options, res => {
            return (0,_shared__WEBPACK_IMPORTED_MODULE_0__.adaptOptions)(res, {
              code: 'result'
            })
          })

          envContext.scan(_options)
        },

        /**
         * 开放接口
         */
        login (options = {}) {
          const _options = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.adaptOptions)(options)

          ;(0,_shared__WEBPACK_IMPORTED_MODULE_0__.handleSuccess)(_options, res => {
            return (0,_shared__WEBPACK_IMPORTED_MODULE_0__.adaptOptions)(res, {
              authCode: 'code'
            })
          })

          envContext.getAuthCode(_options)
        }
      }
    }


    /***/ })
    /******/ ]);
    /************************************************************************/
    /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require_authing__(moduleId) {
    /******/ 	// Check if module is in cache
    /******/ 	var cachedModule = __webpack_module_cache__[moduleId];
    /******/ 	if (cachedModule !== undefined) {
    /******/ 		return cachedModule.exports;
    /******/ 	}
    /******/ 	// Create a new module (and put it into the cache)
    /******/ 	var module = __webpack_module_cache__[moduleId] = {
    /******/ 		// no module.id needed
    /******/ 		// no module.loaded needed
    /******/ 		exports: {}
    /******/ 	};
    /******/
    /******/ 	// Execute the module function
    /******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require_authing__);
    /******/
    /******/ 	// Return the exports of the module
    /******/ 	return module.exports;
    /******/ }
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/define property getters */
    /******/ (() => {
    /******/ 	// define getter functions for harmony exports
    /******/ 	__webpack_require_authing__.d = (exports, definition) => {
    /******/ 		for(var key in definition) {
    /******/ 			if(__webpack_require_authing__.o(definition, key) && !__webpack_require_authing__.o(exports, key)) {
    /******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    /******/ 			}
    /******/ 		}
    /******/ 	};
    /******/ })();
    /******/
    /******/ /* webpack/runtime/global */
    /******/ (() => {
    /******/ 	__webpack_require_authing__.g = (function() {
    /******/ 		if (typeof globalThis === 'object') return globalThis;
    /******/ 		try {
    /******/ 			return this || new Function('return this')();
    /******/ 		} catch (e) {
    /******/ 			if (typeof window === 'object') return window;
    /******/ 		}
    /******/ 	})();
    /******/ })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/ (() => {
    /******/ 	__webpack_require_authing__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
    /******/ })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/ (() => {
    /******/ 	// define __esModule on exports
    /******/ 	__webpack_require_authing__.r = (exports) => {
    /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    /******/ 		}
    /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
    /******/ 	};
    /******/ })();
    /******/
    /************************************************************************/
    var __webpack_exports_authing__ = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
    (() => {
    /* AuthongMove cjs variable */ var AuthingMove = __webpack_require_authing__(1).default;
    __webpack_require_authing__.r(__webpack_exports_authing__);
    /* harmony export */ __webpack_require_authing__.d(__webpack_exports_authing__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _AuthingMove_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require_authing__(1);
    /* harmony import */ var _AuthingMove_api_proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require_authing__(5);



    _AuthingMove_core__WEBPACK_IMPORTED_MODULE_0__["default"].use(_AuthingMove_api_proxy__WEBPACK_IMPORTED_MODULE_1__["default"])

    /* AuthingMove replacement */AuthingMove.setStorageSync('abcdefg', 'abcdefg')

    /* AuthingMove replacement */AuthingMove.showToast({
      title: 'Toast',
      icon: 'success',
      duration: 3000
    })

    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_AuthingMove_core__WEBPACK_IMPORTED_MODULE_0__["default"]);

    })();

    var __webpack_exports_authing__default = __webpack_exports_authing__["default"];
    export { __webpack_exports_authing__default as default };
