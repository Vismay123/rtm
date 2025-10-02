import { useState } from "react";
import { useOrgData } from "../hooks/useOrgData";

// 🔍 Helper: recursively find and insert into orgData
const addUserToParent = (node, parentName, newUser) => {
  if (node.name === parentName) {
    // If this parent is a "Team", use pseudoChildren
    if (node.attributes?.title === "Team") {
      node.pseudoChildren = node.pseudoChildren || [];
      node.pseudoChildren.push(newUser);
    } else {
      node.children = node.children || [];
      node.children.push(newUser);
    }
    return true;
  }

  // 🔽 Recurse into children
  if (node.children) {
    for (let child of node.children) {
      if (addUserToParent(child, parentName, newUser)) return true;
    }
  }

  // 🔽 Recurse into pseudoChildren
  if (node.pseudoChildren) {
    for (let child of node.pseudoChildren) {
      if (addUserToParent(child, parentName, newUser)) return true;
    }
  }

  return false;
};

// 🔍 Helper: recursively delete user
const deleteUserFromTree = (node, userName) => {
  if (node.pseudoChildren) {
    node.pseudoChildren = node.pseudoChildren.filter(c => c.name !== userName);
    node.pseudoChildren.forEach(c => deleteUserFromTree(c, userName));
  }
  if (node.children) {
    node.children = node.children.filter(c => c.name !== userName);
    node.children.forEach(c => deleteUserFromTree(c, userName));
  }
};

export default function Users() {
  const [orgData, setOrgData] = useOrgData();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [parent, setParent] = useState("");
  const [deleteName, setDeleteName] = useState("");

  const handleAdd = () => {
    if (!name || !role || !parent) return alert("All fields required!");
    const newUser = { name, attributes: { title: role } };
    const updated = JSON.parse(JSON.stringify(orgData));
    if (addUserToParent(updated, parent, newUser)) {
      setOrgData(updated);
      setName("");
      setRole("");
      setParent("");
    } else {
      alert("Parent not found!");
    }
  };

  const handleDelete = () => {
    if (!deleteName) return alert("Enter a name to delete!");
    const updated = JSON.parse(JSON.stringify(orgData));
    deleteUserFromTree(updated, deleteName);
    setOrgData(updated);
    setDeleteName("");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      {/* Add User Form */}
      <div className="mb-6 p-4 border rounded-lg shadow">
        <h3 className="font-semibold mb-2">Add User</h3>
        <input
          className="border p-2 mr-2"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Role"
          value={role}
          onChange={e => setRole(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Parent Name (exact match)"
          value={parent}
          onChange={e => setParent(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      {/* Delete User Form */}
      <div className="p-4 border rounded-lg shadow">
        <h3 className="font-semibold mb-2">Delete User</h3>
        <input
          className="border p-2 mr-2"
          placeholder="User Name"
          value={deleteName}
          onChange={e => setDeleteName(e.target.value)}
        />
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
