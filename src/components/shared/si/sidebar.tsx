import { useCallback, useMemo, useState, useEffect } from "react";
import { BiMenu, BiPlay, BiPlus, BiSave, BiMoon, BiSun } from "react-icons/bi";
import { NavLink, useLocation } from "react-router-dom";
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
  { id: "1", type: "default", position: { x: 120, y: 140 }, data: { label: "YouTube Trigger" } },
  { id: "2", type: "default", position: { x: 420, y: 140 }, data: { label: "Instagram Transform" } },
  { id: "3", type: "default", position: { x: 760, y: 140 }, data: { label: "Telegram Publish" } },
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("worktio-dark-mode");
    return saved ? JSON.parse(saved) : false;
  });
  const { pathname } = useLocation();

  useEffect(() => {
    localStorage.setItem("worktio-dark-mode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

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
      className={`grid h-screen ${
        isSidebarCollapsed ? "[grid-template-columns:72px_1fr]" : "[grid-template-columns:280px_1fr]"
      }`}
    >
      <aside className="flex flex-col overflow-auto border-r border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex-1">
          <button
            onClick={() => setIsSidebarCollapsed((v) => !v)}
            className="mb-3 flex w-full cursor-pointer items-center gap-2 rounded-[10px] border border-gray-200 bg-white px-[10px] py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            <BiMenu size={16} />
            {!isSidebarCollapsed && "Sidebar"}
          </button>

          {!isSidebarCollapsed && (
            <>
              <h4 className="mb-2 mt-1 text-sm font-semibold dark:text-gray-200">Collabs</h4>
              <div className="mb-3.5 grid gap-2">
                {collabsRoutes.map((route) => {
                  const customActive =
                    route.to === "/collabs"
                      ? pathname === "/collabs"
                      : pathname.startsWith(route.to);

                  return (
                    <NavLink
                      key={route.to}
                      to={route.to}
                      className={({ isActive }) =>
                        [
                          "rounded-[10px] border px-[10px] py-2 text-sm no-underline transition-colors",
                          isActive || customActive
                            ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                            : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
                        ].join(" ")
                      }
                    >
                      {route.label}
                    </NavLink>
                  );
                })}
              </div>

              <small className="mb-3.5 block text-xs text-gray-500 dark:text-gray-400">
                Pathname: {pathname}
              </small>

              <h4 className="mb-2 text-sm font-semibold dark:text-gray-200">Nodes</h4>
              <div className="grid gap-2">
                {sidebarNodes.map((item) => (
                  <button
                    key={item}
                    onClick={() => addNode(item)}
                    className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-gray-200 bg-white px-[10px] py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <BiPlus size={14} />
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => setIsDarkMode((v: boolean) => !v)}
          className="flex w-full cursor-pointer items-center gap-2 rounded-[10px] border border-gray-200 bg-white px-[10px] py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <BiSun size={16} /> : <BiMoon size={16} />}
          {!isSidebarCollapsed && (isDarkMode ? "Light" : "Dark")}
        </button>
      </aside>

      <main className="grid grid-rows-[56px_1fr] bg-white dark:bg-gray-800">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-800">
          <strong className="dark:text-white">Workflow Builder</strong>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              <BiSave size={16} /> Save
            </button>
            <button className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
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

          <div className="absolute right-3 top-3 rounded-[10px] border border-gray-200 bg-white/95 px-[10px] py-2 text-xs dark:border-gray-700 dark:bg-gray-800/95 dark:text-gray-200">
            Nodes: {stats.nodeCount} • Connections: {stats.edgeCount}
          </div>
        </section>
      </main>
    </div>
  );
}