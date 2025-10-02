import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import ProMain from "./components/layout/ProMain";
import Dashboard from "./components/layout/Dashboard";
import Home from "./components/pages/Home";
import Anime from "./components/pages/2D";
import ThreeD from "./components/pages/ThreeD";
import OrgChart from "./components/pages/OrgChart";
import Users from "./components/pages/Users";
import Configuration from "./components/pages/Configuration";

// New pages
import KTSection from "./components/pages/KTSection";
import HardwareSetup from "./components/pages/HardwareSetup";
import SoftwareSetup from "./components/pages/SoftwareSetup";
import TeamArchitecture from "./components/pages/TeamArchitecture";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ProMain />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="home" element={<Home />} />
          <Route path="home/kt" element={<KTSection />} />
          <Route path="home/hardware" element={<HardwareSetup />} />
          <Route path="home/software" element={<SoftwareSetup />} />
          <Route path="home/team" element={<TeamArchitecture />} />

          <Route path="2d" element={<Anime />} />
          <Route path="3d" element={<ThreeD />} />
          <Route path="orgchart" element={<OrgChart />} />
          <Route path="users" element={<Users />} />
          <Route path="configuration" element={<Configuration />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
