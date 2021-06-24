import React, { useState, useEffect } from "react";

export const useInteractionObserver = (
  refObject: React.RefObject<HTMLDivElement>
) => {
  const [element, setElement] = useState<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(
    () => {
      setElement(refObject.current);
    }, // eslint-disable-next-line
    [refObject.current]
  );

  useEffect(() => {
    if (element) {
      const observer = new IntersectionObserver(
        ([entered]) => {
          if (entered.isIntersecting) {
            setIsIntersecting(true);
          }
        },
        { threshold: 0, rootMargin: "100px" }
      );
      observer.observe(element);

      return () => observer.disconnect();
    }
  }, [element]);

  return isIntersecting;
};
