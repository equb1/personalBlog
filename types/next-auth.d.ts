// types/next-auth.d.ts
import 'next-auth'

// declare module 'next-auth' {
//   interface User {
//     roles?: string[]
//   }

//   interface Session {
//     user?: {
//       id: string
//       name?: string | null
//       email?: string | null
//       image?: string | null
//       roles?: string[]
//     }
//   }
//   interface User extends AdapterUser {
//     username: string; // 添加 username 属性
//   }
// }