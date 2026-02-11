const app = getApp();

Page({
    data: {
        title: '',
        description: '',
        reward_points: '',
        end_date: '',
        images: [] // Array of uploaded filenames
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

    // Choose and Upload Image
    chooseImage() {
        wx.chooseImage({
            count: 9, // Can choose multiple
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const tempFilePaths = res.tempFilePaths;
                this.uploadImages(tempFilePaths);
            }
        });
    },

    uploadImages(filePaths) {
        const token = wx.getStorageSync('token');
        const uploadPromises = filePaths.map(filePath => {
            return new Promise((resolve, reject) => {
                wx.uploadFile({
                    url: `${app.globalData.baseUrl}/upload`,
                    filePath: filePath,
                    name: 'image',
                    header: { 'Authorization': `Bearer ${token}` },
                    success: (res) => {
                        const data = JSON.parse(res.data);
                        resolve(data.filename);
                    },
                    fail: (err) => {
                        reject(err);
                    }
                });
            });
        });

        Promise.all(uploadPromises).then(filenames => {
            this.setData({
                images: this.data.images.concat(filenames)
            });
        }).catch(err => {
            wx.showToast({ title: '部分图片上传失败', icon: 'none' });
        });
    },

    deleteImage(e) {
        const index = e.currentTarget.dataset.index;
        const images = this.data.images;
        images.splice(index, 1);
        this.setData({ images });
    },

    handleSubmit() {
        const { title, description, reward_points, end_date, images } = this.data;
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
                end_time: end_date ? `${end_date} 23:59:59` : null,
                images // Pass array directly
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
