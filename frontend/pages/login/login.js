const app = getApp();

Page({
    data: {
        staff_id: '',
        password: ''
    },

    onStaffIdInput(e) {
        this.setData({ staff_id: e.detail.value });
    },

    onPasswordInput(e) {
        this.setData({ password: e.detail.value });
    },

    handleLogin() {
        const { staff_id, password } = this.data;
        if (!staff_id || !password) {
            wx.showToast({ title: '请填写完整信息', icon: 'none' });
            return;
        }

        wx.showLoading({ title: '正在登录...' });

        wx.request({
            url: `${app.globalData.baseUrl}/auth/login`,
            method: 'POST',
            data: { staff_id, password },
            success: (res) => {
                wx.hideLoading();
                if (res.statusCode === 200) {
                    wx.setStorageSync('token', res.data.token);
                    wx.setStorageSync('userInfo', res.data.user);
                    wx.showToast({ title: '登录成功' });
                    wx.switchTab({ url: '/pages/index/index' });
                } else {
                    wx.showToast({ title: res.data.message || '登录失败', icon: 'none' });
                }
            },
            fail: () => {
                wx.hideLoading();
                wx.showToast({ title: '网络错误', icon: 'none' });
            }
        });
    }
})
