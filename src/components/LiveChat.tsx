import { useEffect } from 'react';

export const LiveChat = () => {
  useEffect(() => {
    // Prevent duplicate script injection
    if (document.getElementById('tawk-script')) {
      return;
    }

    // Tawk.to Live Chat Integration with your account
    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.async = true;
    script.src = 'https://embed.tawk.to/6914ecdf2d4cd1195c7aa742/1j9srqie9';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    script.onload = () => {
      console.log('✅ Live chat loaded successfully');
    };

    script.onerror = () => {
      console.error('❌ Failed to load live chat');
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.getElementById('tawk-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      // Remove Tawk widget from DOM
      const tawkWidget = document.getElementById('tawkId');
      if (tawkWidget) {
        tawkWidget.remove();
      }
    };
  }, []);

  return null;
};
