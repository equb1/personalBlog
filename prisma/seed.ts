import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 清理数据（保持外键约束顺序）
  await prisma.comment.deleteMany();
  await prisma.postTags.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.role.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // 创建四个字分类（带描述）
  const categories = await prisma.$transaction([
    // 技术文章 - 学习笔记
    prisma.category.create({
        data: {
            name: '学习笔记',
            slug: 'learning-notes',
            description: '知识学习与总结，涵盖技术相关的学习内容'
        }
    }),
    // 技术文章 - 笔试面试
    prisma.category.create({
        data: {
            name: '笔试面试',
            slug: 'interviews',
            description: '笔试面试的经验与技巧分享，主要针对技术岗位'
        }
    }),
    // 技术文章 - 项目实践
    prisma.category.create({
        data: {
            name: '项目实践',
            slug: 'projects',
            description: '各类项目实践的经验总结，包含技术项目的实施过程和成果'
        }
    }),
    // 兴趣文章 - 游戏攻略
    prisma.category.create({
        data: {
            name: '游戏攻略',
            slug: 'games',
            description: '电子游戏攻略与技巧，涉及各种类型的游戏'
        }
    }),
    // 兴趣文章 - 动漫观感
    prisma.category.create({
        data: {
            name: '动漫观感',
            slug: 'anime-impressions',
            description: '关于动漫作品的个人感受、评价和推荐'
        }
    }),
    // 兴趣文章 - 阅读笔记
    prisma.category.create({
        data: {
            name: '阅读笔记',
            slug: 'reading',
            description: '读书心得与书评，涵盖各种类型书籍的阅读感悟'
        }
    }),
    // 生活点滴 - 生活杂谈
    prisma.category.create({
        data: {
            name: '生活杂谈',
            slug: 'life-miscellaneous',
            description: '日常生活中的各种话题分享，包括感悟、趣事等'
        }
    }),
    // 书籍分享 - 书架
    prisma.category.create({
        data: {
            name: '书架',
            slug: 'book-shelf',
            description: '书籍分享，包括书籍推荐、介绍和整理'
        }
    }),
    // 视频分享 - 技术视频
    prisma.category.create({
        data: {
            name: '技术视频',
            slug: 'tech-videos',
            description: '与技术相关的视频分享，如编程教学、技术讲座等'
        }
    }),
    // 视频分享 - 生活视频
    prisma.category.create({
        data: {
            name: '生活视频',
            slug: 'life-videos',
            description: '日常生活相关的视频分享，如美食、旅游、健身等'
        }
    }),
    // 视频分享 - 兴趣视频
    prisma.category.create({
        data: {
            name: '兴趣视频',
            slug: 'hobby-videos',
            description: '与个人兴趣相关的视频分享，如游戏、动漫、手工等'
        }
    }),
    prisma.category.create({
        data: {
          name: '学习资料',
          slug: 'learning-materials',
          description: '各类学习资料，包括教程、教材等',
        },
      }),
      prisma.category.create({
        data: {
          name: '悬疑小说',
          slug: 'mystery-novels',
          description: '悬疑、侦探小说',
        },
      }),
      prisma.category.create({
        data: {
          name: '历史小说',
          slug: 'historical-novels',
          description: '以历史为背景的小说',
        },
      }),
      prisma.category.create({
        data: {
          name: '人文历史',
          slug: 'humanities-history',
          description: '历史、文化、哲学等人文类书籍',
        },
      }),
]);

  // 创建管理员角色
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' }
  })

  // 创建测试用户
  const passwordHash = await bcrypt.hash('90780cfy//', 10)
  const user = await prisma.user.create({
    data: {
      username: "testuser",
      email: "u94809@126.com",
      passwordHash,
      roles: { connect: { id: adminRole.id } },
      isVerified: true
    }
  })

// 创建分类专属标签
const tags = await prisma.$transaction([
  // 游戏攻略标签
  prisma.tag.create({ data: { name: "Switch游戏", slug: "switch-games" } }),
  prisma.tag.create({ data: { name: "PC游戏", slug: "pc-games" } }),
  prisma.tag.create({ data: { name: "手游攻略", slug: "mobile-game-guides" } }),
  prisma.tag.create({ data: { name: "竞技游戏", slug: "competitive-games" } }),
  prisma.tag.create({ data: { name: "角色扮演游戏", slug: "role-playing-games" } }),

  // 学习笔记标签
  prisma.tag.create({ data: { name: "前端框架", slug: "frontend-frameworks" } }),
  prisma.tag.create({ data: { name: "后端开发", slug: "backend-development" } }),
  prisma.tag.create({ data: { name: "数据库知识", slug: "database-knowledge" } }),
  prisma.tag.create({ data: { name: "算法学习", slug: "algorithm-learning" } }),
  prisma.tag.create({ data: { name: "编程语言", slug: "programming-languages" } }),

  // 动漫推荐标签
  prisma.tag.create({ data: { name: "经典番剧", slug: "classic-anime" } }),
  prisma.tag.create({ data: { name: "新番推荐", slug: "new-anime-recommendations" } }),
  prisma.tag.create({ data: { name: "动漫角色", slug: "anime-characters" } }),
  prisma.tag.create({ data: { name: "动漫类型", slug: "anime-genres" } }),
  prisma.tag.create({ data: { name: "动漫制作公司", slug: "anime-production-companies" } }),

  // 生活百科标签
  prisma.tag.create({ data: { name: "家居整理", slug: "home-organization" } }),
  prisma.tag.create({ data: { name: "美食烹饪", slug: "food-cooking" } }),
  prisma.tag.create({ data: { name: "健康养生", slug: "health-and-wellness" } }),
  prisma.tag.create({ data: { name: "旅游攻略", slug: "travel-guides" } }),
  prisma.tag.create({ data: { name: "宠物饲养", slug: "pet-raising" } }),

  // 阅读笔记标签
  prisma.tag.create({ data: { name: "文学经典", slug: "literary-classics" } }),
  prisma.tag.create({ data: { name: "现代小说", slug: "modern-novels" } }),
  prisma.tag.create({ data: { name: "历史书籍", slug: "historical-books" } }),
  prisma.tag.create({ data: { name: "科普读物", slug: "popular-science-books" } }),
  prisma.tag.create({ data: { name: "哲学著作", slug: "philosophical-works" } }),

  // 笔试面试标签
  prisma.tag.create({ data: { name: "技术面试", slug: "technical-interviews" } }),
  prisma.tag.create({ data: { name: "HR面试", slug: "hr-interviews" } }),
  prisma.tag.create({ data: { name: "笔试技巧", slug: "written-exam-skills" } }),
  prisma.tag.create({ data: { name: "面试经验分享", slug: "interview-experience-sharing" } }),
  prisma.tag.create({ data: { name: "面试常见问题", slug: "common-interview-questions" } }),

  // 项目实践标签
  prisma.tag.create({ data: { name: "个人项目", slug: "personal-projects" } }),
  prisma.tag.create({ data: { name: "团队项目", slug: "team-projects" } }),
  prisma.tag.create({ data: { name: "开源项目", slug: "open-source-projects" } }),
  prisma.tag.create({ data: { name: "项目管理", slug: "project-management" } }),
  prisma.tag.create({ data: { name: "项目架构设计", slug: "project-architecture-design" } }),

  // 生活杂谈标签
  prisma.tag.create({ data: { name: "日常感悟", slug: "daily-insights" } }),
  prisma.tag.create({ data: { name: "心情随笔", slug: "mood-essays" } }),
  prisma.tag.create({ data: { name: "生活趣事", slug: "life-fun-stories" } }),
  prisma.tag.create({ data: { name: "社交生活", slug: "social-life" } }),
  prisma.tag.create({ data: { name: "家庭生活", slug: "family-life" } }),

  // 书籍分享标签
  prisma.tag.create({ data: { name: "新书推荐", slug: "new-book-recommendations" } }),
  prisma.tag.create({ data: { name: "书籍排行", slug: "book-rankings" } }),
  prisma.tag.create({ data: { name: "书籍类型", slug: "book-genres" } }),
  prisma.tag.create({ data: { name: "书籍作者", slug: "book-authors" } }),
  prisma.tag.create({ data: { name: "阅读习惯", slug: "reading-habits" } }),

  // 技术视频标签
  prisma.tag.create({ data: { name: "编程教学视频", slug: "programming-teaching-videos" } }),
  prisma.tag.create({ data: { name: "技术讲座视频", slug: "technical-lecture-videos" } }),
  prisma.tag.create({ data: { name: "行业动态视频", slug: "industry-trend-videos" } }),
  prisma.tag.create({ data: { name: "技术工具介绍", slug: "technical-tool-introductions" } }),
  prisma.tag.create({ data: { name: "代码演示视频", slug: "code-demo-videos" } }),

  // 生活视频标签
  prisma.tag.create({ data: { name: "美食视频", slug: "food-videos" } }),
  prisma.tag.create({ data: { name: "旅游视频", slug: "travel-videos" } }),
  prisma.tag.create({ data: { name: "健身视频", slug: "fitness-videos" } }),
  prisma.tag.create({ data: { name: "家居生活视频", slug: "home-life-videos" } }),
  prisma.tag.create({ data: { name: "宠物视频", slug: "pet-videos" } }),

  // 兴趣视频标签
  prisma.tag.create({ data: { name: "游戏视频", slug: "game-videos" } }),
  prisma.tag.create({ data: { name: "动漫视频", slug: "anime-videos" } }),
  prisma.tag.create({ data: { name: "手工制作视频", slug: "handicraft-videos" } }),
  prisma.tag.create({ data: { name: "音乐视频", slug: "music-videos" } }),
  prisma.tag.create({ data: { name: "绘画视频", slug: "painting-videos" } }),

  prisma.tag.create({ data: { name: '教材', slug: 'textbook' } }),
    prisma.tag.create({ data: { name: '教程', slug: 'tutorial' } }),
    prisma.tag.create({ data: { name: '悬疑', slug: 'mystery' } }),
    prisma.tag.create({ data: { name: '历史', slug: 'history' } }),
    prisma.tag.create({ data: { name: '文化', slug: 'culture' } }),
]);
  

  console.log('✅ 种子数据创建成功')
  console.log('- 分类:', categories.map(c => c.name).join(', '))
  console.log('- 标签:', tags.map(t => t.name).join(', '))
  //console.log('- 文章:', posts.map(p => p.title).join('\n  '))
}

main()
  .catch((e) => {
    console.error('❌ 种子数据创建失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })