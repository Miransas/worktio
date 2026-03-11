import { useCallback, useMemo, useState } from "react";
import { BiPlay, BiPlus, BiSave } from "react-icons/bi";
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

export default function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", height: "100vh" }}>
      <aside style={{ borderRight: "1px solid #e5e7eb", padding: 14, background: "#fafafa" }}>
        <h3 style={{ margin: "4px 0 12px" }}>Nodes</h3>
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