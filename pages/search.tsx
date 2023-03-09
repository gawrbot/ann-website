import Head from 'next/head';
import Link from 'next/link';
import useSearch from '../utils/useSearch';
import { server } from './';

const contentful = require('contentful');

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
    <div className="w-[80vh] absolute right-[27rem] -top-[20rem] lg:mx-40 lg:h-screen lg:w-auto lg:relative lg:right-auto lg:top-auto">
      <Head>
        <title>Search</title>
        <meta name="description" content="Exophony - Full Text Search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form
        className="bg-white px-10 py-5 justify-items-center mr-0 mb-5 lg:mx-auto lg:mt-16 h-auto min-w-fit lg:w-1/2"
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
          'bg-white px-10 py-5 justify-items-center mr-0 mb-10 lg:mx-auto h-auto lg:w-1/2'
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
                    className="hover:font-bold"
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
  const client = await contentful.createClient({
    space: process.env.SPACE_ID,
    accessToken: process.env.ACCESS_TOKEN,
  });

  const posts = await client
    .getEntries({
      content_type: 'post',
    })
    .then((response: any) => response.items)
    .catch(console.error);

  if (typeof posts === 'undefined') {
    return {
      props: {
        error: 'Fetching the texts from the CMS seems to have failed',
      },
    };
  }

  return {
    props: { posts },
  };
}
