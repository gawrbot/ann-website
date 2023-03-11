import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '../utils/types';
import useSearch from '../utils/useSearch';
import { server } from './';

const contentful = require('contentful');

const renderOptions = {
  renderNode: {
    [INLINES.EMBEDDED_ENTRY]: (node: any) => {
      return (
        <Link
          className="hover:font-bold"
          href={`/${node.data.target.fields.slug}`}
        >
          {node.data.target.fields.title}
        </Link>
      );
    },

    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      return (
        <Image
          className="inline mb-2"
          src={`https://${node.data.target.fields.file.url}`}
          height="18"
          width="18"
          alt={node.data.target.fields.description}
        />
      );
    },
  },
};

export default function Search(props: any) {
  const { results, searchValue, setSearchValue } = useSearch<any>({
    dataSet:
      'posts' in props ? props.posts : ({} as { [key: string]: undefined }[]),
    keys: [
      'fields.titleWithIcons',
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
          'bg-white px-10 py-5 justify-items-center mr-0 mb-10 lg:mx-auto h-auto'
        }
      >
        <ul>
          {results
            ? results.map((result) => {
                console.log('result', result);
                return (
                  <li key={result.fields.title}>
                    <Link href={`${server}/text/${result.fields.slug}`}>
                      <h2 className="text-black font-normal hover:font-bold">
                        {documentToReactComponents(
                          result.fields.titleWithIcons,
                          renderOptions,
                        )}
                      </h2>
                    </Link>
                    <div>
                      {documentToReactComponents(
                        result.fields.richText,
                        renderOptions,
                      )}
                    </div>
                  </li>
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
    .then((response: Post) => response.items)
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
