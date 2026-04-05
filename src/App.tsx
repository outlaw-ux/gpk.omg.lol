import { HeroSection } from './components/HeroSection';
import { ResourceCard } from './components/ResourceCard';
import { SectionHeader } from './components/SectionHeader';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import {
  featuredResources,
  footerLinks,
  heroActions,
  navigationLinks,
  siteMeta
} from './data/siteContent';

function App() {
  return (
    <div className="app-shell" id="top">
      <SiteHeader
        brandName={siteMeta.name}
        emblemSrc={siteMeta.emblemSrc}
        navigationLinks={navigationLinks}
      />

      <main className="page-content">
        <HeroSection
          eyebrow={siteMeta.eyebrow}
          title={siteMeta.heroTitle}
          description={siteMeta.heroDescription}
          primaryCta={{ href: '#resources', label: 'Browse All Links' }}
          secondaryCta={{
            href: 'https://docs.google.com/forms/d/e/1FAIpQLScVFoit_V1vJvJwFbnbNaSuuChJcNO2ukPNXXIfB-WGyIOS7A/viewform?usp=sharing&ouid=114588655259468960497',
            label: 'Send a Want List'
          }}
          actions={heroActions}
        />

        <section className="content-section" id="resources" aria-labelledby="featured-heading">
          <div className="shell">
            <SectionHeader
              id="featured-heading"
              overline="The Stack"
              title="The tabs that earn their spot."
              description="Reference first, impulse later. These are the stops for set work, hobby coverage, comp checks, seller traffic, and shipping."
            />

            <div className="resource-grid" role="list">
              {featuredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        domain={siteMeta.domain}
        emblemSrc={siteMeta.emblemSrc}
        links={footerLinks}
      />
    </div>
  );
}

export default App;
