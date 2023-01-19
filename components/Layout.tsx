import Footer from './Footer';
import Header from './Header';

export default function Layout(props: any) {
  return (
    <div className="flex min-h-[100vh] min-w-[100vw] flex-col overflow-auto">
      <div className="bg-heroine bg-cover bg-center">
        <Header />
        <main className="px-3 py-4 lg:py-10">{props.children}</main>
        <Footer />
      </div>
    </div>
  );
}
