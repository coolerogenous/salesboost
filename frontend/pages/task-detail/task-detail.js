const app = getApp();

Page({
    data: {
        task: {},
        images: [], // Proof images
        textContent: '',
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
                    const task = res.data;
                    // Parse example images if exists
                    if (task.images && typeof task.images === 'string') {
                        try {
                            task.imageList = JSON.parse(task.images);
                        } catch (e) {
                            task.imageList = [];
                        }
                    }
                    this.setData({ task });
                }
            }
        });
    },

    onInputText(e) {
        this.setData({ textContent: e.detail.value });
    },

    chooseImage() {
        wx.chooseMedia({
            count: 9,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const tempFiles = res.tempFiles;
                this.uploadImages(tempFiles);
            }
        })
    },

    uploadImages(files) {
        const token = wx.getStorageSync('token');
        const uploadPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                wx.uploadFile({
                    url: `${app.globalData.baseUrl}/upload/image`,
                    filePath: file.tempFilePath,
                    name: 'image',
                    header: { 'Authorization': `Bearer ${token}` },
                    success: (res) => {
                        const data = JSON.parse(res.data);
                        resolve(data.filename);
                    },
                    fail: reject
                });
            });
        });

        Promise.all(uploadPromises).then(filenames => {
            this.setData({
                images: this.data.images.concat(filenames)
            });
        }).catch(err => {
            wx.showToast({ title: '上传失败', icon: 'none' });
        });
    },

    deleteImage(e) {
        const index = e.currentTarget.dataset.index;
        const images = this.data.images;
        images.splice(index, 1);
        this.setData({ images });
    },

    submitTask() {
        const token = wx.getStorageSync('token');
        const { taskId, images, textContent } = this.data;

        if (images.length === 0) {
            wx.showToast({ title: '请至少上传一张图片', icon: 'none' });
            return;
        }

        wx.showLoading({ title: '正在提交...' });
        wx.request({
            url: `${app.globalData.baseUrl}/submissions/submit`,
            method: 'POST',
            header: { 'Authorization': `Bearer ${token}` },
            data: {
                task_id: taskId,
                images: images,
                text_content: textContent
            },
            success: (res) => {
                wx.hideLoading();
                if (res.statusCode === 201) {
                    wx.showToast({ title: '提交成功' });
                    setTimeout(() => {
                        wx.navigateBack();
                    }, 1500);
                } else {
                    wx.showToast({ title: res.data.message || '提交失败', icon: 'none' });
                }
            },
            fail: () => {
                wx.hideLoading();
                wx.showToast({ title: '网络错误', icon: 'none' });
            }
        });
    }
})
