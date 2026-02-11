const path = require('path');

exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: '请选择要上传的图片' });
    }

    // 构建可访问的 URL
    // 在本地开发环境，指向 localhost:3000/uploads/...
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
        message: '上传成功',
        url: imageUrl
    });
};
