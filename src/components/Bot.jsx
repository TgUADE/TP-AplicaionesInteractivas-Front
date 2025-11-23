import { useEffect } from "react";

const Bot = () => {
  useEffect(() => {
    // Cargar el script de Typebot
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3/dist/web.js'
      
      Typebot.initBubble({
        typebot: "my-typebot-l5giher",
        apiHost: "https://typebot.io",
        theme: {
          button: {
            backgroundColor: "transparent",  // ← Sin fondo negro
            customIconSrc: "https://s3.typebot.io/public/workspaces/cmiam1zxo0007i6044k9eue7r/typebots/cmiam9usm0006jy041l5giher/bubble-icon?v=1763856839024",
            size: "medium",
          },
          placement: "right",
        },
      });
    `;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default Bot;