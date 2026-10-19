import { useEffect, useMemo, useState } from 'react'
import articles from './data/articles'
import ArticleCard from './components/ArticleCard'
import KeywordSidebar from './components/KeywordSidebar'

const normalize = (str) => str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const allCategories = [...new Set(articles.flatMap((a) => a.categories))].sort()

const allRubriques = [...new Set(articles.map((a) => a.rubrique))].sort()

const allKeywords = Object.entries(
  articles
    .flatMap((a) => a.motsCles)
    .reduce((acc, mot) => ({ ...acc, [mot]: (acc[mot] || 0) + 1 }), {}),
)
  .map(([mot, count]) => ({ mot, count }))
  .sort((a, b) => a.mot.localeCompare(b.mot, 'fr'))

const loadLikes = () => {
  try {
    return JSON.parse(localStorage.getItem('likes')) || []
  } catch {
    return []
  }
}

function App() {
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState([])
  const [activeRubrique, setActiveRubrique] = useState('')
  const [activeKeyword, setActiveKeyword] = useState('')
  const [likes, setLikes] = useState(loadLikes)
  const [onlyLiked, setOnlyLiked] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('likes', JSON.stringify(likes))
    } catch {}
  }, [likes])

  const toggleLike = (id) => {
    setLikes((prev) => (prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]))
  }

  const toggleKeyword = (mot) => {
    setActiveKeyword((prev) => (prev === mot ? '' : mot))
  }

  const toggleCategory = (cat) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  const resetFilters = () => {
    setSearch('')
    setActiveCategories([])
    setActiveRubrique('')
    setActiveKeyword('')
    setOnlyLiked(false)
  }

  const filteredArticles = useMemo(() => {
    const query = normalize(search.trim())

    return articles.filter((article) => {
      const matchCategories = activeCategories.every((cat) => article.categories.includes(cat))

      const searchable = normalize(
        [article.titre, article.texte, ...article.motsCles, ...article.categories].join(' '),
      )
      const matchSearch = query === '' || searchable.includes(query)

      const matchRubrique = activeRubrique === '' || article.rubrique === activeRubrique
      const matchKeyword = activeKeyword === '' || article.motsCles.includes(activeKeyword)
      const matchLiked = !onlyLiked || likes.includes(article.id)

      return matchCategories && matchSearch && matchRubrique && matchKeyword && matchLiked
    })
  }, [search, activeCategories, activeRubrique, activeKeyword, onlyLiked, likes])

  const hasFilters =
    search !== '' ||
    activeCategories.length > 0 ||
    activeRubrique !== '' ||
    activeKeyword !== '' ||
    onlyLiked

  return (
    <div className="min-h-screen">
      <header className="bg-stone-900 text-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
            Le Carnet
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Idées, recettes & voyages
          </h1>
          <p className="mt-3 max-w-xl text-stone-300">
            {articles.length} articles sur le développement, la cuisine, le sport, la culture et
            bien plus. Recherchez ou filtrez par catégorie.
          </p>

          <div className="relative mt-8 max-w-xl">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un titre, un mot clé, une catégorie…"
              className="w-full rounded-full bg-white py-3 pl-12 pr-4 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
            />
          </div>

          <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-stone-700 text-sm">
            {['', ...allRubriques].map((rub) => (
              <button
                key={rub || 'all'}
                type="button"
                onClick={() => setActiveRubrique(rub)}
                className={`-mb-px border-b-2 pb-2 font-medium transition ${
                  activeRubrique === rub
                    ? 'border-amber-400 text-white'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                {rub || 'Toutes les rubriques'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_16rem]">
        <section className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategories([])}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCategories.length === 0
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 ring-1 ring-stone-300 hover:bg-stone-100'
              }`}
            >
              Toutes
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeCategories.includes(cat)
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-stone-700 ring-1 ring-stone-300 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOnlyLiked((v) => !v)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                onlyLiked
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50'
              }`}
            >
              ♥ Mes favoris ({likes.length})
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-stone-500">
            <span>
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé
              {filteredArticles.length > 1 ? 's' : ''}
            </span>
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="font-medium text-amber-700 hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>

          {filteredArticles.length > 0 ? (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onCategoryClick={toggleCategory}
                  activeCategories={activeCategories}
                  onKeywordClick={toggleKeyword}
                  activeKeyword={activeKeyword}
                  liked={likes.includes(article.id)}
                  onLike={toggleLike}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border-2 border-dashed border-stone-300 p-12 text-center">
              <p className="font-display text-2xl text-stone-700">Aucun article trouvé</p>
              <p className="mt-2 text-stone-500">Essayez un autre mot ou retirez des catégories.</p>
            </div>
          )}
        </section>

        <KeywordSidebar
          keywords={allKeywords}
          activeKeyword={activeKeyword}
          onKeywordClick={toggleKeyword}
        />
      </main>

      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
        Le Carnet — exercice React · Vite · Tailwind CSS
      </footer>
    </div>
  )
}

export default App
