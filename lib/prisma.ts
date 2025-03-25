import { PrismaClient } from '@prisma/client'

// TypeScript 全局类型扩展
declare global {
  // 允许在全局作用域中缓存 prisma 实例
  // 使用 `var` 是因为它是唯一可以在全局作用域中重复声明的声明方式
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// 确保 PrismaClient 仅在服务器端使用
if (typeof window !== 'undefined') {
  throw new Error('PrismaClient 不能在浏览器环境中使用')
}

// 开发环境下使用全局缓存的 prisma 实例
// 生产环境下每次创建新实例（但通过连接池管理）
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error']
})

// 开发环境下将实例挂载到全局
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma
}

// 添加连接检查（仅在生产环境或首次连接时）
if (process.env.NODE_ENV === 'production' || !global.prisma) {
  prisma.$connect()
    .then(() => console.log('Prisma 已成功连接数据库'))
    .catch(err => console.error('数据库连接失败:', err))
}

export default prisma