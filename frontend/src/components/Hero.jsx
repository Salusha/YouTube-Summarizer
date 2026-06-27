/**
 * Hero Component
 *
 * Main heading section with title, subtitle, and feature highlights.
 */

function Hero() {
  return (
    <section className="pt-16 pb-10 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 rounded-full mb-6">
        <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse-slow"></span>
        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
          AI-powered summaries
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
        Summarize any{" "}
        <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          YouTube video
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
        Get key points, timestamps, quotes, FAQs, and action items in seconds.
        Choose your summary depth.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {["Key Points", "Timestamps", "Quotes", "FAQs", "Dark Mode", "PDF Export"].map(
          (feature) => (
            <span
              key={feature}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg"
            >
              {feature}
            </span>
          )
        )}
      </div>
    </section>
  );
}

export default Hero;
