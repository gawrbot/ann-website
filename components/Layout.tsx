// import Footer from './Footer';
import Header from './Header';

export default function Layout(props: any) {
  return (
    <div className="bg-heroine bg-cover bg-fixed bg-center overflow-auto">
      <div className="h-screen w-screen z-0 lg:h-auto">
        <Header />
        <main className="relative pr-32 lg:px-3 lg:pt-24 transform -rotate-90 lg:py-32 lg:transform-none w-[100vh] lg:w-auto">
          {props.children}
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
