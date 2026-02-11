const path = require('path');

exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: '请选择要上传的图片' });
    }

    // 返回文件名，由前端拼接基础路径
    const filename = req.file.filename;

    res.json({
        message: '上传成功',
        filename: filename,
        url: `${req.protocol}://${req.get('host')}/uploads/${filename}` // 保留 URL 供兼容，但建议用 filename
    });
};
