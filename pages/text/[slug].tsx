import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Head from 'next/head';
import Link from 'next/link';
import { Post } from '../';

type Props =
  | {
      post: Post;
    }
  | { error: string };

export default function Text(props: Props) {
  if ('error' in props) {
    return (
      <div className="bg-white">
        <p>
          <Link href="/">
            <span className="underline">Go back</span>
          </Link>
        </p>
        <h1>Something went wrong 👀</h1>
        <p>{props.error}</p>
      </div>
    );
  }
  return (
    <div className="w-[80vh] absolute right-2/3 -top-96 lg:mx-40 lg:w-auto lg:relative lg:right-auto lg:top-auto">
      <Head>
        <title>{props.post.fields.title}</title>
        <meta name="description" content="Exophony - Single Text Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="overflow-auto">
        <p className="mb-5 lg:mb-8">
          <Link href="/" scroll={false}>
            <span className="font-bold underline">Go Home</span>
          </Link>
        </p>
        <div className="bg-white px-2 py-1 mb-5 lg:my-auto">
          <div
            lang={props.post.fields.languageTag}
            className="bg-white p-2 hover:shadow-xl "
          >
            <h1 className="mb-2 font-bold">{props.post.fields.title}</h1>
            {documentToReactComponents(props.post.fields.richText)}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }: any) {
  async function getPost(slug: string) {
    const res = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.SPACE_ID}/environments/master/entries?access_token=${process.env.ACCESS_TOKEN}&content_type=post&fields.slug[in]=${slug}`,
    ).then((resp) => resp.json());

    const posts = res.items;

    return posts?.[0];
  }
  const post = await getPost(params.slug);
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
