const app = getApp();

Page({
    data: {
        title: '',
        description: '',
        reward_points: '',
        end_date: ''
    },

    onTitleInput(e) {
        this.setData({ title: e.detail.value });
    },

    onDescriptionInput(e) {
        this.setData({ description: e.detail.value });
    },

    onPointsInput(e) {
        this.setData({ reward_points: e.detail.value });
    },

    onDateChange(e) {
        this.setData({ end_date: e.detail.value });
    },

    handleSubmit() {
        const { title, description, reward_points, end_date } = this.data;
        if (!title || !description || !reward_points) {
            wx.showToast({ title: '标题、描述和积分为必填项', icon: 'none' });
            return;
        }

        const token = wx.getStorageSync('token');
        wx.showLoading({ title: '正在发布...' });

        wx.request({
            url: `${app.globalData.baseUrl}/tasks`,
            method: 'POST',
            header: { 'Authorization': `Bearer ${token}` },
            data: {
                title,
                description,
                reward_points: parseInt(reward_points),
                end_time: end_date ? `${end_date} 23:59:59` : null
            },
            success: (res) => {
                wx.hideLoading();
                if (res.statusCode === 201) {
                    wx.showToast({ title: '发布成功' });
                    setTimeout(() => {
                        wx.navigateBack();
                    }, 1500);
                } else {
                    wx.showToast({ title: res.data.message || '发布失败', icon: 'none' });
                }
            },
            fail: () => {
                wx.hideLoading();
                wx.showToast({ title: '网络错误', icon: 'none' });
            }
        });
    }
})
