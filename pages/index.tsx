import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
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
    `https://cdn.contentful.com/spaces/${process.env.SPACE_ID}/environments/master/entries?access_token=${process.env.ACCESS_TOKEN}&content_type=post`,
  ).then((resp) => resp.json());

  const posts = res.items;

  return posts;
}

export default function Home(props: Props) {
  const { scrollRef } = useContext(scrollContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState({});

  useEffect(() => {
    window.scrollTo(0, scrollRef.current.scrollPos);
    const handleScrollPos = () => {
      scrollRef.current.scrollPos = window.scrollY;
    };
    window.addEventListener('scroll', handleScrollPos);
    return () => {
      window.removeEventListener('scroll', handleScrollPos);
    };
  });

  function toggleOpen(slug: string) {
    setIsOpen({
      ...isOpen,
      [slug]: !isOpen[slug as keyof typeof isOpen],
    });
  }

  if ('error' in props) {
    return (
      <>
        <h1>Something went wrong 👀</h1>
        <p>{props.error}</p>
      </>
    );
  } else {
    return (
      <div className="flex h-full">
        <Head>
          <title>Exophony</title>
          <meta name="description" content="Exophony" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="grid w-screen mt-12 gap-y-16 justify-items-stretch">
          {props.posts.map((postGroup) => {
            postGroup.sort((a, b) =>
              a.fields.languageTag > b.fields.languageTag ? 1 : -1,
            );
            return (
              <div
                className="grid grid-cols-3 place-items-start gap-x-3 px-2 justify-items-stretch lg:gap-x-10 lg:px-6"
                key={postGroup[0]?.fields.idTag}
              >
                {postGroup.map((post) => {
                  return (
                    <div
                      lang={post.fields.languageTag}
                      key={post.fields.slug}
                      className={
                        post.fields.languageTag === 'de'
                          ? 'col-start-1'
                          : post.fields.languageTag === 'en'
                          ? 'col-start-2'
                          : 'col-start-3'
                      }
                    >
                      {isOpen[post.fields.slug as keyof typeof isOpen] !==
                      true ? (
                        <div className="grid justify-items-start bg-white p-2 pt-0 text-left aspect-square transform -translate-y-1/3 transition-transform scale-10 overflow-hidden">
                          <button
                            onClick={() => {
                              toggleOpen(post.fields.slug);
                            }}
                            onKeyDown={() => {
                              toggleOpen(post.fields.slug);
                            }}
                          >
                            <div className="justify-self-end my-2">
                              <div className="mr-2">
                                <Image
                                  alt="Collapse text"
                                  src="/collapse.png"
                                  width={24}
                                  height={24}
                                />
                              </div>
                              <div>
                                <Image
                                  alt="Open text in new window"
                                  src="/open_in_new_window.png"
                                  width={24}
                                  height={24}
                                />
                              </div>
                              <h2>{post.fields.title}</h2>
                              {documentToReactComponents(post.fields.richText)}
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="grid justify-items-start bg-white p-2 pt-0 text-left transform transition-transform scale-100">
                          <div className="justify-self-end my-2">
                            <button
                              className="mr-2"
                              onClick={() => {
                                toggleOpen(post.fields.slug);
                              }}
                              onKeyDown={() => {
                                toggleOpen(post.fields.slug);
                              }}
                            >
                              <Image
                                alt="Collapse text"
                                src="/collapse.png"
                                width={24}
                                height={24}
                              />
                            </button>
                            <button
                              onClick={async () => {
                                await router.push(
                                  `${server}/text/${post.fields.slug}`,
                                );
                              }}
                              onKeyDown={async () => {
                                await router.push(
                                  `${server}/text/${post.fields.slug}`,
                                );
                              }}
                            >
                              <Image
                                alt="Open text in new window"
                                src="/open_in_new_window.png"
                                width={24}
                                height={24}
                              />
                            </button>
                          </div>
                          <h2>{post.fields.title}</h2>
                          {documentToReactComponents(post.fields.richText)}
                        </div>
                      )}
                    </div>
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
        error: 'Fetching the texts from the CMS seems to have failed',
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
