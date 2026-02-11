const app = getApp();

Page({
    data: {
        userInfo: {},
        tasks: []
    },

    onShow() {
        this.setData({
            userInfo: wx.getStorageSync('userInfo')
        });
        this.loadTasks();
    },

    loadTasks() {
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${app.globalData.baseUrl}/tasks`,
            header: { 'Authorization': `Bearer ${token}` },
            success: (res) => {
                if (res.statusCode === 200) {
                    this.setData({ tasks: res.data });
                }
            }
        });
    },

    goToDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/task-detail/task-detail?id=${id}`,
        });
    },

    onPullDownRefresh() {
        this.loadTasks();
        wx.stopPullDownRefresh();
    }
})
