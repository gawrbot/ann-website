import Footer from './Footer';
import Header from './Header';

export default function Layout(props: any) {
  return (
    <div className="flex min-h-[50vh] min-w-[90vw] flex-col overflow-auto items-stretch bg-heroine bg-cover bg-center lg:min-h-[100vh]">
      <Header />
      <main className="grow px-3 transform -rotate-90 translate-x-8 lg:py-32 overflow-auto lg:overflow-hidden lg:transform-none">
        {props.children}
      </main>
      <Footer />
    </div>
  );
}
