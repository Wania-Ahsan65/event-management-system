function CategoryBar({ categories, selected, onSelect }) {
  const list = categories.filter((c) => c !== 'Undefined')
  return (
    <div className="category-bar">
      <button className={!selected ? 'chip active' : 'chip'} onClick={() => onSelect('')}>
        All
      </button>
      {list.map((c) => (
        <button
          key={c}
          className={selected === c ? 'chip active' : 'chip'}
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
    </div>
  )
}

export default CategoryBar