import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { scrollContext } from '../components/ScrollContext';

const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:3000' : 'https://n-co.vercel.app';

export type Post = {
  title: string;
  slug: string;
  html: string;
  tags: { [name: string]: string }[];
};

export type Props =
  | {
      posts: Post[][];
    }
  | { error: string };

export async function getPosts() {
  const res = await fetch(
    `${process.env.BLOG_URL}/ghost/api/v3/content/posts/?key=${process.env.CONTENT_API_KEY}&limit=all&fields=title,slug,html&include=tags`,
  ).then((resp) => resp.json());

  const posts = res.posts;

  return posts;
}

export default function Home(props: Props) {
  // Get 'current' object and fill it with userContext
  const { scrollRef } = useContext(scrollContext);

  useEffect(() => {
    // sets the scroll to the currently stored scroll position (works when 'Back to all robots' is clicked bc. 'scroll' is set to 'false' in the link)
    window.scrollTo(0, scrollRef.current.scrollPos);

    // update the scroll position on change (called in listener for the event 'scroll')
    const handleScrollPos = () => {
      scrollRef.current.scrollPos = window.scrollY;
    };

    window.addEventListener('scroll', handleScrollPos);

    // cleanup function to remove event listener again to prevent side effects
    return () => {
      window.removeEventListener('scroll', handleScrollPos);
    };
  });

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
    return (
      <>
        <Head>
          <title>Ann Website</title>
          <meta name="description" content="Ann's Website in 3 languages" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="h-screen -rotate-90 transform overflow-scroll lg:h-auto lg:transform-none lg:overflow-auto">
          <div className="grid gap-y-16 lg:justify-items-stretch">
            {props.posts.map((postGroup) => {
              postGroup.sort((a, b) =>
                a.tags[0].name > b.tags[0].name ? 1 : -1,
              );
              return (
                <div
                  className="grid grid-cols-3 gap-x-3 px-2 lg:gap-x-10 lg:px-6"
                  key={postGroup[0]?.tags[1]?.name}
                >
                  {postGroup.map((post) => {
                    return (
                      <Link
                        href={`${server}/text/${post.slug}`}
                        key={post.slug}
                        className={
                          post.tags[0].name === 'de'
                            ? 'col-start-1'
                            : post.tags[0].name === 'en'
                            ? 'col-start-2'
                            : 'col-start-3'
                        }
                      >
                        <div
                          lang={
                            post.tags[0].name === 'de'
                              ? 'de'
                              : post.tags[0].name === 'en'
                              ? 'en'
                              : 'ja'
                          }
                          className="bg-white p-2 hover:shadow-xl "
                        >
                          <h2 className="mb-2 font-bold">{post.title}</h2>

                          <div
                            dangerouslySetInnerHTML={{ __html: post.html }}
                            className="break-words"
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
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

  const tagCheckedPosts = fetchedPosts.filter((post: Post) => {
    return (
      typeof post.tags[1] !== 'undefined' && typeof post.tags[0] !== 'undefined'
    );
  });

  const posts: Post[][] = Object.values(
    tagCheckedPosts.reduce((acc: Post, current: Post) => {
      const propertyToSortBy = current.tags[1]
        .name as keyof typeof current.tags[1];
      acc[propertyToSortBy] = acc[propertyToSortBy] ?? [];
      acc[propertyToSortBy].push(current);
      return acc;
    }, {}),
  );

  return {
    props: { posts },
  };
}
