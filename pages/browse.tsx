import Head from 'next/head';
import Link from 'next/link';
import { getPosts, Post, Props, server } from './';

export default function Browse(props: Props) {
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
  }
  return (
    <>
      <Head>
        <title>Browse</title>
        <meta name="description" content="Browse Ann's texts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="font-bold text-center mb-5">Browse through the texts</h1>
      <div className="flex flex-col items-center">
        <div className="">
          {props.posts.map((postGroup) => {
            postGroup.sort((a, b) =>
              a.fields.languageTag > b.fields.languageTag ? 1 : -1,
            );
            return (
              <ul className="list-disc" key="0">
                {postGroup.map((post: Post) => {
                  return (
                    <li key={post.fields.slug} lang={post.fields.languageTag}>
                      <Link href={`${server}/text/${post.fields.slug}`}>
                        <h2 className="text-black font-normal hover:text-blue-600">
                          {post.fields.title}
                        </h2>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const fetchedPosts = await getPosts();

  if (typeof fetchedPosts === 'undefined') {
    return {
      props: {
        error: 'Nothing to see here',
      },
    };
  }

  const posts: Post[][] = Object.values(
    fetchedPosts.reduce((acc: Post, current: Post) => {
      const propertyToSortBy = current.fields.idTag;
      acc[propertyToSortBy] = acc[propertyToSortBy] ?? [];
      acc[propertyToSortBy].push(current);
      return acc;
    }, {}),
  );

  return {
    props: { posts },
  };
}
