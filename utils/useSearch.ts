import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

interface IUseSearchProps<T> {
  dataSet: T[];
  keys: string[];
}

const SCORE_THRESHOLD = 0.01;

// Adapted from here: https://akashrajpurohit.com/blog/how-to-add-fuzzy-search-to-your-react-app-using-fusejs/#usesearch-hook, Thank you, if you ever read this!

// useSearch-Hook für die fuseSearch-Suche
// mit den parametern 'dataSet' für die Posts
// und 'keys', um zu bestimmen, welche Properties der Posts durchsucht werden

// Für Highlights:
// https://gist.github.com/evenfrost/1ba123656ded32fb7a0cd4651efd4db0
// oder
// https://dev.to/noclat/using-fuse-js-with-react-to-build-an-advanced-search-with-highlighting-4b93

export default function useSearch<T>({ dataSet, keys }: IUseSearchProps<T>) {
  const [searchValue, setSearchValue] = useState('');

  const fuse = useMemo(() => {
    const options = {
      includeScore: true,
      ignoreLocation: true,
      includeMatches: true,
      keys,
    };

    return new Fuse(dataSet, options);
  }, [dataSet, keys]);

  const results = useMemo(() => {
    if (!searchValue) return;

    const searchResults = fuse.search(searchValue);

    console.log('searchResults', searchResults);

    return searchResults
      .filter(
        (fuseResult) => fuseResult.score && fuseResult.score <= SCORE_THRESHOLD,
      )
      .map((fuseResult) => fuseResult.item);
  }, [fuse, searchValue]);

  return {
    searchValue,
    setSearchValue,
    results,
  };
}
