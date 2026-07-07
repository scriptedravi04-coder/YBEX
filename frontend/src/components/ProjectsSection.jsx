import React from 'react';
import useInViewAnimation from '../hooks/useInViewAnimation';

const projects = [
  {
    name: 'evr',
    desc: 'From idea to millions raised for a web3 AI product',
    gif: 'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  },
  {
    name: 'Automation Machines',
    desc: 'Streamlining industrial automation processes',
    gif: 'https://motionsites.ai/assets/hero-automation-machines-preview-DlTveRIN.gif',
  },
  {
    name: 'xPortfolio',
    desc: 'Modern portfolio management platform',
    gif: 'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  },
];

function ProjectItem({ project, index }) {
  const [itemRef, isInView] = useInViewAnimation();

  return (
    <div
      ref={itemRef}
      className={`w-full flex flex-col gap-6 ${
        isInView ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Offset Text Block */}
      <div className="ml-4 md:ml-28">
        <h3 className="font-mondwest text-2xl md:text-3xl font-semibold text-[#051A24] mb-1">
          {project.name}
        </h3>
        <p className="text-sm md:text-base text-[#051A24]/70 font-neue-montreal font-medium">
          {project.desc}
        </p>
      </div>

      {/* Full-width Image */}
      <div className="w-full h-[300px] md:h-[500px] overflow-hidden rounded-2xl shadow-lg border border-slate-100 bg-slate-50">
        <img
          src={project.gif}
          alt={project.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section className="bg-white py-16 px-6 w-full flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col gap-16 md:gap-20">
        {projects.map((project, idx) => (
          <ProjectItem
            key={project.name}
            project={project}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
}
