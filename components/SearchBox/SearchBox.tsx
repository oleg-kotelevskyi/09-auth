import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (value: string) => void;
  value?: string;
  defaultValue?: string;
}

export const SearchBox = ({
  onChange,
  value,
  defaultValue,
}: SearchBoxProps) => {
  return (
    <div className={css.searchBox}>
      <input
        type="text"
        placeholder="Search notes..."
        className={css.input}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;
