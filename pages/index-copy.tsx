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
      if (node.data.target.sys.contentType.sys.id === 'post') {
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

export default function BlogPost(props: any) {
  console.log(props);
  return (
    <>{documentToReactComponents(props.posts.fields.body, renderOptions)}</>
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
    .then((response: any) => console.log(response.items))
    .catch(console.error);

  return {
    props: { posts },
  };
}
