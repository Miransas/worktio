import { useCallback, useMemo, useState } from "react";
import { BiMenu, BiPlay, BiPlus, BiSave } from "react-icons/bi";
import {
  NavLink,
  useLocation,
} from "react-router-dom";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "default",
    position: { x: 120, y: 140 },
    data: { label: "YouTube Trigger" },
  },
  {
    id: "2",
    type: "default",
    position: { x: 420, y: 140 },
    data: { label: "Instagram Transform" },
  },
  {
    id: "3",
    type: "default",
    position: { x: 760, y: 140 },
    data: { label: "Telegram Publish" },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
];

const sidebarNodes = [
  "YouTube Trigger",
  "Instagram Transform",
  "Telegram Publish",
  "Delay",
  "Filter",
  "Webhook",
  "HTTP Request",
];

const collabsRoutes = [
  { label: "Overview", to: "/collabs" },
  { label: "Workflows", to: "/collabs/workflows" },
  { label: "Members", to: "/collabs/members" },
  { label: "Settings", to: "/collabs/settings" },
];

export default function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { pathname } = useLocation();

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );

  const addNode = useCallback(
    (label: string) => {
      const id = `${Date.now()}`;
      setNodes((nds) => [
        ...nds,
        {
          id,
          type: "default",
          position: { x: 240 + nds.length * 40, y: 320 + nds.length * 20 },
          data: { label },
        },
      ]);
    },
    [setNodes]
  );

  const stats = useMemo(
    () => ({ nodeCount: nodes.length, edgeCount: edges.length }),
    [nodes.length, edges.length]
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isSidebarCollapsed ? "72px 1fr" : "280px 1fr",
        height: "100vh",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #e5e7eb",
          padding: 12,
          background: "#fafafa",
          overflow: "auto",
        }}
      >
        <button
          onClick={() => setIsSidebarCollapsed((v) => !v)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "8px 10px",
            background: "white",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          <BiMenu size={16} />
          {!isSidebarCollapsed && "Sidebar"}
        </button>

        {!isSidebarCollapsed && (
          <>
            <h4 style={{ margin: "4px 0 10px" }}>Collabs</h4>
            <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
              {collabsRoutes.map((route) => (
                <NavLink
                  key={route.to}
                  to={route.to}
                  style={({ isActive }: { isActive: boolean }) => ({
                    textDecoration: "none",
                    border: "1px solid",
                    borderColor: isActive || pathname.startsWith(route.to)
                      ? "#111827"
                      : "#e5e7eb",
                    background:
                      isActive || pathname.startsWith(route.to)
                        ? "#111827"
                        : "#ffffff",
                    color:
                      isActive || pathname.startsWith(route.to)
                        ? "#ffffff"
                        : "#111827",
                    borderRadius: 10,
                    padding: "8px 10px",
                    fontSize: 14,
                  })}
                >
                  {route.label}
                </NavLink>
              ))}
            </div>

            <small style={{ color: "#6b7280" }}>Pathname: {pathname}</small>

            <h4 style={{ margin: "14px 0 10px" }}>Nodes</h4>
            <div style={{ display: "grid", gap: 8 }}>
              {sidebarNodes.map((item) => (
                <button
                  key={item}
                  onClick={() => addNode(item)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "8px 10px",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  <BiPlus size={14} />
                  {item}
                </button>
              ))}
            </div>
          </>
        )}
      </aside>

      <main style={{ display: "grid", gridTemplateRows: "56px 1fr" }}>
        <header
          style={{
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            background: "white",
          }}
        >
          <strong>Workflow Builder</strong>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <BiSave size={16} /> Save
            </button>
            <button style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <BiPlay size={16} /> Run
            </button>
          </div>
        </header>

        <section style={{ width: "100%", height: "100%", position: "relative" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background gap={20} />
          </ReactFlow>

          <div
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "8px 10px",
              fontSize: 13,
            }}
          >
            Nodes: {stats.nodeCount} • Connections: {stats.edgeCount}
          </div>
        </section>
      </main>
    </div>
  );
}