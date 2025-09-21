'use client';

import React from 'react';
import { gsap } from 'gsap';

type FlowItem = {
  link: string;
  text: string;
  image: string;
};

interface FlowingMenuProps {
  items?: FlowItem[];
}

export default function FlowingMenu({ items = [] }: FlowingMenuProps) {
  return (
    <div className="w-full h-full overflow-hidden">
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem key={idx} index={idx} {...item} />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, image, index }: FlowItem & { index: number }) {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);
  const marqueeInnerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!marqueeRef.current || !marqueeInnerRef.current) return;
    
    // Animate marquee down
    gsap.to(marqueeRef.current, { y: '0%', duration: 0.4, ease: 'power2.out' });
    gsap.to(marqueeInnerRef.current, { x: '-50%', duration: 12, ease: 'none', repeat: -1 });
  };

  const handleMouseLeave = () => {
    if (!marqueeRef.current || !marqueeInnerRef.current) return;
    
    // Animate marquee up based on index (alternating direction)
    const edge = index % 2 === 0 ? 'top' : 'bottom';
    gsap.to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%', duration: 0.4, ease: 'power2.out' });
    gsap.to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' });
  };

  const repeatedMarqueeContent = Array.from({ length: 4 }).map((_, idx) => (
    <React.Fragment key={idx}>
      <span className="text-[#060010] uppercase font-normal text-[4vh] leading-[1.2] p-[1vh_1vw_0]">
        {text}
      </span>
      <div
        className="w-[200px] h-[7vh] my-[2em] mx-[2vw] p-[1em_0] rounded-[50px] bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
    </React.Fragment>
  ));

  return (
    <div
      className="flex-1 relative overflow-hidden text-center shadow-[0_-1px_0_0_#fff]"
      ref={itemRef}
    >
      <a
        className={[
          'flex items-center h-full w-full relative cursor-pointer uppercase no-underline font-semibold text-[#060010] text-[4vh] hover:text-[#060010] focus:text-[#060010] focus-visible:text-[#060010]',
          index % 2 === 0 ? 'justify-end text-right px-[16vw]' : 'justify-start text-left px-[16vw]'
        ].join(' ')}
        href={link}
        aria-label={text}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </a>
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-white translate-y-[101%]"
        ref={marqueeRef}
      >
        <div className="h-full w-[200%] flex" ref={marqueeInnerRef}>
          <div className="flex items-center relative h-full w-[200%] will-change-transform animate-marquee">
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
}
