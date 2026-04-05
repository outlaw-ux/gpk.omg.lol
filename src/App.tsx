import * as Separator from '@radix-ui/react-separator';
import { CategoryTile } from './components/CategoryTile';
import { HeroSection } from './components/HeroSection';
import { ResourceCard } from './components/ResourceCard';
import { SectionHeader } from './components/SectionHeader';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import {
  featuredResources,
  footerLinks,
  heroHighlights,
  navigationLinks,
  resourceCategories,
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
          logoSrc={siteMeta.logoSrc}
          eyebrow={siteMeta.eyebrow}
          title={siteMeta.heroTitle}
          description={siteMeta.heroDescription}
          primaryCta={{ href: '#resources', label: 'Browse Resources' }}
          secondaryCta={{
            href: 'https://docs.google.com/forms/d/e/1FAIpQLScVFoit_V1vJvJwFbnbNaSuuChJcNO2ukPNXXIfB-WGyIOS7A/viewform?usp=sharing&ouid=114588655259468960497',
            label: 'Request an Item'
          }}
          highlights={heroHighlights}
        />

        <section className="content-section" id="resources" aria-labelledby="featured-heading">
          <div className="shell">
            <SectionHeader
              id="featured-heading"
              overline="Featured Resources"
              title="Useful starting points for pricing, tracking, and smarter trading."
              description="The first release focuses on dependable reference links. Each card is data-driven so the site can grow into searchable entries, featured picks, and richer metadata later."
            />

            <div className="resource-grid" role="list">
              {featuredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </section>

        <Separator.Root decorative className="section-divider shell-divider" />

        <section className="content-section" id="categories" aria-labelledby="categories-heading">
          <div className="shell">
            <SectionHeader
              id="categories-heading"
              overline="Collection Lanes"
              title="Category tiles built to expand into a real library."
              description="Each lane is framed like a future section: clear now, but ready for tags, searchable entries, featured lists, and submission workflows."
            />

            <div className="category-grid" role="list">
              {resourceCategories.map((category) => (
                <CategoryTile key={category.id} category={category} />
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
