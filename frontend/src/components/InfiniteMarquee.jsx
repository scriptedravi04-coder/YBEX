import React from 'react';

const gifs = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif',
  'https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
];

const doubledGifs = [...gifs, ...gifs];

export default function InfiniteMarquee() {
  return (
    <section className="bg-white py-16 w-full overflow-hidden flex">
      <div className="animate-marquee-css flex whitespace-nowrap">
        {doubledGifs.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Studio Work ${idx + 1}`}
            className="h-[280px] md:h-[500px] w-auto object-cover mx-3 rounded-2xl shadow-lg flex-shrink-0"
          />
        ))}
      </div>
    </section>
  );
}
