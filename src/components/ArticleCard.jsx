const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

function ArticleCard({
  article,
  onCategoryClick,
  activeCategories,
  onKeywordClick,
  activeKeyword,
  liked,
  onLike,
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
        <img
          src={article.image}
          alt={article.titre}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {article.rubrique}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          {article.categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryClick(cat)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                activeCategories.includes(cat)
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 className="font-display text-xl font-semibold leading-snug text-stone-900">
          {article.titre}
        </h2>

        <p className="line-clamp-3 text-sm leading-relaxed text-stone-600">{article.texte}</p>

        <div className="flex flex-wrap gap-1.5">
          {article.motsCles.map((mot) => (
            <button
              key={mot}
              type="button"
              onClick={() => onKeywordClick(mot)}
              className={`text-xs transition hover:text-stone-900 ${
                activeKeyword === mot ? 'font-semibold text-stone-900' : 'text-stone-400'
              }`}
            >
              #{mot}
            </button>
          ))}
        </div>

        <footer className="mt-auto flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-500">
          <span className="font-medium text-stone-700">{article.auteur}</span>
          <div className="flex items-center gap-3">
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <button
              type="button"
              onClick={() => onLike(article.id)}
              aria-pressed={liked}
              aria-label={liked ? "Je n'aime plus" : "J'aime"}
              className={`rounded-full p-1.5 transition active:scale-125 ${
                liked ? 'text-rose-500' : 'text-stone-300 hover:text-rose-400'
              }`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </article>
  )
}

export default ArticleCard
