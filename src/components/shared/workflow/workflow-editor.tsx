import { useCallback, useMemo } from "react";
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
    <div className="grid h-screen [grid-template-columns:260px_1fr]">
      <aside className="border-r border-gray-200 bg-gray-50 p-3.5">
        <h3 className="mb-3 mt-1 text-base font-semibold">Nodes</h3>
        <div className="grid gap-2">
          {sidebarNodes.map((item) => (
            <button
              key={item}
              onClick={() => addNode(item)}
              className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-gray-200 bg-white px-[10px] py-2 text-sm hover:bg-gray-50"
            >
              <BiPlus size={14} />
              {item}
            </button>
          ))}
        </div>
      </aside>

      <main className="grid grid-rows-[56px_1fr]">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-3">
          <strong>Workflow Builder</strong>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
              <BiSave size={16} /> Save
            </button>
            <button className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
              <BiPlay size={16} /> Run
            </button>
          </div>
        </header>

        <section className="relative h-full w-full">
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

          <div className="absolute right-3 top-3 rounded-[10px] border border-gray-200 bg-white/95 px-[10px] py-2 text-xs">
            Nodes: {stats.nodeCount} • Connections: {stats.edgeCount}
          </div>
        </section>
      </main>
    </div>
  );
}