import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { scrollContext } from '../components/ScrollContext';

const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:3000' : 'https://n-co.vercel.app';

export type Post = {
  [index: string]: any;
  title: string;
  text: string;
  slug: string;
  languageTag: string;
  idTag: string;
};

export type Props =
  | {
      posts: Post[][];
    }
  | { error: string };

export async function getPosts() {
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.SPACE_ID}/environments/master/entries?access_token=${process.env.ACCESS_TOKEN}`,
  ).then((resp) => resp.json());

  const posts = res.items;

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
      <div className="flex h-screen lg:h-full">
        <Head>
          <title>Ann Website</title>
          <meta name="description" content="Ann's Website in 3 languages" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="grid md:mr-40 lg:m-0 gap-y-16 justify-items-stretch">
          {props.posts.map((postGroup) => {
            postGroup.sort((a, b) =>
              a.fields.languageTag &&
              b.fields.languageTag &&
              a.fields.languageTag > b.fields.languageTag
                ? 1
                : -1,
            );
            return (
              <div
                className="grid grid-cols-3 lg:m-0 gap-x-3 px-2 lg:gap-x-10 lg:px-6"
                key="0"
              >
                {postGroup.map((post) => {
                  return (
                    <Link
                      href={`${server}/text/${post.fields.slug}`}
                      key={post.fields.slug}
                      className={
                        post.fields.languageTag === 'de'
                          ? 'col-start-1'
                          : post.fields.languageTag === 'en'
                          ? 'col-start-2'
                          : 'col-start-3'
                      }
                    >
                      <div
                        lang={
                          post.fields.languageTag === 'de'
                            ? 'de'
                            : post.fields.languageTag === 'en'
                            ? 'en'
                            : 'ja'
                        }
                        className="bg-white p-2 hover:shadow-xl "
                      >
                        <h2 className="mb-2 font-bold">{post.fields.title}</h2>
                        {/* Setting: DOMPurify (https://github.com/cure53/DOMPurify) + Markdown Parser (https://github.com/markedjs/marked) */}
                        <div
                          dangerouslySetInnerHTML={{ __html: post.fields.text }}
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

  const posts: Post[][] = Object.values(
    fetchedPosts.reduce((acc: Post, current: Post) => {
      const propertyToSortBy = current.fields.idTag;
      acc[propertyToSortBy] = acc[propertyToSortBy] ?? [];
      acc[propertyToSortBy].push(current);
      return acc;
    }, {}),
  );

  console.log('sortedPosts', posts);

  return {
    props: { posts },
  };
}
