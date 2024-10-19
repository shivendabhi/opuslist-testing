import React from 'react';

interface WeeklySummaryProps {
  summary: string;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ summary }) => {
  // Function to parse and render the summary sections
  const renderSummary = () => {
    const sections = summary.split('\n\n');
    return sections.map((section, index) => {
      const [title, ...content] = section.split('\n');
      return (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <ul className="list-disc list-inside">
            {content.map((item, i) => (
              <li key={i} className="mb-1">{item.replace(/^[•-]\s*/, '')}</li>
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Weekly Summary</h2>
      {summary === "Generating weekly summary..." ? (
        <p className="text-gray-600 italic">Generating weekly summary...</p>
      ) : (
        <div className="text-gray-700">{renderSummary()}</div>
      )}
    </div>
  );
};

export default WeeklySummary;
