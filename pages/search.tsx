import Link from 'next/link';
import useSearch from '../utils/useSearch';
import { server } from './';

export type Post = {
  title: string;
  slug: string;
  html: string;
  feature_image: string;
  feature_image_caption: string;
  tags: { name: string }[];
};

type Props =
  | {
      posts: Post[];
    }
  | { error: string };

export async function getPosts() {
  const res = await fetch(
    `${process.env.blog_url}/ghost/api/v3/content/posts/?key=${process.env.content_api_key}&fields=title,slug,html,feature_image,feature_image_caption&include=tags`,
  ).then((resp) => resp.json());

  const posts = res.posts;

  return posts;
}

export const getStaticProps = async () => {
  const posts = await getPosts();
  if (typeof posts === 'undefined') {
    return {
      props: {
        error: 'Nothing to see here',
      },
    };
  }
  return {
    revalidate: 10,
    props: { posts },
  };
};

export default function Search(props: Props) {
  if ('error' in props) {
    return (
      <>
        <p>
          <Link href="/">
            <span className="underline">Go back</span>
          </Link>
        </p>
        <h1>Something went wrong 👀</h1>
        <p>{props.error}</p>
      </>
    );
  } else {
    // Überlegen, wie nicht konditionell abrufen möglich
    const { results, searchValue, setSearchValue } = useSearch<any>({
      dataSet: props.posts,
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
}
