import { SearchIcon } from '@shared/ui/icons';
import { Input } from '@shared/ui/input/Input';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className={styles.wrapper}>
    <Input
      type="text"
      placeholder="Найти"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      icon={<SearchIcon />}
      name="search"
    />
  </div>
);
