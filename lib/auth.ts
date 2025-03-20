import NextAuth, { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      image: string;
      accessToken: any;
      id: string;
      username: string;
      email: string;
      roles: string[];
    };
  }

  interface User {
    id: string;
    username: string;
    roles: string[];   // 自定义字段
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    roles: string[];
  }
}

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('用户名和密码不能为空');
        }

        // 获取用户，并包含角色信息
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          include: { roles: true }, // 假设 roles 是多对多关系
        });

        if (!user || !user.passwordHash) {
          throw new Error('用户不存在或密码错误');
        }

        // 校验密码
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error('密码错误');
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles.map(role => role.name), // 提取角色名称
        } as User;
      },
    }),
  ],
  // Adding accessToken to JWT
callbacks: {
  async jwt({ token, user }: { token: JWT, user?: User }) {
    if (user) {
      // Store user information in the JWT
      token.id = user.id;
      token.username = user.username;
      token.roles = user.roles || [];
      // Add accessToken to the JWT (or generate it if needed)
      token.accessToken = 'someAccessToken'; // You can replace this with the actual token if needed
    }
    return token;
  },

  // Adding accessToken to session from JWT
  async session({ session, token }: { session: Session, token: JWT }) {
    session.user = {
      id: token.id,
      username: token.username,
      email: token.email!,
      roles: token.roles,
      accessToken: token.accessToken, // Ensure the accessToken is added here
    };
    return session;
  },
},

  session: {
    strategy: 'jwt' as const, // Ensure this is typed correctly
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  pages: {
    signIn: '/auth/login', // 自定义登录页面
    error: '/auth/error', // 自定义错误页面
  },
  secret: process.env.NEXTAUTH_SECRET || 'default_secret', // 处理没有 SECRET 的情况
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      },
    },
  },
};

export default NextAuth(authOptions);
