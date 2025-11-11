import { useEffect } from 'react';

export const LiveChat = () => {
  useEffect(() => {
    // Tawk.to Live Chat Integration
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/678f1d34af5bfec1dbe25bd1/1ii9pej4e';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return null;
};
