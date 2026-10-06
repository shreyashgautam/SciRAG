import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  FileText,
  Layers,
  ArrowUpRight,
  Sparkles,
  Info
} from 'lucide-react';
import { MOCK_GRAPH_DATA } from '../../data/mockGraph';
import { GraphNode, NodeType, EdgeType } from '../../types';

export const KnowledgeGraphPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('p-lewis-2020');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const filteredNodes = useMemo(() => {
    if (typeFilter === 'all') return MOCK_GRAPH_DATA.nodes;
    return MOCK_GRAPH_DATA.nodes.filter((n) => n.type === typeFilter);
  }, [typeFilter]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return MOCK_GRAPH_DATA.edges.filter(
      (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    );
  }, [filteredNodeIds]);

  const selectedNode = MOCK_GRAPH_DATA.nodes.find((n) => n.id === selectedNodeId);

  // Connected edges for the selected node
  const connectedEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return MOCK_GRAPH_DATA.edges.filter(
      (e) => e.source === selectedNodeId || e.target === selectedNodeId
    );
  }, [selectedNodeId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getNodeColor = (type: NodeType, isSelected: boolean) => {
    if (isSelected) return '#ffffff';
    switch (type) {
      case 'paper':
        return '#000000'; // Black in light / inverted in dark
      case 'method':
        return '#4f46e5';
      case 'concept':
        return '#059669';
      case 'dataset':
        return '#d97706';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>TOPOLOGICAL MAP</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Research Knowledge Graph
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Interactive topology tracing citations, methodological extensions, datasets, and foundational concepts.
          </p>
        </div>

        {/* Filter by Node Type */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-hidden"
          >
            <option value="all">All Entities</option>
            <option value="paper">Papers Only</option>
            <option value="method">Methods Only</option>
            <option value="concept">Concepts Only</option>
            <option value="dataset">Datasets Only</option>
          </select>

          {/* Zoom controls */}
          <div className="flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-neutral-500">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded ml-1"
              title="Reset view"
              aria-label="Reset view"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Graph Canvas + Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px]">
        {/* Canvas Area (8 cols on lg) */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="lg:col-span-8 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden relative select-none cursor-grab active:cursor-grabbing academic-dots"
        >
          {/* Subtle canvas HUD overlay */}
          <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-400">
            Pan: ({Math.round(pan.x)}, {Math.round(pan.y)}) · Entities: {filteredNodes.length} · Relations: {filteredEdges.length}
          </div>

          <svg
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {filteredEdges.map((edge) => {
                const sourceNode = MOCK_GRAPH_DATA.nodes.find((n) => n.id === edge.source);
                const targetNode = MOCK_GRAPH_DATA.nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isConnected =
                  edge.source === selectedNodeId || edge.target === selectedNodeId;

                const midX = ((sourceNode.x || 0) + (targetNode.x || 0)) / 2;
                const midY = ((sourceNode.y || 0) + (targetNode.y || 0)) / 2;

                return (
                  <g key={edge.id}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      className={`transition-all ${
                        isConnected
                          ? 'stroke-neutral-900 dark:stroke-neutral-100 stroke-[1.8]'
                          : 'stroke-neutral-300 dark:stroke-neutral-700 stroke-[1] opacity-60'
                      }`}
                    />
                    {isConnected && edge.label && (
                      <text
                        x={midX}
                        y={midY}
                        className="text-[9px] font-mono fill-neutral-500 dark:fill-neutral-400 text-anchor-middle"
                        dy="-4"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const isPaper = node.type === 'paper';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x || 100}, ${node.y || 100})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId(node.id);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Node circle / shape */}
                    <circle
                      r={isSelected ? (isPaper ? 14 : 10) : (isPaper ? 11 : 8)}
                      className={`transition-all ${
                        isSelected
                          ? 'fill-neutral-950 dark:fill-neutral-50 stroke-neutral-400 stroke-2'
                          : isPaper
                          ? 'fill-neutral-800 dark:fill-neutral-200 hover:scale-125'
                          : 'fill-neutral-400 dark:fill-neutral-600 hover:scale-125'
                      }`}
                    />

                    {/* Node Label */}
                    <text
                      y={isPaper ? 22 : 18}
                      textAnchor="middle"
                      className={`text-[11px] font-medium transition-colors ${
                        isSelected
                          ? 'fill-neutral-950 dark:fill-neutral-50 font-bold'
                          : 'fill-neutral-700 dark:fill-neutral-300 group-hover:fill-neutral-950 dark:group-hover:fill-neutral-100'
                      }`}
                    >
                      {node.label}
                    </text>

                    {/* Type indicator micro text */}
                    <text
                      y={isPaper ? 33 : 28}
                      textAnchor="middle"
                      className="text-[9px] font-mono fill-neutral-400 uppercase tracking-wider"
                    >
                      {node.type}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Node Inspector Drawer (4 cols on lg) */}
        <div className="lg:col-span-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-5 flex flex-col justify-between overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                  <span className="uppercase">{selectedNode.type} Entity</span>
                  <span>ID: {selectedNode.id}</span>
                </div>
                <h3 className="text-base font-bold text-neutral-950 dark:text-neutral-50 leading-snug">
                  {selectedNode.label}
                </h3>
              </div>

              {/* Connected Relationships */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Relationships ({connectedEdges.length})
                </div>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {connectedEdges.map((edge) => {
                    const isOutgoing = edge.source === selectedNode.id;
                    const otherNodeId = isOutgoing ? edge.target : edge.source;
                    const otherNode = MOCK_GRAPH_DATA.nodes.find((n) => n.id === otherNodeId);

                    return (
                      <div
                        key={edge.id}
                        onClick={() => setSelectedNodeId(otherNodeId)}
                        className="p-2 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-950/40 text-xs flex items-center justify-between cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-mono text-[10px] text-neutral-400 uppercase mr-1">
                            {isOutgoing ? `→ ${edge.type}` : `← ${edge.type}`}
                          </span>
                          <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                            {otherNode?.label || otherNodeId}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                          {otherNode?.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions if node is a paper */}
              {selectedNode.paperId && (
                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/library/${selectedNode.paperId}`)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open in Paper Workspace</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-neutral-400">
              <Info className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <span>Select any entity on the topological map to inspect relations.</span>
            </div>
          )}

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Graph RAG Leiden Clusters</span>
            <span>v1.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
