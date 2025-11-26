import './SearchBar.css';

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "Search..." }) => {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="search-clear"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;

