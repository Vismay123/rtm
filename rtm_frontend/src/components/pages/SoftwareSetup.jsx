import React from "react";

const SoftwareSetup = () => {
  const softwares = [
    {
      name: "Node.js",
      steps: ["Download from official site", "Install LTS version", "Verify with node -v"],
    },
    {
      name: "Docker",
      steps: ["Download Docker Desktop", "Run installer", "Verify with docker --version"],
    },
    {
      name: "PostgreSQL",
      steps: ["Download installer", "Setup password", "Verify with psql --version"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">💻 Software Setup</h2>

        <div className="space-y-6">
          {softwares.map((sw, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-3">{sw.name}</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                {sw.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoftwareSetup;
