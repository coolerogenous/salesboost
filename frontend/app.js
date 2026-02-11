App({
    onLaunch: function () {
        // 检查登录状态
        const token = wx.getStorageSync('token');
        if (!token) {
            wx.reLaunch({
                url: '/pages/login/login',
            })
        }
    },

    // 全局请求拦截器：处理 401 未授权
    request(options) {
        const token = wx.getStorageSync('token');
        const originalSuccess = options.success;

        options.header = Object.assign({}, options.header, {
            'Authorization': `Bearer ${token}`
        });

        options.success = (res) => {
            if (res.statusCode === 401) {
                // Token过期或无效，清除数据跳回登录
                wx.clearStorageSync();
                wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
                setTimeout(() => {
                    wx.reLaunch({ url: '/pages/login/login' });
                }, 1500);
                return;
            }
            if (originalSuccess) {
                originalSuccess(res);
            }
        };

        wx.request(options);
    },

    globalData: {
        userInfo: null,
        baseUrl: 'http://localhost:3000/api', // 后端接口地址
        baseImageUrl: 'http://localhost:3000/uploads' // 图片基础地址
    }
})
