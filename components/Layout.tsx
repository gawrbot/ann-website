import Footer from './Footer';
import Header from './Header';

export default function Layout(props: any) {
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="flex-grow px-3 py-10">{props.children}</main>

      <Footer />
    </div>
  );
}
