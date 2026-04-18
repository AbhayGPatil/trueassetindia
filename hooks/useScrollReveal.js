'use client';

import { useEffect, useRef } from 'react';

export function useScrollReveal(options = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            },
            {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '0px 0px -50px 0px',
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [options.threshold, options.rootMargin]);

    return ref;
}

export function useStaggeredScrollReveal(count, baseDelay = 100) {
    const refs = useRef([]);

    useEffect(() => {
        const elements = refs.current.filter(Boolean);
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        elements.forEach((el, index) => {
            if (el) {
                el.style.transitionDelay = `${index * baseDelay}ms`;
                observer.observe(el);
            }
        });

        return () => {
            elements.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    }, [count, baseDelay]);

    return (index) => (el) => {
        refs.current[index] = el;
    };
}
