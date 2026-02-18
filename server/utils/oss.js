const OSS = require('ali-oss');
const path = require('path');

let client = null;

function getClient() {
    if (!client) {
        client = new OSS({
            region: process.env.OSS_REGION,
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            bucket: process.env.OSS_BUCKET
        });
    }
    return client;
}

/**
 * 上传文件到阿里云 OSS
 * @param {Buffer} buffer - 文件内容
 * @param {string} originalname - 原始文件名
 * @param {string} prefix - 文件前缀 (如 'task' 或 'sub')
 * @returns {Promise<string>} 文件的完整 URL
 */
async function uploadToOSS(buffer, originalname, prefix = 'img') {
    const ext = path.extname(originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const objectName = `salesboost/${prefix}-${uniqueSuffix}${ext}`;

    const ossClient = getClient();
    const result = await ossClient.put(objectName, buffer);

    return result.url;
}

module.exports = { uploadToOSS };
