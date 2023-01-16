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
      <div className="flex flex-col items-center">
        {props.posts.map((postGroup) => {
          postGroup.sort((a: Post, b: Post) =>
            a.tags[0].name > b.tags[0].name ? 1 : -1,
          );
          return (
            <ul className="list-disc" key={postGroup[0]?.tags[1]?.name}>
              {postGroup.map((post: Post) => {
                return (
                  <li
                    key={post.slug}
                    lang={
                      post.tags[0].name === 'de'
                        ? 'de'
                        : post.tags[0].name === 'en'
                        ? 'en'
                        : 'ja'
                    }
                  >
                    <Link href={`${server}/text/${post.slug}`}>
                      <h2 className="mt-4 font-bold text-black hover:text-blue-600">
                        {post.title}
                      </h2>
                    </Link>
                  </li>
                );
              })}
            </ul>
          );
        })}
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
      const propertyToSortBy = current.tags[1]
        .name as keyof typeof current.tags[1];
      acc[propertyToSortBy] = acc[propertyToSortBy] ?? [];
      acc[propertyToSortBy].push(current);
      return acc;
    }, {}),
  );
  // console.log('props back', posts);
  return {
    props: { posts },
  };
}
