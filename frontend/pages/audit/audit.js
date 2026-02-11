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
                    this.setData({ submissions: res.data });
                }
            }
        });
    },

    previewImage(e) {
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
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
