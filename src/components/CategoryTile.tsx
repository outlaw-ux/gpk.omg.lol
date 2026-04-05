import type { ResourceCategory } from '../types/content';

type CategoryTileProps = {
  category: ResourceCategory;
};

export function CategoryTile({ category }: CategoryTileProps) {
  return (
    <article className="category-tile" role="listitem">
      <div className="category-tile__topline">
        <p className="category-tile__count">{category.itemCountLabel}</p>
        <span className="category-tile__glyph" aria-hidden="true">
          +
        </span>
      </div>

      <h3>{category.name}</h3>
      <p className="category-tile__description">{category.description}</p>
    </article>
  );
}
