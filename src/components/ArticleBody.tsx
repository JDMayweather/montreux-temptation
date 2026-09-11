import { FULL_ARTICLE } from "../data/fullArticle";

export default function ArticleBody(): React.JSX.Element {
  const [title, ...rest] = FULL_ARTICLE;
  return (
    <section className="chapter chapter-fulltext" id="full-text">
      <div style={{ maxWidth: "68ch", margin: "0 auto" }}>
        <h2>Full text</h2>
        <h2>{title}</h2>
        {rest.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
