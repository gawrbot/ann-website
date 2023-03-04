import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';

const contentful = require('contentful');

// Create a bespoke renderOptions object to target BLOCKS.EMBEDDED_ENTRY (linked block entries e.g. code blocks)
// and BLOCKS.EMBEDDED_ASSET (linked assets e.g. images)

const renderOptions = {
  renderNode: {
    [INLINES.EMBEDDED_ENTRY]: (node: any, children: any) => {
      // target the contentType of the EMBEDDED_ENTRY to display as you need
      if (node.data.target.sys.contentType.sys.id === 'Link') {
        return (
          <Link href={`/${node.data.target.fields.slug}`}>
            {node.data.target.fields.title}
          </Link>
        );
      }
    },

    [BLOCKS.EMBEDDED_ASSET]: (node: any, children: any) => {
      // render the EMBEDDED_ASSET as you need
      return (
        <Image
          src={`https://${node.data.target.fields.file.url}`}
          height={node.data.target.fields.file.details.image.height}
          width={node.data.target.fields.file.details.image.width}
          alt={node.data.target.fields.description}
        />
      );
    },
  },
};

export default function Post(props: any) {
  console.log('copy-props', props.posts[0].fields);
  return (
    <div>
      {props.posts.map((post: any) => {
        return (
          <div key={post.fields.slug}>
            <h2>{post.fields.title}</h2>
            {documentToReactComponents(post.fields.richText, renderOptions)}
          </div>
        );
      })}
    </div>
  );
}

export async function getServerSideProps() {
  const client = await contentful.createClient({
    space: process.env.SPACE_ID as string,
    accessToken: process.env.ACCESS_TOKEN as string,
  });
  const posts = await client
    .getEntries({
      content_type: 'post',
    })
    .then((response: any) => response.items)
    .catch(console.error);

  if (typeof posts === 'undefined') {
    return {
      props: {
        error: 'Fetching the texts from the CMS seems to have failed',
      },
    };
  }
  return {
    props: { posts },
  };
}
