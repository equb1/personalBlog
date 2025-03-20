import { PrismaClient } from '@prisma/client';

// 确保 PrismaClient 仅在服务器端使用
if (typeof window !== 'undefined') {
  throw new Error('PrismaClient 不能在浏览器环境中使用');
}

const prisma = new PrismaClient();

// 添加连接检查
prisma.$connect()
  .then(() => console.log('Prisma 已成功连接数据库'))
  .catch(err => console.error('数据库连接失败:', err));

export default prisma;