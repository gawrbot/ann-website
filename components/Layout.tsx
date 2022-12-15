import Footer from './Footer';
import Header from './Header';

export default function Layout(props: any) {
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <main className="flex-grow p-3">{props.children}</main>

      <Footer />
    </div>
  );
}
