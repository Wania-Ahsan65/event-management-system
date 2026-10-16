function SearchBar({ value, onChange, placeholder = 'Search events, artists, teams...' }) {
  return (
    <input
      type="search"
      className="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label="Search events"
    />
  )
}

export default SearchBar