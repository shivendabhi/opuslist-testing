import ArrowRight from "@/assets/arrow-right.svg";

export default function CallToAction() {
  return (
    <section className="bg-[#00313A] py-24 text-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to take control of your time?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join thousands of individuals who have transformed their
            productivity with OpusList.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/api/auth/register?">
              <button className="bg-white text-[#00313A] px-6 py-3 rounded-lg font-medium hover:bg-[#F0F4F5] transition-colors">
                Start Free Trial
              </button>
            </a>
            <button className="flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors">
              <a href="/about">Learn more</a>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
