function KeywordSidebar({ keywords, activeKeyword, onKeywordClick }) {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-stone-900">Mots clés</h2>
          {activeKeyword && (
            <button
              type="button"
              onClick={() => onKeywordClick(activeKeyword)}
              className="text-xs font-medium text-amber-700 hover:underline"
            >
              Effacer
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-stone-500">{keywords.length} mots clés</p>

        <ul className="mt-4 flex flex-wrap gap-1.5 lg:max-h-[70vh] lg:overflow-y-auto">
          {keywords.map(({ mot, count }) => (
            <li key={mot}>
              <button
                type="button"
                onClick={() => onKeywordClick(mot)}
                className={`rounded-md px-2 py-1 text-xs transition ${
                  activeKeyword === mot
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                #{mot} <span className="opacity-60">{count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default KeywordSidebar
