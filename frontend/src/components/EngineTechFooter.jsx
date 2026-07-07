import React from 'react';

export default function EngineTechFooter() {
  return (
    <footer className="site-footer-et w-full">
      {/* Drifting Dots strip */}
      <div className="footer-dots" aria-hidden="true">
        <div className="footer-dots__line"></div>
      </div>

      {/* Main Footer Contents */}
      <div className="site-footer__inner">

        {/* Top Grid */}
        <div className="site-footer__top">
          <div>
            <h2 className="site-footer__heading">
              Proven Advanced Propulsion Technology
            </h2>
          </div>

          {/* Nav Column 1 */}
          <nav className="site-footer__nav" aria-label="Footer navigation">
            <a href="#company">Company</a>
            <a href="#technology">Technology</a>
            <a href="#solutions">Solutions</a>
            <a href="#our-edge">Our Edge</a>
            <a href="#investors">Investors</a>
          </nav>

          {/* Nav Column 2 */}
          <nav className="site-footer__nav" aria-label="Company links">
            <a href="#our-team">Our Team</a>
            <a href="#news">News</a>
            <a href="#careers">Careers</a>
            <a href="#contact">Contact Us</a>
          </nav>

          {/* Nav Column 3 */}
          <nav className="site-footer__nav" aria-label="Social links">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              Follow Us on X
            </a>
          </nav>
        </div>

        {/* Brand Row */}
        <div className="site-footer__brand-row">
          <a href="/" className="site-footer__brand" aria-label="EngineTech home">
            {/* Brand Wordmark */}
            <span className="site-footer__wordmark">YBEX</span>
          </a>
        </div>

        {/* Legal Line */}
        <div className="site-footer__legal">
          <p>© 2026 YBEX All rights reserved.</p>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Use</a>
        </div>

      </div>
    </footer>
  );
}
