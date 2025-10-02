import React from "react";

const HardwareSetup = () => {
  const devices = [
    { name: "Dell PowerEdge Server", image: "/images/server.png" },
    { name: "Cisco Router", image: "/images/router.png" },
    { name: "HP ProLiant Rack", image: "/images/rack.png" },
    { name: "Workstation PC", image: "/images/workstation.png" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🖥️ Hardware Setup</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {devices.map((device, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              {device.image && (
                <img
                  src={device.image}
                  alt={device.name}
                  className="w-24 h-24 object-contain mb-3"
                />
              )}
              <p className="font-medium text-gray-700">{device.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HardwareSetup;
