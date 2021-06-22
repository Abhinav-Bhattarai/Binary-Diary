import React, { useState, useEffect } from "react";

export const useInteractionObserver = (
  refObject: React.RefObject<HTMLDivElement>
) => {
  const [element, setElement] = useState<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(
    () => {
      console.log('changed')
      setElement(refObject.current);
    }, // eslint-disable-next-line
    [refObject.current]
  );

  useEffect(() => {
    console.log('element useEffect')
    if (element) {
      const observer = new IntersectionObserver(
        ([entered]) => {
          console.log(entered.intersectionRatio)
          if (entered.isIntersecting) {
            setIsIntersecting(true);
          }
        },
        // rootmargin postcard height
        { threshold: 0 }
      );
      observer.observe(element);

      return () => observer.disconnect();
    }
  }, [element]);

  return isIntersecting;
};
