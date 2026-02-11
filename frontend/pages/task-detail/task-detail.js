const app = getApp();

Page({
    data: {
        task: {},
        tempImagePath: '',
        taskId: null
    },

    onLoad(options) {
        this.setData({ taskId: options.id });
        this.getTaskDetail(options.id);
    },

    getTaskDetail(id) {
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${app.globalData.baseUrl}/tasks/${id}`,
            header: { 'Authorization': `Bearer ${token}` },
            success: (res) => {
                if (res.statusCode === 200) {
                    this.setData({ task: res.data });
                }
            }
        });
    },

    chooseImage() {
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                this.setData({
                    tempImagePath: res.tempFiles[0].tempFilePath
                });
            }
        })
    },

    submitTask() {
        const token = wx.getStorageSync('token');

        wx.showLoading({ title: '正在上传图片...' });

        // 1. 先上传文件到服务器
        wx.uploadFile({
            url: `${app.globalData.baseUrl}/upload/image`,
            filePath: this.data.tempImagePath,
            name: 'image',
            header: {
                'Authorization': `Bearer ${token}`
            },
            success: (uploadRes) => {
                const data = JSON.parse(uploadRes.data);
                if (uploadRes.statusCode === 200) {
                    const imageUrl = data.url;

                    // 2. 上传成功后提交任务记录
                    wx.showLoading({ title: '正在提交审核...' });
                    wx.request({
                        url: `${app.globalData.baseUrl}/submissions/submit`,
                        method: 'POST',
                        header: { 'Authorization': `Bearer ${token}` },
                        data: {
                            task_id: this.data.taskId,
                            image_url: imageUrl
                        },
                        success: (submitRes) => {
                            wx.hideLoading();
                            if (submitRes.statusCode === 201) {
                                wx.showToast({ title: '提交成功' });
                                setTimeout(() => {
                                    wx.navigateBack();
                                }, 1500);
                            } else {
                                wx.showToast({ title: submitRes.data.message || '提交失败', icon: 'none' });
                            }
                        },
                        fail: () => {
                            wx.hideLoading();
                            wx.showToast({ title: '提交任务记录失败', icon: 'none' });
                        }
                    });
                } else {
                    wx.hideLoading();
                    wx.showToast({ title: data.message || '图片上传失败', icon: 'none' });
                }
            },
            fail: (err) => {
                wx.hideLoading();
                wx.showToast({ title: '图片上传失败', icon: 'none' });
                console.error('Upload error:', err);
            }
        });
    }
})
