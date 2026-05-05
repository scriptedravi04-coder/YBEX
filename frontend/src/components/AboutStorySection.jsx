import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  aboutFounders,
  aboutJoinStrip,
  aboutPowerhouse,
  aboutStats,
  aboutTimeline,
} from '../content/siteData';

export default function AboutStorySection() {
  const [viewCount, setViewCount] = useState(47804210);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <>
      <section className="section-block about-story-hero">
        <div className="container">
          <motion.div
            className="about-hero-shell"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="about-story-title">
              The <span>YBEX</span> Story
            </h1>

            <div className="about-big-stat">
              <strong>{formatNumber(viewCount)}</strong>
              <p>{aboutStats[0].label}</p>
            </div>

            <div className="about-mini-stats">
              {aboutStats.slice(1).map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-block about-story-journey">
        <div className="container about-timeline-shell">
          {aboutTimeline.map((item, index) => (
            <motion.article
              key={item.title}
              className={`about-timeline-row ${index % 2 ? 'is-reverse' : ''}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              <div className="about-timeline-copy">
                <span className="about-phase">{item.phase}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="about-timeline-rule">
                  <span>{item.icon}</span>
                </div>
              </div>

              {index === 1 ? (
                <div className="about-growth-logos">
                  {item.images.map((image, imageIndex) => (
                    <div key={image} className={`about-logo-card about-logo-card-${imageIndex + 1}`}>
                      <img src={image} alt={`${item.title} ${imageIndex + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              ) : index === 2 ? (
                <div className="about-present-media">
                  {item.images.map((image, imageIndex) => (
                    <motion.div
                      key={image}
                      className={`about-office-card about-office-card-${imageIndex + 1}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: imageIndex * 0.1 }}
                    >
                      <img src={image} alt={`${item.title} ${imageIndex + 1}`} loading="lazy" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="about-timeline-media">
                  {item.images.map((image, imageIndex) => (
                    <div key={image} className={`about-pill-image about-pill-image-${imageIndex + 1}`}>
                      <img src={image} alt={`${item.title} ${imageIndex + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-block about-team-premium">
        <div className="container">
          <motion.div
            className="about-team-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="about-section-display">The Visionaries</h2>
            <div className="about-team-meta">
              <p className="section-subtitle">The Founders of YBEX</p>
              <div className="about-active-force">
                <span />
                Active Force
              </div>
            </div>
          </motion.div>

          <div className="team-grid founders-grid">
            {aboutFounders.map((member, index) => (
              <motion.article
                key={member.name}
                className="team-member"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
              >
                <div className="team-photo">
                  <img src={member.image} alt={member.name} loading="lazy" />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </motion.article>
            ))}
          </div>

          <motion.div
            className="about-team-heading team-header-secondary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="about-section-display">Our Powerhouse</h2>
            <div className="about-team-meta">
              <p className="section-subtitle">Meet the creatives behind the scenes</p>
            </div>
          </motion.div>

          <div className="team-grid team-grid-powerhouse">
            {aboutPowerhouse.map((member, index) => (
              <motion.article
                key={member.name}
                className="team-member"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
              >
                <div className="team-photo">
                  <img src={member.image} alt={member.name} loading="lazy" />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block about-join-section">
        <div className="container">
          <motion.div
            className="about-join-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="about-join-line" />
            <h2>
              You can also be a part of <span>YBEX</span>
            </h2>
            <Link to="/contact" className="button button-primary join-team-btn">
              Apply Now
            </Link>
          </motion.div>

          <div className="about-join-strip">
            {[...aboutJoinStrip, ...aboutJoinStrip].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
