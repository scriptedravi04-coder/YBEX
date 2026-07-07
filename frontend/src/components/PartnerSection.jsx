import React, { useState, useRef } from 'react';
import useInViewAnimation from '../hooks/useInViewAnimation';

function resolveImg(url) {
  if (!url) return null;
  if (url.startsWith('/uploads/')) {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
      if (isIP && hostname !== '127.0.0.1') {
        return `http://${hostname}:5000${url}`;
      }
    }
    const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');
    return `${API_BASE}${url}`;
  }
  return url;
}

const gifImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif',
  'https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
];

export default function PartnerSection({ creators = [], brands = [] }) {
  const [sectionRef, isInView] = useInViewAnimation();
  const containerRef = useRef(null);
  const [spawns, setSpawns] = useState([]);
  const lastSpawnTime = useRef(0);

  // Collect actual creator images and brand logos uploaded from the admin panel
  const customImages = [];
  
  if (creators && creators.length > 0) {
    creators.forEach(c => {
      if (c.imageUrl) {
        const resolved = resolveImg(c.imageUrl);
        if (resolved) customImages.push(resolved);
      }
    });
  }
  
  if (brands && brands.length > 0) {
    brands.forEach(b => {
      if (b.logoUrl) {
        const resolved = resolveImg(b.logoUrl);
        if (resolved) customImages.push(resolved);
      }
    });
  }

  const displayTrailImages = customImages.length > 0 ? customImages : gifImages;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const now = Date.now();
    
    // Spawn at most every 80ms
    if (now - lastSpawnTime.current < 80) return;
    lastSpawnTime.current = now;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const randomRotation = Math.random() * 20 - 10; // -10 to +10 deg
    const randomImage = displayTrailImages[Math.floor(Math.random() * displayTrailImages.length)];
    const id = `${now}-${Math.random()}`;

    const newSpawn = {
      id,
      x,
      y,
      rotation: randomRotation,
      imgUrl: randomImage,
    };

    setSpawns((prev) => [...prev, newSpawn]);

    // Cleanup after 1000ms
    setTimeout(() => {
      setSpawns((prev) => prev.filter((item) => item.id !== id));
    }, 1000);
  };

  return (
    <section className="bg-black py-24 px-6 w-full flex justify-center border-t border-white/5">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="w-full max-w-7xl bg-[#0a0a0a] border border-white/5 rounded-[24px] md:rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.4)] py-20 md:py-48 px-4 md:px-6 flex flex-col items-center justify-center relative overflow-hidden cursor-crosshair select-none"
      >
        {/* Spawned thumbnails */}
        {spawns.map((spawn) => (
          <img
            key={spawn.id}
            src={spawn.imgUrl}
            alt="Hover Thumbnail"
            className="spawner-gif-preview"
            style={{
              left: `${spawn.x}px`,
              top: `${spawn.y}px`,
              transform: `translate(-50%, -50%) rotate(${spawn.rotation}deg)`,
            }}
          />
        ))}

        {/* Inner Content */}
        <div
          ref={sectionRef}
          className={`flex flex-col items-center text-center z-10 pointer-events-none ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <h2 className="font-mondwest text-[48px] md:text-[64px] lg:text-[80px] leading-tight text-white mb-12">
            Partner with us
          </h2>
        </div>
      </div>
    </section>
  );
}
