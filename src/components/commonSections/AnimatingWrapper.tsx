import React, { PropsWithChildren, useEffect, useRef, useState } from "react";

const transitionStyles = {
  "fade-in": {
    opacity: 0,
    transition: "opacity 1s, transform 1s cubic-bezier(.57,.21,0.69,1.25)",
    transform: "translateY(50px)",
  },
  "slide-in": {
    opacity: 0.5,
    transition: "opacity 1s, transform 1s ease-in-out",
    transform: "translateY(50px)",
  },
  "scale-in": {
    opacity: 0,
    transition: "opacity 1s, transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    transform: "scale(0.9)",
  },
  "rotate-in": {
    opacity: 0,
    transition: "opacity 1s, transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    transform: "rotate(-10deg)",
  },
  "slide-from-right": {
    opacity: 0,
    transition: "opacity 1s, transform 1s ease-in-out",
    transform: "translateX(100px)",
  },
  "slide-from-left": {
    opacity: 0,
    transition: "opacity 1s, transform 1s ease-in-out",
    transform: "translateX(-100px)",
  },
  "zoom-in": {
    opacity: 0,
    transition: "opacity 0.5s, transform 0.5s ease-out",
    transform: "scale(0.6)",
  },
  "reveal-from-top": {
    opacity: 0,
    transition: "opacity 1s, transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    transform: "translateY(-100%)",
  },
  "expand-from-top": {
    opacity: 0,
    transition: "opacity 1s, transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    transform: "scaleY(0)",
  },
};

function AnimatingWrapper({
  index = 0,
  children,
  transitionType = "fade-in",
  immediate = false,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(immediate);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current; 
    
    // If immediate is true, set visible immediately
    if (immediate) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        root: null,
        rootMargin: "-10% 0px -10% 0px", // Trigger when element is 10% into viewport
        threshold: 0.1, // Trigger when 10% of element is visible
      }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [immediate]);

  const getInitialTransform = () => {
    const baseOffset = index * 50 + 50;
    switch (transitionType) {
      case "fade-in":
        return `translateY(${baseOffset}px)`;
      case "slide-in":
        return `translateY(${baseOffset}px)`;
      case "scale-in":
        return `scale(0.9)`;
      case "rotate-in":
        return `rotate(-10deg)`;
      case "slide-from-right":
        return `translateX(100px)`;
      case "slide-from-left":
        return `translateX(-100px)`;
      case "zoom-in":
        return `scale(0.6)`;
      case "reveal-from-top":
        return `translateY(${baseOffset}px)`;
      case "expand-from-top":
        return `scaleY(0)`;
      default:
        return `translateY(${baseOffset}px)`;
    }
  };

  const style = {
    ...transitionStyles[transitionType],
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0) translateY(0) scale(1) rotate(0deg)" : getInitialTransform(),
  };

  const NewChild = React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      ref: elementRef,
      style: { ...child.props.style, ...style },
    });
  });

  return NewChild;
}

export default AnimatingWrapper;
