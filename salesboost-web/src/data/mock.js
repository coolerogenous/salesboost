export const MOCK_USERS = [
    { id: '1001', name: '王销冠', role: 'employee', points: 1250, avatar: '👑', password: '123456' },
    { id: '1002', name: '李新人', role: 'employee', points: 450, avatar: '👨‍💼', password: '123456' },
    { id: '1003', name: '张努力', role: 'employee', points: 890, avatar: '👩‍💼', password: '123456' },
    { id: 'admin', name: '销售总监', role: 'admin', points: 0, avatar: '🛡️', password: 'admin' },
];

export const INITIAL_TASKS = [
    {
        id: 1,
        title: '朋友圈转发新品海报',
        desc: '请转发最新的夏季新品海报，文案需包含“限时折扣”字样，保留至少4小时。建议配文：🔥夏季必备，限时3天5折起！手慢无！',
        points: 50,
        deadline: '2023-12-31',
        type: '朋友圈',
        status: 'active',
        taskImage: null
    },
    {
        id: 2,
        title: '核心客户群发问候',
        desc: '向您的核心A类客户发送周末问候，并附带活动链接。重点强调我们的VIP服务升级。',
        points: 30,
        deadline: '2023-12-30',
        type: '社群',
        status: 'active',
        taskImage: null
    },
    {
        id: 3,
        title: '过期任务示例',
        desc: '这是一个已经过期的测试任务。',
        points: 10,
        deadline: '2023-01-01',
        type: '其他',
        status: 'closed', // 初始状态模拟过期
        taskImage: null
    },
];

export const INITIAL_SUBMISSIONS = [
    { id: 101, taskId: 1, userId: '1001', userName: '王销冠', status: 'approved', imageUrl: 'placeholder', note: '已转发，点赞超过20个', time: '2023-10-24 10:00' },
    { id: 102, taskId: 1, userId: '1002', userName: '李新人', status: 'pending', imageUrl: 'placeholder', note: '刚发的，请查收', time: '2023-10-24 11:30' },
];
