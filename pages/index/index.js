import AuthingMove from './bundle'

/**
 * @file index.js
 * @author swan
 */



import test from './test'

const app = getApp()

console.log('test:::: ', test())

// AuthingMove.showToast({
//     title: '成功',
//     icon: 'success',
//     duration: 2000
//   })

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: false
    },
    // 监听页面加载的生命周期函数
    onLoad() {
        this.setData({
            canIUse: swan.canIUse('button.open-type.getUserInfo')
        });
    },
    getUserInfo(e) {
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    }
})
