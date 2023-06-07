import * as fs from 'fs';

export function deleteFile(filename: string) {
  // 原本图片路径
  const path = `${process.cwd()}/uploads/${filename}`;

  // 删除原本图片
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}
