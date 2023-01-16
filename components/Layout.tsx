import Footer from './Footer';
import Header from './Header';

export default function Layout(props: any) {
  return (
    <div className="flex h-screen flex-col">
      <div className="bg-heroine bg-contain">
        <Header />
        <main className="px-3 py-10">{props.children}</main>
        <Footer />
      </div>
    </div>
  );
}
