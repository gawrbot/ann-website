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
    <div className="w-[80vh] absolute right-1/2 -top-96 lg:w-auto lg:relative lg:right-auto lg:top-auto">
      <Head>
        <title>Browse the text titles</title>
        <meta name="description" content="Exophony - Browse through the titles" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="bg-white px-10 py-5 justify-items-center mr-0 mb-5 lg:mx-auto lg:mt-16 h-auto w-2/3 lg:w-1/2">
          <h1>Browse through the texts</h1>
          <div className="flex flex-col mt-5">
            <div>
              {props.posts.map((postGroup) => {
                postGroup.sort((a, b) =>
                  a.fields.languageTag > b.fields.languageTag ? 1 : -1,
                );
                return (
                  <ul className="list-disc" key="0">
                    {postGroup.map((post: Post) => {
                      return (
                        <li
                          key={post.fields.slug}
                          lang={post.fields.languageTag}
                        >
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
        </div>
      </div>
    </div>
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
