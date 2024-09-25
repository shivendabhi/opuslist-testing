import ArrowRight from "@/assets/arrow-right.svg";

export const CallToAction = () => {
  return (
    <section className="bg-[#00313A] py-24 text-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to transform your team's productivity?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join thousands of organizations using OpusList to optimize their
            time management and boost efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendly.com/opuslist/product-demo">
              <button className="bg-white text-[#00313A] px-6 py-3 rounded-lg font-medium hover:bg-[#F0F4F5] transition-colors">
                Schedule a Demo
              </button>
            </a>
            <button className="flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors">
              <span>Learn more</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
