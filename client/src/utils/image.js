/**
 * 获取图片的完整 URL
 * - 如果是 OSS 的完整 URL（以 http 开头），直接返回
 * - 如果是旧的本地路径（如 /uploads/xxx.jpg），拼接后端地址
 */
export function getImageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // 兼容旧的本地存储路径
    return path;
}
