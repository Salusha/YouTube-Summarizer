/**
 * App Component
 *
 * Root component with dark mode, summary levels, and all Phase 1 features.
 */

import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import UrlForm from "./components/UrlForm.jsx";
import LoadingState from "./components/LoadingState.jsx";
import SummaryCard from "./components/SummaryCard.jsx";
import KeyPoints from "./components/KeyPoints.jsx";
import Timestamps from "./components/Timestamps.jsx";
import ActionItems from "./components/ActionItems.jsx";
import Quotes from "./components/Quotes.jsx";
import FAQs from "./components/FAQs.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import Toast from "./components/Toast.jsx";
import { useToast } from "./hooks/useToast.js";
import { useDarkMode } from "./hooks/useDarkMode.js";
import { summarizeVideo } from "./utils/api.js";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast, showToast, hideToast } = useToast();
  const { darkMode, toggleDarkMode } = useDarkMode();

  async function handleSubmit(url, level) {
    setResult(null);
    setError("");
    setLoading(true);

    try {
      const data = await summarizeVideo(url, level);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(success) {
    if (success) {
      showToast("Summary copied to clipboard!", "success");
    } else {
      showToast("Failed to copy. Please try again.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <UrlForm onSubmit={handleSubmit} loading={loading} />

        {loading && <LoadingState />}
        {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

        {result && (
          <div className="mt-10 space-y-6 animate-fade-in pb-20">
            <SummaryCard
              title={result.title}
              shortSummary={result.shortSummary}
              detailedSummary={result.detailedSummary}
              data={result}
              onCopy={handleCopy}
            />
            <KeyPoints points={result.keyPoints} />
            <Timestamps timestamps={result.timestamps} />
            {result.actionItems?.length > 0 && <ActionItems items={result.actionItems} />}
            {result.quotes?.length > 0 && <Quotes quotes={result.quotes} />}
            {result.faqs?.length > 0 && <FAQs faqs={result.faqs} />}
          </div>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}

export default App;
