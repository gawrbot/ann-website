import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

interface IUseSearchProps<T> {
  dataSet: T[];
  keys: string[];
}

export default function useSearch<T>({ dataSet, keys }: IUseSearchProps<T>) {
  const [searchValue, setSearchValue] = useState('');

  const fuse = useMemo(() => {
    const options = {
      keys,
    };

    return new Fuse(dataSet, options);
  }, [dataSet, keys]);

  const results = useMemo(() => {
    if (!searchValue) return;

    const searchResults = fuse.search(searchValue);

    console.log('searchResults', searchResults);

    return searchResults.map((fuseResult) => fuseResult.item);
  }, [fuse, searchValue]);

  return {
    searchValue,
    setSearchValue,
    results,
  };
}
