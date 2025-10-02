import React from "react";

const KTSection = () => {
  // Example data (you can fetch from API/DB later)
  const videos = [
    {
      title: "Project Overview Session",
      link: "https://www.youtube.com/watch?v=abcd1234",
    },
    {
      title: "Backend Architecture Walkthrough",
      link: "https://drive.google.com/file/d/xyz",
    },
    {
      title: "Frontend Setup Guide",
      link: "https://www.youtube.com/watch?v=wxyz5678",
    },
    {
      title: "Deployment Process",
      link: "/videos/deployment.mp4", // local uploaded file
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📚 KT Section
        </h2>

        {/* Video List */}
        <div className="space-y-4">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-700">
                {video.title}
              </h3>
              <a
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                Watch →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KTSection;
