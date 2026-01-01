import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 🟢 Instantly scroll to the top-left of the window
    window.scrollTo(0, 0);
  }, [pathname]); // This triggers every time the URL changes

  return null;
};

export default ScrollToTop;