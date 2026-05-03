import { RiSearchLine } from "react-icons/ri";

export default function SearchBar({ onSearch }) {
  function handleChange(e) {
    onSearch(e.target.value);
  }

  return (
    <div className="search-wrap">
      <RiSearchLine className="search-icon" />
      <input
        type="text"
        placeholder="Search..."
        onChange={handleChange}
        className="search-input"
      />
    </div>
  );
}