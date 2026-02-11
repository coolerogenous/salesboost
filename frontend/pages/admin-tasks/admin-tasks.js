const app = getApp();

Page({
    data: {
        tasks: []
    },

    onShow() {
        this.loadTasks();
    },

    loadTasks() {
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${app.globalData.baseUrl}/tasks`, // 管理员会看到全部
            header: { 'Authorization': `Bearer ${token}` },
            success: (res) => {
                if (res.statusCode === 200) {
                    this.setData({ tasks: res.data });
                }
            }
        });
    },

    goToAddTask() {
        wx.navigateTo({
            url: '/pages/admin-add-task/admin-add-task',
        });
    },

    handleDelete(e) {
        const id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '确认删除',
            content: '删除后无法恢复，确定吗？',
            success: (res) => {
                if (res.confirm) {
                    this.deleteTask(id);
                }
            }
        });
    },

    deleteTask(id) {
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${app.globalData.baseUrl}/tasks/${id}`,
            method: 'DELETE',
            header: { 'Authorization': `Bearer ${token}` },
            success: (res) => {
                if (res.statusCode === 200) {
                    wx.showToast({ title: '删除成功' });
                    this.loadTasks();
                }
            }
        });
    }
})
