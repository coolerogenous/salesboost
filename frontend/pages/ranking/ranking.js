const app = getApp();

Page({
    data: {
        rankingList: []
    },

    onShow() {
        this.loadRanking();
    },

    loadRanking() {
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${app.globalData.baseUrl}/ranking`,
            header: { 'Authorization': `Bearer ${token}` },
            success: (res) => {
                if (res.statusCode === 200) {
                    this.setData({ rankingList: res.data });
                }
            }
        });
    },

    onPullDownRefresh() {
        this.loadRanking();
        wx.stopPullDownRefresh();
    }
})
