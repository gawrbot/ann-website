import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Post, PropsAllPosts } from '../utils/types';
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

export default function Browse(props: PropsAllPosts) {
  if ('error' in props) {
    return (
      <>
        <p>
          <Link href="/" className="hover:font-bold">
            <span className="underline">Go home</span>
          </Link>
        </p>
        <h1>Something went wrong 👀</h1>
        <p>{props.error}</p>
      </>
    );
  }
  return (
    <div className="w-[80vh] absolute right-[27rem] -top-[20rem] lg:mx-40 lg:h-screen lg:w-auto lg:relative lg:right-auto lg:top-auto">
      <Head>
        <title>Texts</title>
        <meta
          name="description"
          content="Exophony - Browse through the titles"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="bg-white px-10 py-5 justify-items-center mr-0 mb-5 h-auto lg:w-1/2 lg:mx-auto lg:mt-16">
          <div className="flex flex-col">
            <div>
              {props.posts.map((postGroup) => {
                postGroup.sort((a, b) =>
                  a.fields.languageTag > b.fields.languageTag ? 1 : -1,
                );
                return (
                  <ul className="list-disc" key="title list">
                    {postGroup.map((post: Post) => {
                      return (
                        <Link
                          key={post.fields.slug}
                          href={`${server}/text/${post.fields.slug}`}
                        >
                          <li lang={post.fields.languageTag}>
                            <h2 className="text-black font-normal hover:font-bold">
                              {post.fields.titleWithIcons &&
                                documentToReactComponents(
                                  post.fields.titleWithIcons,
                                  renderOptions,
                                )}
                            </h2>
                          </li>
                        </Link>
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
  const client = await contentful.createClient({
    space: process.env.SPACE_ID,
    accessToken: process.env.ACCESS_TOKEN,
  });

  const fetchedPosts = await client
    .getEntries({
      content_type: 'post',
    })
    .then((response: Post) => response.items)
    .catch(console.error);

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
