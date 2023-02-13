import Head from 'next/head';
import Link from 'next/link';
import useSearch from '../utils/useSearch';
import { getPosts, server } from './';

export default function Search(props: any) {
  const { results, searchValue, setSearchValue } = useSearch<any>({
    dataSet:
      'posts' in props ? props.posts : ({} as { [key: string]: undefined }[]),
    keys: [
      'fields.title',
      'fields.richText.content.content.value',
      'fields.slug',
    ],
  });

  return (
    <div className="w-[80vh] absolute right-1/2 -top-96 lg:h-[80vh] lg:mx-40 lg:w-auto lg:relative lg:right-auto lg:top-auto">
      <Head>
        <title>Full Text Search</title>
        <meta name="description" content="Exophony - Full Text Search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form
        className="bg-white px-10 py-5 justify-items-center mr-0 mb-5 lg:mx-auto lg:mt-16 h-auto w-fit lg:w-1/2"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label className="m-3" htmlFor="query">
          Search all texts:
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
      <div
        className={
          results &&
          'bg-white px-10 py-5 justify-items-center mr-0 mb-10 lg:mx-auto h-auto w-2/3 lg:w-1/2'
        }
      >
        <ul>
          {results
            ? results.map((result) => {
                console.log('result', result);
                return (
                  <Link
                    href={`${server}/text/${result.fields.slug}`}
                    key={result.fields.title}
                  >
                    <li>{result.fields.title}</li>
                  </Link>
                );
              })
            : null}
        </ul>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const posts = await getPosts();

  if (typeof posts === 'undefined') {
    return {
      props: {
        error: 'Nothing to see here',
      },
    };
  }

  return {
    props: { posts },
  };
}
