// ...existing code...
import { Navigate, Route, Routes } from "react-router-dom";
import WorkflowEditor from "./components/shared/si/sidebar";

function CollabsOverview() {
  return <div style={{ padding: 16 }}>Collabs Overview</div>;
}

function CollabsMembers() {
  return <div style={{ padding: 16 }}>Collabs Members</div>;
}

function CollabsSettings() {
  return <div style={{ padding: 16 }}>Collabs Settings</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/collabs/workflows" replace />} />
      <Route path="/collabs" element={<CollabsOverview />} />
      <Route path="/collabs/workflows" element={<WorkflowEditor />} />
      <Route path="/collabs/members" element={<CollabsMembers />} />
      <Route path="/collabs/settings" element={<CollabsSettings />} />
    </Routes>
  );
}