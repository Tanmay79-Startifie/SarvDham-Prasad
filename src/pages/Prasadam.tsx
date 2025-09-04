import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PrasadamProducts from "@/components/prasadam/PrasadamProducts";

const Prasadam = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-4xl">🙏</div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary">
                पवित्र प्रसादम्
              </h1>
              <div className="text-4xl">🙏</div>
            </div>
            <p className="text-elderly-lg text-muted-foreground mb-4">
              Sacred Prasad from Braj Dham Temples
            </p>
            <div className="w-24 h-1 bg-gradient-divine mx-auto rounded-full"></div>
          </div>
          
          <PrasadamProducts />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Prasadam;