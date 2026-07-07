import React from 'react';

const testimonialsData = [
  {
    name: 'Arjun Mehta',
    role: 'Founder, GrowthBox — Brand Partner',
    quote: 'YBEX helped us scale our influencer campaigns from scratch. Within 3 months, we saw a 6x ROI on our brand campaigns. Their creator network is unmatched.',
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Content Creator — 500K+ Followers',
    quote: 'As a creator, finding the right brand collaborations was always tough. YBEX connected me with brands that truly align with my content. My earnings doubled in just 2 months.',
    stars: 5,
  },
  {
    name: 'Rohit Kapoor',
    role: 'Marketing Head, FreshCart',
    quote: 'The YBEX team understands both the brand side and the creator side perfectly. They matched us with creators who genuinely resonated with our audience. Best marketing decision we made.',
    stars: 5,
  },
  {
    name: 'Sneha Iyer',
    role: 'Lifestyle Creator — 1M+ Reach',
    quote: 'YBEX is not just an agency — they are a growth partner. They handle everything from campaign planning to analytics. I just focus on creating great content.',
    stars: 5,
  },
  {
    name: 'Vikram Desai',
    role: 'CEO, NovaBrand Studios',
    quote: 'We partnered with YBEX for our product launch campaign. The results were incredible — 250M+ organic views and a 40% increase in brand awareness within weeks.',
    stars: 5,
  },
  {
    name: 'Ananya Reddy',
    role: 'Fashion Creator — Brand Ambassador',
    quote: 'YBEX supported me at every step — from negotiating deals to optimizing my content strategy. They truly care about creator growth, not just brand metrics.',
    stars: 5,
  },
  {
    name: 'Karan Malhotra',
    role: 'Co-founder, UrbanBite',
    quote: 'Working with YBEX transformed our digital presence completely. Their creator-first approach means the content feels authentic, and our customers can tell the difference.',
    stars: 5,
  },
  {
    name: 'Deepika Nair',
    role: 'Tech Creator — 300K+ Community',
    quote: 'The team at YBEX is incredibly professional and responsive. They matched me with tech brands that were a perfect fit. Every collaboration has been smooth and rewarding.',
    stars: 5,
  },
];

export default function TestimonialCarousel() {
  const doubleTestimonials = [...testimonialsData, ...testimonialsData, ...testimonialsData, ...testimonialsData];

  return (
    <section className="ganox-review-section py-20 w-full overflow-hidden flex flex-col items-center justify-center relative">
      <style>{`
        .ganox-review-section {
          background: #000000;
          position: relative;
          width: 100%;
        }

        .ganox-review-section::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.06) 0%, transparent 70%);
          top: -100px;
          left: -100px;
          filter: blur(90px);
          pointer-events: none;
          z-index: 1;
        }

        .ganox-review-section::after {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.04) 0%, transparent 70%);
          bottom: -100px;
          right: -100px;
          filter: blur(100px);
          pointer-events: none;
          z-index: 1;
        }

        .ganox-review-header {
          text-align: center;
          margin-bottom: 2.5rem;
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 20px;
        }

        .ganox-title-row-1 {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
          margin-bottom: 0.4rem;
        }

        .ganox-title-our {
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          font-weight: 400;
          color: transparent;
          -webkit-text-stroke: 1.5px #ffffff;
          text-transform: uppercase;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          margin-right: 0.6rem;
          letter-spacing: -0.02em;
        }

        .ganox-title-clients {
          font-size: clamp(2rem, 5.5vw, 3.5rem);
          font-weight: 900;
          color: #ffffff;
          text-transform: lowercase;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          letter-spacing: -0.03em;
        }

        .ganox-title-line-right {
          flex-grow: 1;
          height: 1.5px;
          background-color: rgba(255, 255, 255, 0.15);
          margin-left: 1rem;
        }

        .ganox-title-row-2 {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          padding-left: 2%;
          margin-top: -0.2rem;
        }

        .ganox-title-line-left {
          width: clamp(25px, 7vw, 50px);
          height: 1.5px;
          background-color: rgba(255, 255, 255, 0.15);
          margin-right: 1rem;
        }

        .ganox-title-story {
          font-size: clamp(2.2rem, 6vw, 3.6rem);
          font-family: 'Playfair Display', 'Georgia', serif;
          font-style: italic;
          color: #ffffff;
          text-transform: lowercase;
          margin-right: 0.6rem;
          line-height: 1;
        }

        .ganox-title-highlights {
          font-size: clamp(1.5rem, 4vw, 2.4rem);
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          letter-spacing: -0.01em;
        }

        .ganox-carousel-container {
          position: relative;
          width: 100vw;
          max-width: 100%;
          overflow: hidden;
          padding: 16px 0;
          z-index: 10;
        }

        .ganox-carousel-container::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 120px;
          background: linear-gradient(to right, #000000 0%, transparent 100%);
          z-index: 5;
          pointer-events: none;
        }

        .ganox-carousel-container::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 120px;
          background: linear-gradient(to left, #000000 0%, transparent 100%);
          z-index: 5;
          pointer-events: none;
        }

        .ganox-marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: ganox-marquee-scroll 60s linear infinite;
        }

        .ganox-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes ganox-marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ganox-review-card {
          width: 290px;
          min-height: 200px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(228, 241, 65, 0.1);
          border-radius: 16px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .ganox-review-card:hover {
          border-color: rgba(228, 241, 65, 0.3);
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(228, 241, 65, 0.05);
        }

        .card-stars-row {
          display: flex;
          gap: 3px;
          margin-bottom: 12px;
        }

        .card-star-icon {
          width: 13px;
          height: 13px;
          fill: #E4F141;
        }

        .card-quote-text {
          font-size: 0.82rem;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.75);
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          margin: 0 0 16px 0;
          font-weight: 400;
        }

        .card-reviewer-profile {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 14px;
        }

        .card-reviewer-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        }

        .card-reviewer-role {
          font-size: 0.68rem;
          color: rgba(255, 255, 255, 0.4);
          margin: 2px 0 0 0;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        }

        @media (max-width: 768px) {
          .ganox-review-card {
            width: 260px;
            padding: 18px;
          }
        }
      `}</style>

      {/* Header — ganox removed */}
      <div className="ganox-review-header">
        <div className="ganox-title-row-1">
          <span className="ganox-title-our">our</span>
          <span className="ganox-title-clients">clients</span>
          <span className="ganox-title-line-right"></span>
        </div>
        <div className="ganox-title-row-2">
          <span className="ganox-title-line-left"></span>
          <span className="ganox-title-story">story</span>
          <span className="ganox-title-highlights">HIGHLIGHTS</span>
        </div>
      </div>

      {/* Scrolling Carousel of cards */}
      <div className="ganox-carousel-container">
        <div className="ganox-marquee-track">
          {doubleTestimonials.map((item, idx) => (
            <div key={idx} className="ganox-review-card">
              <div>
                <div className="card-stars-row">
                  {[...Array(item.stars)].map((_, i) => (
                    <svg key={i} className="card-star-icon" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="card-quote-text">{item.quote}</p>
              </div>
              <div className="card-reviewer-profile">
                <div>
                  <h4 className="card-reviewer-name">{item.name}</h4>
                  <p className="card-reviewer-role">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
