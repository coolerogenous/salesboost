const app = getApp();

Page({
    data: {
        staffList: [],
        showModal: false,
        newName: '',
        newId: '',
        newPassword: ''
    },

    onShow() {
        this.loadStaff();
    },

    loadStaff() {
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${app.globalData.baseUrl}/users/staff`,
            header: { 'Authorization': `Bearer ${token}` },
            success: (res) => {
                if (res.statusCode === 200) {
                    this.setData({ staffList: res.data });
                }
            }
        });
    },

    showAddModal() {
        this.setData({ showModal: true });
    },

    hideAddModal() {
        this.setData({ showModal: false, newName: '', newId: '', newPassword: '' });
    },

    onInputName(e) { this.setData({ newName: e.detail.value }); },
    onInputId(e) { this.setData({ newId: e.detail.value }); },
    onInputPassword(e) { this.setData({ newPassword: e.detail.value }); },

    handleAddStaff() {
        const { newName, newId, newPassword } = this.data;
        if (!newName || !newId || !newPassword) {
            wx.showToast({ title: '请填写完整信息', icon: 'none' });
            return;
        }

        const token = wx.getStorageSync('token');
        wx.request({
            url: `${app.globalData.baseUrl}/users/staff`,
            method: 'POST',
            header: { 'Authorization': `Bearer ${token}` },
            data: {
                username: newName,
                staff_id: newId,
                password: newPassword
            },
            success: (res) => {
                if (res.statusCode === 201) {
                    wx.showToast({ title: '录入成功' });
                    this.hideAddModal();
                    this.loadStaff();
                } else {
                    wx.showToast({ title: res.data.message || '录入失败', icon: 'none' });
                }
            }
        });
    },

    handleDelete(e) {
        const { id, name } = e.currentTarget.dataset;
        wx.showModal({
            title: '确认删除',
            content: `确定要删除员工 [${name}] 吗？`,
            success: (res) => {
                if (res.confirm) {
                    const token = wx.getStorageSync('token');
                    wx.request({
                        url: `${app.globalData.baseUrl}/users/staff/${id}`,
                        method: 'DELETE',
                        header: { 'Authorization': `Bearer ${token}` },
                        success: (res) => {
                            if (res.statusCode === 200) {
                                wx.showToast({ title: '删除成功' });
                                this.loadStaff();
                            }
                        }
                    });
                }
            }
        });
    }
})
