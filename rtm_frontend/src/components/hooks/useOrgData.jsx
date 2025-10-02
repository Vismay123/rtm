import { useState, useEffect } from "react";

// ✅ Default Org Data Schema
const defaultOrgData = {
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
        
        { name: "Joice", attributes: { title: "Scrum Master" } },
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


export const useOrgData = () => {
  const [orgData, setOrgData] = useState(() => {
    const saved = localStorage.getItem("orgData");
    return saved ? JSON.parse(saved) : defaultOrgData;
  });

  // Keep localStorage synced
  useEffect(() => {
    localStorage.setItem("orgData", JSON.stringify(orgData));
  }, [orgData]);

  return [orgData, setOrgData];
};
