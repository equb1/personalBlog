import { remark } from 'remark'
import html from 'remark-html'
import prism from 'remark-prism'
import matter from 'gray-matter'
import { visit } from 'unist-util-visit'
import { Node } from 'unist'

// 定义 Code 类型
interface Code extends Node {
  type: 'code'
  lang?: string
  meta?: string
  value: string
  data?: {
    hProperties?: {
      className?: string
    }
  }
}

export async function processMarkdown(content: string) {
  const { data, content: mdContent } = matter(content)

  const processed = await remark()
    .use(prism as any)
    .use(html, { sanitize: false })
    .use(() => (tree) => {
      visit(tree, 'code', (node) => {
        // 强制将 node 断言为 'Code' 类型
        const codeNode = node as Code

        // 确保 data 存在并初始化
        codeNode.data = codeNode.data || {}

        // 如果 lang 存在，设置 hProperties
        if (codeNode.lang) {
          codeNode.data.hProperties = {
            className: `language-${codeNode.lang}`
          }
        }
      })
    })
    .process(mdContent)

  return {
    metadata: data,
    content: processed.toString()
  }
}
