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
        const userInfo = wx.getStorageSync('userInfo');

        // 1. 先获取任务
        wx.request({
            url: `${app.globalData.baseUrl}/tasks`,
            header: { 'Authorization': `Bearer ${token}` },
            success: (res) => {
                if (res.statusCode === 200) {
                    const tasks = res.data;

                    // 2. 获取我的提交记录来标记已提交任务
                    wx.request({
                        url: `${app.globalData.baseUrl}/submissions/my`,
                        header: { 'Authorization': `Bearer ${token}` },
                        success: (subRes) => {
                            if (subRes.statusCode === 200) {
                                const mySubmissions = subRes.data;
                                // 标记每个任务的提交状态
                                tasks.forEach(task => {
                                    const sub = mySubmissions.find(s => s.task_id === task.id);
                                    if (sub) {
                                        task.submissionStatus = sub.status; // pending/approved/rejected
                                    }
                                });
                            }
                            this.setData({ tasks: tasks });
                        },
                        fail: () => {
                            this.setData({ tasks: tasks });
                        }
                    });
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
