export default function Anchor({ children, ...restProps }: any) {
  // using a instead of Link since we want to force a full refresh
  return <a {...restProps}>{children}</a>;
}
