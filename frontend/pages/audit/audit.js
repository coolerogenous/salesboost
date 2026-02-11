const app = getApp();

Page({
    data: {
        submissions: [],
        showRejectModal: false,
        rejectReason: '',
        currentId: null
    },

    onShow() {
        this.loadSubmissions();
    },

    loadSubmissions() {
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${app.globalData.baseUrl}/submissions/pending`,
            header: { 'Authorization': `Bearer ${token}` },
            success: (res) => {
                if (res.statusCode === 200) {
                    // 格式化图片地址
                    const list = res.data.map(item => {
                        // 处理多图
                        if (item.images) {
                            try {
                                const imgs = JSON.parse(item.images);
                                item.imageList = imgs.map(img => `${app.globalData.baseImageUrl}/${img}`);
                            } catch (e) {
                                item.imageList = [];
                            }
                        } else if (item.image_url) {
                            // 兼容旧数据
                            const url = item.image_url.startsWith('http') ? item.image_url : `${app.globalData.baseImageUrl}/${item.image_url}`;
                            item.imageList = [url];
                        } else {
                            item.imageList = [];
                        }
                        return item;
                    });
                    this.setData({ submissions: list });
                }
            }
        });
    },

    previewImage(e) {
        const current = e.currentTarget.dataset.url;
        const urls = e.currentTarget.dataset.urls || [current];
        wx.previewImage({
            current: current,
            urls: urls,
        });
    },

    handleApprove(e) {
        const id = e.currentTarget.dataset.id;
        this.submitReview(id, 'approved', '');
    },

    showRejectDialog(e) {
        this.setData({
            showRejectModal: true,
            currentId: e.currentTarget.dataset.id
        });
    },

    hideRejectDialog() {
        this.setData({ showRejectModal: false });
    },

    onRejectReasonInput(e) {
        this.setData({ rejectReason: e.detail.value });
    },

    handleReject() {
        if (!this.data.rejectReason) {
            wx.showToast({ title: '请输入驳回理由', icon: 'none' });
            return;
        }
        this.submitReview(this.data.currentId, 'rejected', this.data.rejectReason);
    },

    submitReview(id, status, reason) {
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${app.globalData.baseUrl}/submissions/review`,
            method: 'POST',
            header: { 'Authorization': `Bearer ${token}` },
            data: {
                submission_id: id,
                status: status,
                reject_reason: reason
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    wx.showToast({ title: '审核成功' });
                    this.setData({ showRejectModal: false, rejectReason: '' });
                    this.loadSubmissions();
                } else {
                    wx.showToast({ title: res.data.message || '审核失败', icon: 'none' });
                }
            }
        });
    }
})
