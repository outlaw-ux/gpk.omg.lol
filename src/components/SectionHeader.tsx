type SectionHeaderProps = {
  id: string;
  overline: string;
  title: string;
  description: string;
};

export function SectionHeader({ id, overline, title, description }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <p className="section-overline">{overline}</p>
      <h2 className="section-header__title" id={id}>
        {title}
      </h2>
      <p className="section-header__description">{description}</p>
    </div>
  );
}
