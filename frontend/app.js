App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 检查登录状态
        const token = wx.getStorageSync('token');
        if (!token) {
            wx.reLaunch({
                url: '/pages/login/login',
            })
        }
    },
    globalData: {
        userInfo: null,
        baseUrl: 'http://localhost:3000/api' // 本地开发地址
    }
})
