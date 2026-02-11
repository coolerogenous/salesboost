const app = getApp();

Page({
    data: {
        rankingList: [],
        activeTab: 'total',
        myRank: 0
    },

    onShow() {
        this.loadRanking();
    },

    switchTab(e) {
        const tab = e.currentTarget.dataset.tab;
        this.setData({ activeTab: tab });
        this.loadRanking();
    },

    loadRanking() {
        const token = wx.getStorageSync('token');
        const userInfo = wx.getStorageSync('userInfo');
        const url = this.data.activeTab === 'weekly'
            ? `${app.globalData.baseUrl}/ranking/weekly`
            : `${app.globalData.baseUrl}/ranking`;

        wx.request({
            url: url,
            header: { 'Authorization': `Bearer ${token}` },
            success: (res) => {
                if (res.statusCode === 200) {
                    let myRank = 0;
                    const list = res.data.map((item, index) => {
                        if (userInfo && item.staff_id === userInfo.staff_id) {
                            item.isMe = true;
                            myRank = index + 1;
                        }
                        return item;
                    });
                    this.setData({ rankingList: list, myRank: myRank });
                }
            }
        });
    },

    onPullDownRefresh() {
        this.loadRanking();
        wx.stopPullDownRefresh();
    }
})
