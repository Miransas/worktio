import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import WorkflowEditor from "./components/shared/si/sidebar";

function CollabsLayout() {
  return <Outlet />;
}

function CollabsOverview() {
  return <div className="p-4">Collabs Overview</div>;
}

function CollabsMembers() {
  return <div className="p-4">Collabs Members</div>;
}

function CollabsSettings() {
  return <div className="p-4">Collabs Settings</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/collabs/workflows" replace />} />

      <Route path="/collabs" element={<CollabsLayout />}>
        <Route index element={<CollabsOverview />} />
        <Route path="workflows" element={<WorkflowEditor />} />
        <Route path="members" element={<CollabsMembers />} />
        <Route path="settings" element={<CollabsSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/collabs/workflows" replace />} />
    </Routes>
  );
}