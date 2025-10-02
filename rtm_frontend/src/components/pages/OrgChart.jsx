import { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";
import { motion } from "framer-motion";
import { useOrgData } from "../hooks/useOrgData";

// 🎨 Branch-based colors
const branchColors = {
  "Sanjay Kumar Jha": "bg-gradient-to-br from-blue-600 to-blue-400",
  "Parikshit Bangde": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Abhijit Sutar": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Abhishek Tripathy": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Sahil Patial": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Nedhunuri Tejo": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Pralay Kumar": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Mayur Karetha": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Akshat Dwivedi": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Ravi Chodokar": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Prasanna Varpe": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Amandeep Singh": "bg-gradient-to-br from-purple-600 to-purple-400",
  "AI & ML Managers": "bg-gradient-to-br from-purple-600 to-purple-400",
  "ML and AI Engineers": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Frontend Managers": "bg-gradient-to-br from-purple-600 to-purple-400",
  "React JS Developer": "bg-gradient-to-br from-purple-600 to-purple-400",
  "AI Solution Managers": "bg-gradient-to-br from-purple-600 to-purple-400",
  "AI Solution Engineers": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Assistant VP & BU Head - Products, Solutions & Strategy": "bg-gradient-to-br from-yellow-500 to-yellow-300",
  "Preeti Joshi": "bg-gradient-to-br from-yellow-500 to-yellow-300",
  "Nishi Maheshwari": "bg-gradient-to-br from-yellow-500 to-yellow-300",
  "Anusha Bai": "bg-gradient-to-br from-yellow-500 to-yellow-300",
  "Prajakta Payghan": "bg-gradient-to-br from-yellow-500 to-yellow-300",
  "Senior Director": "bg-gradient-to-br from-red-500 to-red-300",
  "Joice": "bg-gradient-to-br from-red-500 to-red-300",
  "Aghil Menon": "bg-gradient-to-br from-red-500 to-red-300",
  "Jeenal Rajgor": "bg-gradient-to-br from-orange-500 to-orange-400",
  "Sales & Marketing": "bg-gradient-to-br from-orange-500 to-orange-400",
  "Rishika Agarwala": "bg-gradient-to-br from-orange-500 to-orange-400",
  "Accounts & HR": "bg-gradient-to-br from-orange-500 to-orange-400",
  "Sakchi Agrawal": "bg-gradient-to-br from-orange-500 to-orange-400",
  "Accounts and Operations": "bg-gradient-to-br from-orange-500 to-orange-400",
  "Harshita Kothari": "bg-gradient-to-br from-orange-500 to-orange-400",
  Default: "bg-gradient-to-br from-gray-50 to-gray-200",
};

// 📌 Find branch color
const getBranchColor = (nodeDatum) => {
  if (branchColors[nodeDatum.name]) return branchColors[nodeDatum.name];
  let current = nodeDatum.parent;
  while (current) {
    if (branchColors[current.data.name]) return branchColors[current.data.name];
    current = current.parent;
  }
  return branchColors.Default;
};

// 🎨 Custom Node Renderer
const renderNode = ({ nodeDatum }) => {
  const branchColor = getBranchColor(nodeDatum);

  if (nodeDatum.attributes?.title === "Team" && nodeDatum.pseudoChildren) {
    const teamMembers = [...nodeDatum.pseudoChildren];
    return (
      <foreignObject width={260} height={teamMembers.length * 70 + 60} x={-130} y={-50}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex flex-col items-center gap-2 border border-gray-200 rounded-xl p-3 text-gray-900 shadow-md w-[240px] ${branchColor}`}
          whileHover={{ scale: 1.05 }}
        >
          <strong>{nodeDatum.name}</strong>
          {teamMembers.map((child, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-gray-200 rounded-lg p-2 bg-white w-[200px] text-center shadow-sm"
            >
              <strong>{child.name}</strong>
              <p className="text-xs m-0">{child.attributes?.title}</p>
            </motion.div>
          ))}
        </motion.div>
      </foreignObject>
    );
  }

  return (
    <foreignObject width={220} height={120} x={-110} y={-50}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        whileHover={{ scale: 1.08 }}
        className={`border border-gray-200 rounded-xl p-3 text-gray-900 shadow-md w-[200px] text-center ${branchColor}`}
      >
        <strong>{nodeDatum.name}</strong>
        <p className="text-xs m-0">{nodeDatum.attributes?.title}</p>
      </motion.div>
    </foreignObject>
  );
};

// 📌 OrgChart Component
const OrgChart = () => {
  const [orgData] = useOrgData();
  const treeRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setSize({
        width: treeRef.current.offsetWidth,
        height: treeRef.current.offsetHeight,
      });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className="w-full h-[80vh] bg-gradient-to-b from-gray-50 to-indigo-50 p-3 rounded-2xl overflow-hidden"
      ref={treeRef}
    >
      {size.width > 0 && (
        <Tree
          data={orgData}
          translate={{ x: size.width / 2, y: 150 }}
          zoom={0.8}
          orientation="vertical"
          pathFunc="step"
          nodeSize={{ x: 280, y: 220 }}
          separation={{ siblings: 0.8, nonSiblings: 1 }}
          renderCustomNodeElement={renderNode}
          pathClassFunc={() => "linkPath"}
          svgProps={{ style: { overflow: "visible" } }}
        />
      )}
      <style>{`
        .linkPath {
          stroke: #9ca3af;
          stroke-width: 2px;
          fill: none;
          stroke-dasharray: 10;
          stroke-dashoffset: 0;
          marker-end: url(#arrow);
          animation: dash 1s linear infinite;
        }
        @keyframes dash { to { stroke-dashoffset: -20; } }
      `}</style>

      {/* 🔽 Arrow Marker Definition */}
      <svg style={{ height: 0 }}>
        <defs>
          <marker
            id="arrow"
            markerWidth="6"
            markerHeight="6"
            refX="30"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="#020807" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default OrgChart;
