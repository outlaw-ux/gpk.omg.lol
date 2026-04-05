import type { ResourceEntry } from '../types/content';

type ResourceCardProps = {
  resource: ResourceEntry;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article
      className={`resource-card${resource.featured ? ' resource-card--featured' : ''}`}
      role="listitem"
    >
      <div className="resource-card__header">
        <p className="resource-card__category">{resource.category}</p>
        <span className="resource-card__status">{resource.status}</span>
      </div>

      <h3>{resource.title}</h3>
      <p className="resource-card__description">{resource.description}</p>

      <ul className="tag-list" aria-label={`${resource.title} topics`}>
        {resource.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <a
        className="resource-card__link"
        href={resource.href}
        target="_blank"
        rel="noreferrer"
      >
        {resource.ctaLabel}
      </a>
    </article>
  );
}
