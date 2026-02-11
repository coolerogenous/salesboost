const app = getApp();

Page({
  data: {
    userInfo: {},
    stats: {},
    pointLogs: []
  },

  onShow() {
    this.refreshData();
  },

  refreshData() {
    const token = wx.getStorageSync('token');
    if (!token) return;

    // 1. 获取最新用户信息
    wx.request({
      url: `${app.globalData.baseUrl}/users/profile`,
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ userInfo: res.data });
          wx.setStorageSync('userInfo', res.data);
        }
      }
    });

    // 2. 获取统计信息
    wx.request({
      url: `${app.globalData.baseUrl}/users/stats`,
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ stats: res.data });
        }
      }
    });

    // 3. 获取积分流水
    wx.request({
      url: `${app.globalData.baseUrl}/users/point-logs`,
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        if (res.statusCode === 200) {
          // 格式化时间显示
          const logs = res.data.map(log => {
            const date = new Date(log.created_at);
            log.created_at = `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
            return log;
          });
          this.setData({ pointLogs: logs });
        }
      }
    });
  },

  goToAudit() {
    wx.navigateTo({ url: '/pages/audit/audit' });
  },

  goToAdminTasks() {
    wx.navigateTo({ url: '/pages/admin-tasks/admin-tasks' });
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.reLaunch({
            url: '/pages/login/login',
          });
        }
      }
    })
  },

  onPullDownRefresh() {
    this.refreshData();
    wx.stopPullDownRefresh();
  }
})