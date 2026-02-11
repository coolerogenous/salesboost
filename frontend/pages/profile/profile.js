const app = getApp();

Page({
  data: {
    userInfo: {},
    stats: {},
    pointLogs: [],
    showExportPreview: false,
    previewData: []
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

  goToStaff() {
    wx.navigateTo({ url: '/pages/admin-staff/admin-staff' });
  },

  handleExport() {
    const token = wx.getStorageSync('token');
    wx.showLoading({ title: '正在生成报表...' });

    wx.downloadFile({
      url: `${app.globalData.baseUrl}/users/export-stats`,
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          const filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            fileType: 'xlsx',
            success: () => {
              console.log('文件打开成功');
            },
            fail: (err) => {
              wx.showToast({ title: '无法打开文件', icon: 'none' });
              console.error(err);
            }
          })
        } else {
          wx.showToast({ title: '导出失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
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

  handleExportPreview() {
    const token = wx.getStorageSync('token');
    wx.showLoading({ title: '加载预览...' });

    wx.request({
      url: `${app.globalData.baseUrl}/users/stats/export-preview`,
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          this.setData({
            previewData: res.data,
            showExportPreview: true
          });
        } else {
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  closeExportPreview() {
    this.setData({ showExportPreview: false });
  },

  onPullDownRefresh() {
    this.refreshData();
    wx.stopPullDownRefresh();
  }
})