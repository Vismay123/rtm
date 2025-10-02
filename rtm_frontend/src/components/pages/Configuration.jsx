import { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";
import { motion } from "framer-motion"; // 🎬 Animation library

// 🎨 Branch-based colors (constant per leader)
const branchColors = {
  "Sanjay Kumar Jha": "bg-gradient-to-br from-blue-600 to-blue-400", // blue
  "Parikshit Bangde": "bg-gradient-to-br from-purple-600 to-purple-400", // purple
  "AI & ML Managers": "bg-gradient-to-br from-purple-600 to-purple-400",
  "ML and AI Engineers": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Frontend Managers": "bg-gradient-to-br from-purple-600 to-purple-400",
  "React JS Developer": "bg-gradient-to-br from-purple-600 to-purple-400",
  "AI Solution Managers": "bg-gradient-to-br from-purple-600 to-purple-400",
  "AI Solution Engineers": "bg-gradient-to-br from-purple-600 to-purple-400",
  "Assistant VP & BU Head - Products, Solutions & Strategy": "bg-gradient-to-br from-yellow-500 to-yellow-300", // yellow
  
  "Preeti Joshi": "bg-gradient-to-br from-yellow-500 to-yellow-300", // yellow
  "Nishi Maheshwari": "bg-gradient-to-br from-yellow-500 to-yellow-300", // yellow
  "Anusha Bai": "bg-gradient-to-br from-yellow-500 to-yellow-300", // yellow
  "Prajakta Payghan": "bg-gradient-to-br from-yellow-500 to-yellow-300", // yellow

  "Senior Director": "bg-gradient-to-br from-red-500 to-red-300", // red
  "Joice ": "bg-gradient-to-br from-red-500 to-red-300", // red
  "Aghil Menon": "bg-gradient-to-br from-red-500 to-red-300", // red

  "Jeenal Rajgor": "bg-gradient-to-br from-orange-500 to-orange-400", // orange
  "Sales & Marketing": "bg-gradient-to-br from-orange-500 to-orange-400", // orange
  "Rishika Agarwala": "bg-gradient-to-br from-orange-500 to-orange-400", // orange
  "Accounts & HR": "bg-gradient-to-br from-orange-500 to-orange-400", // orange
  "Sakchi Agrawal": "bg-gradient-to-br from-orange-500 to-orange-400", // orange
  "Accounts and Operations": "bg-gradient-to-br from-orange-500 to-orange-400", // orange
  "Harshita Kothari": "bg-gradient-to-br from-orange-500 to-orange-400", // orange
  
  Default: "bg-gradient-to-br from-gray-50 to-gray-200",
};

// 📌 Org Data
const orgData = {
  name: "Sanjay Kumar Jha",
  attributes: { title: "CEO" },
  children: [
    {
      name: "Parikshit Bangde",
      attributes: { title: "Director - AI Labs (Products & Solutions)" },
      children: [
        {
          name: "AI & ML Managers",
          attributes: { title: "Team" },
          children: [
            {
              name: "ML and AI Engineers",
              attributes: { title: "Team" },
              pseudoChildren: [
                { name: "Abhijit Sutar", attributes: { title: "Associate ML Engineer" } },
                { name: "Abhishek Tripathy", attributes: { title: "Associate ML Engineer" } },
                { name: "Sahil Patial", attributes: { title: "Associate ML Engineer" } },
                { name: "Nedhunuri Tejo", attributes: { title: "Associate AI Engineer" } },
                { name: "Pralay Kumar", attributes: { title: "Associate AI Engineer" } },
              ],
            },
          ],
        },
        {
          name: "Frontend Managers",
          attributes: { title: "Team" },
          children: [
            {
              name: "React JS Developer",
              attributes: { title: "Team" },
              pseudoChildren: [
                { name: "Mayur Karetha", attributes: { title: "React JS Developer" } },
                { name: "Akshat Dwivedi", attributes: { title: ".NET Developer" } },
                { name: "Ravi Chodokar", attributes: { title: "Associate - UI/UX Designer" } },
              ],
            },
          ],
        },
        {
          name: "AI Solution Managers",
          attributes: { title: "Team" },
          children: [
            {
              name: "AI Solution Engineers",
              attributes: { title: "Team" },
              pseudoChildren: [
                { name: "Prasanna Varpe", attributes: { title: "AI Solution Engineer" } },
                { name: "Amandeep Singh", attributes: { title: "AI Engineer" } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Preeti Joshi",
      attributes: { title: "Assistant VP & BU Head - Products, Solutions & Strategy" },
      children: [
        {
          name: "Nishi Maheshwari",
          attributes: { title: "Senior Business Analyst" },
          children: [
            {
              name: "Anusha Bai",
              attributes: { title: "Business Analyst - AI Products & Solutions" },
            },
          ],
        },
        { name: "Prajakta Payghan", attributes: { title: "Senior Quality Analyst" } },
      ],
    },
    {
      name: "Senior Director",
      attributes: { title: "Delivery and Program Management" },
      children: [
        { name: "Joice ", attributes: { title: "Scrum Master" } },
        { name: "Aghil Menon", attributes: { title: "Scrum Master" } },
      ],
    },
    {
      name: "Jeenal Rajgor",
      attributes: { title: "VP & Head - HR, Operations & Shared Services" },
      children: [
        {
          name: "Sales & Marketing",
          attributes: { title: "Team" },
          children: [
            {
              name: "Rishika Agarwala",
              attributes: { title: "Associate Director - Pre Sales & Marketing" },
            },
          ],
        },
        {
          name: "Accounts & HR",
          attributes: { title: "Team" },
          children: [
            {
              name: "Sakchi Agrawal",
              attributes: { title: "Associate Director - Accounts & HR" },
            },
          ],
        },
        {
          name: "Accounts and Operations",
          attributes: { title: "Team" },
          children: [
            {
              name: "Harshita Kothari",
              attributes: { title: "Senior Manager - Accounts and Operations" },
            },
          ],
        },
      ],
    },
  ],
};

// 📌 Helper to find branch color (all children inherit parent color)
const getBranchColor = (nodeDatum) => {
  // If top-level leader
  if (branchColors[nodeDatum.name]) return branchColors[nodeDatum.name];

  // Walk up until we find a top-level ancestor
  let current = nodeDatum.parent;
  while (current) {
    if (branchColors[current.data.name]) {
      return branchColors[current.data.name];
    }
    current = current.parent;
  }
  return branchColors.Default;
};

// 🎨 Custom Node Renderer
const renderNode = ({ nodeDatum }) => {
  const branchColor = getBranchColor(nodeDatum);

  // Special rendering for teams with pseudoChildren
  if (nodeDatum.attributes?.title === "Team" && nodeDatum.pseudoChildren) {
    const teamMembers = [...nodeDatum.pseudoChildren];
    return (
      <foreignObject width={260} height={teamMembers.length * 70 + 60} x={-130} y={-50}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex flex-col items-center gap-2 border border-gray-200 rounded-xl p-3 text-gray-900 shadow-md w-[240px] ${branchColor}`}
          whileHover={{ scale: 1.05, boxShadow: "0 6px 18px rgba(0,0,0,0.12)" }}
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

  // Default node rendering
  return (
    <foreignObject width={220} height={120} x={-110} y={-50}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        whileHover={{ scale: 1.08, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
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
          svgProps={{
            style: { overflow: "visible" }, // ensure arrows aren't clipped
          }}
        />
      )}

      {/* Line animation CSS */}
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

        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>

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
            <path d="M0,0 L0,6 L6,3 z" fill="#000000ff" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default OrgChart;
