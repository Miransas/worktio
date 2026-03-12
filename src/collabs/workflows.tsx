import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { JSX, useEffect, useState } from "react";
import Settings from "../pages/Setting";
import WorkflowEditor from "../components/shared/si/sidebar";
import { invoke } from "@tauri-apps/api/core";


// Auth guard — bağlı hesap yoksa Settings'e yönlendir
function RequireAuth({ children }: { children: JSX.Element }) {
  const [checked, setChecked] = useState(false);
  const [hasAccounts, setHasAccounts] = useState(false);

  useEffect(() => {
    invoke<any[]>("get_connected_accounts").then((accounts) => {
      setHasAccounts(accounts.length > 0);
      setChecked(true);
    });
  }, []);

  if (!checked) return null; // yüklenirken boş ekran

  return hasAccounts ? children : <Navigate to="/setup" replace />;
}

function CollabsLayout() {
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      {/* Kurulum — hesap bağlama */}
      <Route path="/setup" element={<Settings />} />

      {/* Ana app — auth zorunlu */}
      <Route
        path="/collabs"
        element={
          <RequireAuth>
            <CollabsLayout />
          </RequireAuth>
        }
      >
        <Route path="workflows" element={<WorkflowEditor />} />
        <Route path="members" element={<div className="p-4">Members</div>} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Yönlendirmeler */}
      <Route path="/" element={<Navigate to="/collabs/workflows" replace />} />
      <Route path="*" element={<Navigate to="/collabs/workflows" replace />} />
    </Routes>
  );
}
