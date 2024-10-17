import { ArrowRight } from 'lucide-react'

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
            <a 
              href="https://calendly.com/opuslist/product-demo"
              className="inline-block group"
            >
              <button 
                className="bg-white text-[#00313A] px-6 py-3 rounded-lg font-medium 
                           transition-all duration-300 ease-in-out
                           hover:bg-[#F0F4F5] hover:shadow-lg hover:scale-105"
              >
                Schedule a Demo
              </button>
            </a>
            <button 
              className="flex items-center justify-center gap-2 text-white/80 
                         hover:text-white transition-colors group"
            >
              <span className="transition-colors duration-300">
                Learn more
              </span>
              <ArrowRight 
                className="h-5 w-5 transition-all duration-300 group-hover:translate-x-1" 
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
