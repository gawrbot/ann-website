import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import Link from 'next/link';
import useSearch from '../utils/useSearch';
import { getPosts, Props, server } from './';

export default function Search(props: any) {
  const mainText =
    'posts' in props &&
    props.posts.map((post: any) =>
      documentToPlainTextString(post.fields.richText),
    );

  console.log('mainText', mainText);

  const { results, searchValue, setSearchValue } = useSearch<any>({
    dataSet:
      'posts' in props ? props.posts : ({} as { [key: string]: undefined }[]),
    keys: [
      'dataSet.fields.title',
      'dataSet.fields.richText.content[0].content[0].value',
      'dataSet.fields.slug',
    ],
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
              <Link
                href={`${server}/text/${result.fields.slug}`}
                key={result.fields.title}
              >
                <li>{result.fields.title}</li>
              </Link>
            );
          })}
      </ul>
    </>
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
