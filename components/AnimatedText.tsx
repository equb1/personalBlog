import { useEffect, useRef } from 'react';

export default function AnimatedText({ children }: { children: string }) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 使用非空断言（!），确保 textRef.current 不为 null
    const element = textRef.current!;
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100);
  }, []);

  return <div ref={textRef} style={{ transition: 'opacity 0.5s ease, transform 0.5s ease' }}>{children}</div>;
}
