import React, { useMemo } from 'react';
import { getChickenAssets } from '../../utils/assetResolver';

const ChickenVisual = ({ chicken, dayCount, overrideStatus = null, className = '' }) => {
  // Memoiza os assets para evitar recálculos desnecessários
  const assets = useMemo(() => {
    return getChickenAssets(chicken, dayCount || 0, overrideStatus);
  }, [chicken, dayCount, overrideStatus]);

  // Ajuste de escala específico para o Alien devido ao viewBox desproporcional do SVG (muito largo)
  // E adiciona um contorno preto (outline) para destacar o personagem
  const outlineFilter = 'drop-shadow(2px 0 0 #000) drop-shadow(-2px 0 0 #000) drop-shadow(0 2px 0 #000) drop-shadow(0 -2px 0 #000)';
  
  const contentStyle = {
    // SVGs corrigidos (viewBox 471x423), não precisa mais de escala manual
    // ...(chicken.type === 'alien' ? { transform: 'scale(2.0) translateY(-15%)' } : {}),
    filter: outlineFilter
  };

  return (
    <div className={`relative w-24 h-24 flex items-center justify-center ${className}`}>
      <div className="relative w-full h-full" style={contentStyle}>
      {/* 1. LEGS (Z-10) */}
      {assets.legs && (
        <img 
          src={assets.legs} 
          alt="legs" 
          className="absolute inset-0 w-full h-full object-contain z-10" 
        />
      )}

      {/* 2. WINGS (Z-15) */}
      {assets.wings && (
        <img 
          src={assets.wings} 
          alt="wings" 
          className="absolute inset-0 w-full h-full object-contain z-15" 
        />
      )}

      {/* 3. BODY (Z-20) */}
      {assets.body && (
        <img 
          src={assets.body} 
          alt="body" 
          className="absolute inset-0 w-full h-full object-contain z-20" 
        />
      )}

      {/* 4. BODY ADDONS (Z-25) */}
      {assets.addonBody && (
        <img 
          src={assets.addonBody} 
          alt="body addon" 
          className="absolute inset-0 w-full h-full object-contain z-25" 
        />
      )}

      {/* 5. EYES (Z-30) */}
      {assets.eyes && (
        <img 
          src={assets.eyes} 
          alt="eyes" 
          className="absolute inset-0 w-full h-full object-contain z-30" 
        />
      )}

      {/* 6. HEAD ADDONS (Z-40) */}
      {assets.addonHead && (
        <img 
          src={assets.addonHead} 
          alt="head addon" 
          className="absolute inset-0 w-full h-full object-contain z-40" 
        />
      )}

      {/* 7. FX (Z-50) */}
      {assets.fx && (
        <img 
          src={assets.fx} 
          alt="fx" 
          className="absolute inset-0 w-full h-full object-contain z-50 animate-pulse" 
        />
      )}
      </div>
    </div>
  );
};

export default ChickenVisual;
