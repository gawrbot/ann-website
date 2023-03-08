import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '../';

type Props =
  | {
      post: Post;
    }
  | { error: string };

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
          className="inline"
          src={`https://${node.data.target.fields.file.url}`}
          height="20"
          width="20"
          alt={node.data.target.fields.description}
        />
      );
    },
  },
};

export default function Text(props: Props) {
  if ('error' in props) {
    return (
      <div className="bg-white">
        <p>
          <Link href="/" className="hover:font-bold">
            <span className="underline">Go back</span>
          </Link>
        </p>
        <h1>Something went wrong 👀</h1>
        <p>{props.error}</p>
      </div>
    );
  }
  return (
    <div className="w-[80vh] absolute right-2/3 -top-96 lg:mx-40 lg:h-screen lg:w-auto lg:relative lg:right-auto lg:top-auto">
      <Head>
        <title>{props.post.fields.title}</title>
        <meta name="description" content="Exophony - Single Text Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="overflow-auto">
        <p className="lg:mt-5 mb-8 lg:mb-8">
          <Link href="/" scroll={false} className="hover:font-bold">
            <span className="underline">Go Home</span>
          </Link>
        </p>
        <div className="bg-white px-2 py-1 mb-5 lg:my-auto">
          <div
            lang={props.post.fields.languageTag}
            className="bg-white p-2 hover:shadow-xl "
          >
            <h1 className="mb-2 font-bold">{props.post.fields.title}</h1>
            {documentToReactComponents(
              props.post.fields.richText,
              renderOptions,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }: any) {
  const client = await contentful.createClient({
    space: process.env.SPACE_ID,
    accessToken: process.env.ACCESS_TOKEN,
  });

  const post = await client
    .getEntries({
      content_type: 'post',
      'fields.slug': params.slug,
    })
    .then((response: Post) => response.items[0])
    .catch(console.error);
  console.log('post sdk', post);
  if (typeof post === 'undefined') {
    return {
      props: {
        error: 'Text not found',
      },
    };
  }
  return {
    props: { post },
  };
}
