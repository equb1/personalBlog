import type { MDXComponents } from 'mdx/types';
import CodePlayground from '@/components/CodePlayground';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    CodePlayground,
    pre: (props) => {
      const className = props.children?.props?.className || '';
      const isLive = className.includes('live');
      return isLive ? <CodePlayground {...props} /> : <pre {...props} />;
    }
  };
}