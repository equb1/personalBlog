// hooks/useHeadings.ts
import { useState, useEffect, useRef } from 'react';

export default function useHeadings(htmlContent: string) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!htmlContent) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headingElements = Array.from(doc.querySelectorAll('h1, h2, h3'));

    let index = 0;
    const newHeadings = headingElements.map((heading) => {
      const baseId = heading.textContent
        ?.toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')  // 支持中文
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || `heading-${index++}`;

      return {
        id: baseId,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1))
      };
    });

    setHeadings(newHeadings);
  }, [htmlContent]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const visibleHeadings = entries
              .filter(e => e.isIntersecting)
              .map(e => ({
                id: e.target.id,
                ratio: e.intersectionRatio,
                top: e.boundingClientRect.top
              }));

            const closest = visibleHeadings.reduce((prev, curr) => {
              return Math.abs(curr.top) < Math.abs(prev.top) ? curr : prev;
            });

            setActiveId(closest.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    observerRef.current = observer;

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);

  return { headings, activeId };
}
