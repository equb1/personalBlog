import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ========================
// 安全数据库清理函数（Neon兼容版）
// ========================
async function safeResetDatabase() {
  try {
    console.log('🔄 开始清理数据库...');

    // 按从叶子到根的依赖顺序删除数据
    await prisma.$transaction([
      // 先删除所有关联表数据
      prisma.comment.deleteMany(),
      prisma.postTags.deleteMany(),
      prisma.like.deleteMany(),
      prisma.bookTags.deleteMany(),
      
      // 然后删除主表数据
      prisma.post.deleteMany(),
      prisma.book.deleteMany(),
      prisma.tag.deleteMany(),
      prisma.category.deleteMany(),
      prisma.user.deleteMany(),
      prisma.role.deleteMany(),
      prisma.activity.deleteMany(),
      prisma.carouselItem.deleteMany(),
      prisma.friendLink.deleteMany(),
      prisma.learningPath.deleteMany(),
      prisma.media.deleteMany(),
      prisma.page.deleteMany(),
      prisma.session.deleteMany(),
      prisma.subscriber.deleteMany(),
      prisma.verificationToken.deleteMany(),
      prisma.visitLog.deleteMany(),
    ]);

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
  { name: '学习笔记', slug: 'learning-notes', description: '知识学习与总结' },
  { name: '笔试面试', slug: 'interviews', description: '技术岗位面试经验' },
  { name: '项目实践', slug: 'projects', description: '项目实践经验总结' },
  { name: '游戏攻略', slug: 'games', description: '电子游戏攻略与技巧' },
  { name: '动漫观感', slug: 'anime-impressions', description: '动漫作品评价和推荐' },
  { name: '阅读笔记', slug: 'reading', description: '读书心得与书评' },
  { name: '生活杂谈', slug: 'life-miscellaneous', description: '日常生活话题分享' },
  { name: '书架', slug: 'book-shelf', description: '书籍分享与推荐' },
  { name: '技术视频', slug: 'tech-videos', description: '技术相关视频分享' },
  { name: '生活视频', slug: 'life-videos', description: '日常生活视频分享' },
  { name: '兴趣视频', slug: 'hobby-videos', description: '兴趣相关视频分享' },
  { name: '学习资料', slug: 'learning-materials', description: '各类学习资料' },
  { name: '悬疑小说', slug: 'mystery-novels', description: '悬疑侦探小说' },
  { name: '历史小说', slug: 'historical-novels', description: '历史背景小说' },
  { name: '人文历史', slug: 'humanities-history', description: '历史文化哲学书籍' }
];

// ========================
// 完整标签数据
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

  // 1. 初始化分类（批量处理）
  console.log('▸ 正在初始化分类...');
  await prisma.$transaction(
    categories.map(category =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      })
    )
  );

  // 2. 初始化标签（分批处理）
  console.log('▸ 正在初始化标签...');
  const BATCH_SIZE = 10;
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
  const ADMIN_EMAIL = "u94809@126.com";  // 你的管理员邮箱
  const ADMIN_PASSWORD = "90780cfy//";      // 你的管理员密码

  const [adminRole] = await prisma.$transaction([
    prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: { name: 'ADMIN' }
    }),
    prisma.role.upsert({
      where: { name: 'USER' },
      update: {},
      create: { name: 'USER' }
    })
  ]);

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      passwordHash,
      roles: { connect: { id: adminRole.id } }
    },
    create: {
      username: 'npcdyc',  // 管理员用户名
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