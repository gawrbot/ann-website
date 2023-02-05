import Footer from './Footer';
import Header from './Header';

export default function Layout(props: any) {
  return (
    <div className="flex min-h-[100vh] min-w-[90vw] flex-col overflow-auto items-stretch">
      <div className="bg-heroine bg-cover bg-center">
        <Header />
        <main className="px-3 py-32 lg:py-36">{props.children}</main>
        <Footer />
      </div>
    </div>
  );
}
