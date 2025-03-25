import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ========================
// 数据库清理函数（安全版）
// ========================
async function safeResetDatabase() {
  const modelNames = [
    'Comment', 'PostTags', 'Post', 'Tag',
    'Category', 'Role', 'Book', 'User',
    'Activity', 'BookTags', 'CarouselItem',
    'FriendLink', 'LearningPath', 'Like',
    'Media', 'Page', 'Session', 'Subscriber',
    'VerificationToken', 'VisitLog', '_BookTags',
    '_PostTags', '_UserRoles'
  ];

  try {
    console.log('🔄 开始清理数据库...');
    await prisma.$executeRaw`SET session_replication_role = 'replica';`;
    
    for (const model of modelNames) {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${model}" CASCADE;`);
        console.log(`▸ 成功清空表: ${model}`);
      } catch (error) {
        if (error instanceof Error && error.message.includes('does not exist')) {
          console.log(`▸ 表 ${model} 不存在，跳过`);
        }
      }
    }

    await prisma.$executeRaw`SET session_replication_role = 'origin';`;
    console.log('✅ 数据库清理完成');
  } catch (error) {
    console.error('❌ 数据库清理失败:', error);
    throw error;
  }
}

// ========================
// 分类数据
// ========================
const categories = [
  {
    name: '学习笔记',
    slug: 'learning-notes',
    description: '知识学习与总结，涵盖技术相关的学习内容'
  },
  {
    name: '笔试面试',
    slug: 'interviews',
    description: '笔试面试的经验与技巧分享，主要针对技术岗位'
  },
  {
    name: '项目实践',
    slug: 'projects',
    description: '各类项目实践的经验总结，包含技术项目的实施过程和成果'
  },
  {
    name: '游戏攻略',
    slug: 'games',
    description: '电子游戏攻略与技巧，涉及各种类型的游戏'
  },
  {
    name: '动漫观感',
    slug: 'anime-impressions',
    description: '关于动漫作品的个人感受、评价和推荐'
  },
  {
    name: '阅读笔记',
    slug: 'reading',
    description: '读书心得与书评，涵盖各种类型书籍的阅读感悟'
  },
  {
    name: '生活杂谈',
    slug: 'life-miscellaneous',
    description: '日常生活中的各种话题分享，包括感悟、趣事等'
  },
  {
    name: '书架',
    slug: 'book-shelf',
    description: '书籍分享，包括书籍推荐、介绍和整理'
  },
  {
    name: '技术视频',
    slug: 'tech-videos',
    description: '与技术相关的视频分享，如编程教学、技术讲座等'
  },
  {
    name: '生活视频',
    slug: 'life-videos',
    description: '日常生活相关的视频分享，如美食、旅游、健身等'
  },
  {
    name: '兴趣视频',
    slug: 'hobby-videos',
    description: '与个人兴趣相关的视频分享，如游戏、动漫、手工等'
  },
  {
    name: '学习资料',
    slug: 'learning-materials',
    description: '各类学习资料，包括教程、教材等'
  },
  {
    name: '悬疑小说',
    slug: 'mystery-novels',
    description: '悬疑、侦探小说'
  },
  {
    name: '历史小说',
    slug: 'historical-novels',
    description: '以历史为背景的小说'
  },
  {
    name: '人文历史',
    slug: 'humanities-history',
    description: '历史、文化、哲学等人文类书籍'
  }
];

// ========================
// 标签数据（完整版）
// ========================
const tags = [
  // 游戏攻略标签
  { name: "Switch游戏", slug: "switch-games" },
  { name: "PC游戏", slug: "pc-games" },
  { name: "手游攻略", slug: "mobile-game-guides" },
  { name: "竞技游戏", slug: "competitive-games" },
  { name: "角色扮演游戏", slug: "role-playing-games" },
  { name: "独立游戏", slug: "indie-games" },
  { name: "游戏开发", slug: "game-development" },

  // 学习笔记标签
  { name: "前端框架", slug: "frontend-frameworks" },
  { name: "后端开发", slug: "backend-development" },
  { name: "数据库知识", slug: "database-knowledge" },
  { name: "算法学习", slug: "algorithm-learning" },
  { name: "编程语言", slug: "programming-languages" },
  { name: "系统设计", slug: "system-design" },
  { name: "数据结构", slug: "data-structures" },

  // 动漫相关标签
  { name: "经典番剧", slug: "classic-anime" },
  { name: "新番推荐", slug: "new-anime-recommendations" },
  { name: "动漫角色", slug: "anime-characters" },
  { name: "动漫类型", slug: "anime-genres" },
  { name: "动漫制作", slug: "anime-production" },
  { name: "声优情报", slug: "voice-actor-info" },

  // 生活百科标签
  { name: "家居整理", slug: "home-organization" },
  { name: "美食烹饪", slug: "food-cooking" },
  { name: "健康养生", slug: "health-and-wellness" },
  { name: "旅游攻略", slug: "travel-guides" },
  { name: "宠物饲养", slug: "pet-raising" },
  { name: "理财知识", slug: "financial-literacy" },

  // 阅读相关标签
  { name: "文学经典", slug: "literary-classics" },
  { name: "现代小说", slug: "modern-novels" },
  { name: "历史书籍", slug: "historical-books" },
  { name: "科普读物", slug: "popular-science-books" },
  { name: "哲学著作", slug: "philosophical-works" },
  { name: "心理学", slug: "psychology" },

  // 技术面试标签
  { name: "技术面试", slug: "technical-interviews" },
  { name: "HR面试", slug: "hr-interviews" },
  { name: "笔试技巧", slug: "written-exam-skills" },
  { name: "面试经验", slug: "interview-experience" },
  { name: "薪资谈判", slug: "salary-negotiation" },

  // 项目相关标签
  { name: "个人项目", slug: "personal-projects" },
  { name: "团队项目", slug: "team-projects" },
  { name: "开源项目", slug: "open-source-projects" },
  { name: "项目管理", slug: "project-management" },
  { name: "架构设计", slug: "architecture-design" },

  // 其他分类标签
  { name: "教材", slug: "textbook" },
  { name: "教程", slug: "tutorial" },
  { name: "悬疑", slug: "mystery" },
  { name: "历史", slug: "history" },
  { name: "文化", slug: "culture" },
  { name: "艺术", slug: "art" },
  { name: "音乐", slug: "music" },
  { name: "电影", slug: "movie" },
  { name: "科技动态", slug: "tech-news" }
];

// ========================
// 数据初始化函数
// ========================
async function seedData() {
  console.log('🌱 开始初始化数据...');

  // 1. 初始化分类
  console.log('▸ 正在初始化分类...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }

  // 2. 初始化标签（分批处理）
  console.log('▸ 正在初始化标签...');
  const BATCH_SIZE = 5;
  for (let i = 0; i < tags.length; i += BATCH_SIZE) {
    const batch = tags.slice(i, i + BATCH_SIZE);
    await prisma.$transaction(
      batch.map(tag =>
        prisma.tag.upsert({
          where: { slug: tag.slug },
          update: {},
          create: tag
        })
      )
    );
    console.log(`  已处理 ${Math.min(i + BATCH_SIZE, tags.length)}/${tags.length} 个标签`);
  }

  // 3. 初始化管理员
  console.log('▸ 正在初始化管理员...');
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'defaultPassword123';

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' }
  });

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      passwordHash,
      roles: { connect: { id: adminRole.id } }
    },
    create: {
      username: 'admin',
      email: ADMIN_EMAIL,
      passwordHash,
      roles: { connect: { id: adminRole.id } },
      isVerified: true
    }
  });

  console.log('✅ 数据初始化完成');
}

// ========================
// 主函数
// ========================
async function main() {
  try {
    console.log('🚀 开始数据库初始化流程');
    await safeResetDatabase();
    await seedData();
    console.log('🎉 所有数据初始化成功！');
  } catch (error) {
    console.error('❌ 初始化过程中出错:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();