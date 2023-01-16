import Link from 'next/link';
import useSearch from '../utils/useSearch';
import { Props, server } from './';

export default function Search(props: Props) {
  const { results, searchValue, setSearchValue } = useSearch<any>({
    dataSet:
      'posts' in props ? props.posts : ({} as { [key: string]: undefined }[]),
    keys: ['title', 'html'],
  });

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label className="m-3" htmlFor="query">
          Search all:
        </label>
        <input
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.currentTarget.value);
          }}
          type="search"
          id="query"
          required
          className="m-3 border-2 bg-gray-200 p-1"
        />
      </form>
      <ul>
        {results &&
          results.map((result) => {
            console.log('result', result);
            return (
              <Link href={`${server}/text/${result.slug}`} key={result.title}>
                <li>{result.title}</li>
              </Link>
            );
          })}
      </ul>
    </>
  );
}
