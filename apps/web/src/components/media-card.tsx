type MediaCardProps = {
  src: string;
  alt: string;
  kicker: string;
  title: string;
  caption: string;
  mode?: string;
  compact?: boolean;
};

export function MediaCard({
  src,
  alt,
  kicker,
  title,
  caption,
  mode = "loop",
  compact = false
}: MediaCardProps) {
  return (
    <figure className={`media-card ${compact ? "media-card-compact" : ""}`}>
      <div className="media-frame">
        <img src={src} alt={alt} />
        <div className="media-hud">
          <span>{mode}</span>
          <span>agora visual system</span>
        </div>
      </div>
      <figcaption className="media-copy">
        <p className="eyebrow">{kicker}</p>
        <h3>{title}</h3>
        <p>{caption}</p>
      </figcaption>
    </figure>
  );
}
