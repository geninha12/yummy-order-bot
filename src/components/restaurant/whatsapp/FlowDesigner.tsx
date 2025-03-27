
import React, { useState } from 'react';
import { PlusCircle, X, ArrowRight, MessageSquare, Image, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { WhatsAppFlowNode, WhatsAppMessageType } from '@/context/WhatsAppContext';
import { cn } from '@/lib/utils';

interface FlowDesignerProps {
  nodes: WhatsAppFlowNode[];
  edges: { id: string; source: string; target: string }[];
  onSave: (nodes: WhatsAppFlowNode[], edges: { id: string; source: string; target: string }[]) => void;
}

const FlowDesigner: React.FC<FlowDesignerProps> = ({ nodes: initialNodes, edges: initialEdges, onSave }) => {
  const [nodes, setNodes] = useState<WhatsAppFlowNode[]>(initialNodes);
  const [edges, setEdges] = useState<{ id: string; source: string; target: string }[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState<string | null>(null);

  const selectedNode = selectedNodeId ? nodes.find(node => node.id === selectedNodeId) : null;

  const handleAddNode = (type: WhatsAppMessageType) => {
    const newNode: WhatsAppFlowNode = {
      id: `node-${Date.now()}`,
      type,
      content: type === 'text' ? 'Nova mensagem' : '',
      position: { x: 100, y: 100 + nodes.length * 150 },
      buttons: type === 'button' ? [{ id: `btn-${Date.now()}`, text: 'Botão', action: '' }] : undefined
    };
    
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const handleUpdateNode = (id: string, updates: Partial<WhatsAppFlowNode>) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, ...updates } : node
    ));
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
    setEdges(edges.filter(edge => edge.source !== id && edge.target !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
  };

  const handleAddButton = (nodeId: string) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          buttons: [
            ...(node.buttons || []),
            { id: `btn-${Date.now()}`, text: 'Novo Botão', action: '' }
          ]
        };
      }
      return node;
    }));
  };

  const handleUpdateButton = (nodeId: string, buttonId: string, updates: Partial<{ text: string; action: string }>) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId && node.buttons) {
        return {
          ...node,
          buttons: node.buttons.map(btn => 
            btn.id === buttonId ? { ...btn, ...updates } : btn
          )
        };
      }
      return node;
    }));
  };

  const handleDeleteButton = (nodeId: string, buttonId: string) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId && node.buttons) {
        return {
          ...node,
          buttons: node.buttons.filter(btn => btn.id !== buttonId)
        };
      }
      return node;
    }));
  };

  const handleStartDrag = (e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setDraggingNodeId(nodeId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setSelectedNodeId(nodeId);
    
    e.stopPropagation();
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!draggingNodeId) return;
    
    const canvasRect = document.getElementById('flow-canvas')?.getBoundingClientRect();
    if (!canvasRect) return;
    
    setNodes(nodes.map(node => {
      if (node.id === draggingNodeId) {
        return {
          ...node,
          position: {
            x: e.clientX - canvasRect.left - dragOffset.x,
            y: e.clientY - canvasRect.top - dragOffset.y
          }
        };
      }
      return node;
    }));
  };

  const handleEndDrag = () => {
    setDraggingNodeId(null);
  };

  const handleStartConnecting = (nodeId: string) => {
    setConnecting(nodeId);
  };

  const handleConnect = (targetId: string) => {
    if (!connecting || connecting === targetId) {
      setConnecting(null);
      return;
    }
    
    // Evitar conexões duplicadas
    const edgeExists = edges.some(edge => 
      edge.source === connecting && edge.target === targetId
    );
    
    if (!edgeExists) {
      const newEdge = {
        id: `edge-${Date.now()}`,
        source: connecting,
        target: targetId
      };
      
      setEdges([...edges, newEdge]);
      
      // Atualiza o nextNodeId do nó de origem
      setNodes(nodes.map(node => {
        if (node.id === connecting) {
          return { ...node, nextNodeId: targetId };
        }
        return node;
      }));
    }
    
    setConnecting(null);
  };

  const handleDeleteEdge = (edgeId: string) => {
    const edgeToDelete = edges.find(e => e.id === edgeId);
    
    if (edgeToDelete) {
      // Remove o nextNodeId do nó de origem
      setNodes(nodes.map(node => {
        if (node.id === edgeToDelete.source && node.nextNodeId === edgeToDelete.target) {
          const { nextNodeId, ...rest } = node;
          return rest;
        }
        return node;
      }));
    }
    
    setEdges(edges.filter(edge => edge.id !== edgeId));
  };

  const handleSave = () => {
    onSave(nodes, edges);
  };

  const getNodeIcon = (type: WhatsAppMessageType) => {
    switch (type) {
      case 'text':
        return <MessageSquare className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'button':
        return <PlusCircle className="h-5 w-5" />;
      case 'list':
        return <List className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-14rem)] border rounded-lg">
      <div className="w-64 border-r p-4 bg-white overflow-y-auto">
        <h3 className="font-medium mb-4">Elementos</h3>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => handleAddNode('text')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Texto
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => handleAddNode('button')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Botões
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => handleAddNode('image')}
          >
            <Image className="h-4 w-4 mr-2" />
            Imagem
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => handleAddNode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            Lista
          </Button>
        </div>
        
        {selectedNode && (
          <div className="mt-6">
            <h3 className="font-medium mb-4">Propriedades</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Conteúdo</label>
                {selectedNode.type === 'text' ? (
                  <Textarea 
                    value={selectedNode.content}
                    onChange={(e) => handleUpdateNode(selectedNode.id, { content: e.target.value })}
                    className="w-full"
                    rows={3}
                  />
                ) : (
                  <Input 
                    value={selectedNode.content}
                    onChange={(e) => handleUpdateNode(selectedNode.id, { content: e.target.value })}
                    className="w-full"
                  />
                )}
              </div>
              
              {selectedNode.type === 'button' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Botões</label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleAddButton(selectedNode.id)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedNode.buttons?.map((button) => (
                      <div key={button.id} className="flex items-center space-x-2">
                        <Input 
                          value={button.text}
                          onChange={(e) => handleUpdateButton(selectedNode.id, button.id, { text: e.target.value })}
                          placeholder="Texto do botão"
                          className="flex-1 text-sm"
                        />
                        <Input 
                          value={button.action}
                          onChange={(e) => handleUpdateButton(selectedNode.id, button.id, { action: e.target.value })}
                          placeholder="Ação"
                          className="flex-1 text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteButton(selectedNode.id, button.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div 
        id="flow-canvas"
        className="flex-1 bg-gray-50 relative overflow-auto"
        onMouseMove={draggingNodeId ? handleDrag : undefined}
        onMouseUp={handleEndDrag}
        onMouseLeave={handleEndDrag}
        onClick={() => setSelectedNodeId(null)}
      >
        {nodes.map((node) => (
          <div
            key={node.id}
            className={cn(
              "absolute p-3 bg-white rounded-lg shadow-sm border-2 w-64",
              selectedNodeId === node.id ? "border-primary" : "border-transparent",
              connecting ? "cursor-pointer" : "cursor-move"
            )}
            style={{
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
              zIndex: draggingNodeId === node.id ? 10 : 1
            }}
            onMouseDown={(e) => !connecting && handleStartDrag(e, node.id)}
            onClick={(e) => {
              e.stopPropagation();
              if (connecting) {
                handleConnect(node.id);
              } else {
                setSelectedNodeId(node.id);
              }
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                {getNodeIcon(node.type)}
                <span className="ml-2 font-medium">{node.type.charAt(0).toUpperCase() + node.type.slice(1)}</span>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartConnecting(node.id);
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNode(node.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm truncate">
              {node.content}
            </div>
            {node.buttons && node.buttons.length > 0 && (
              <div className="mt-2 space-y-1">
                {node.buttons.map((button) => (
                  <div key={button.id} className="text-xs bg-gray-100 p-1 rounded">
                    {button.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Desenha as conexões entre os nós */}
        <svg className="absolute inset-0 pointer-events-none">
          {edges.map((edge) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return null;
            
            const sourceX = sourceNode.position.x + 128; // metade da largura
            const sourceY = sourceNode.position.y + 40;
            const targetX = targetNode.position.x + 128;
            const targetY = targetNode.position.y + 40;
            
            return (
              <g key={edge.id}>
                <path
                  d={`M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`}
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <circle
                  cx={(sourceX + targetX) / 2}
                  cy={(sourceY + targetY) / 2}
                  r="6"
                  fill="white"
                  stroke="black"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => handleDeleteEdge(edge.id)}
                />
                <line
                  x1={(sourceX + targetX) / 2 - 3}
                  y1={(sourceY + targetY) / 2 - 3}
                  x2={(sourceX + targetX) / 2 + 3}
                  y2={(sourceY + targetY) / 2 + 3}
                  stroke="black"
                  strokeWidth="1"
                />
                <line
                  x1={(sourceX + targetX) / 2 - 3}
                  y1={(sourceY + targetY) / 2 + 3}
                  x2={(sourceX + targetX) / 2 + 3}
                  y2={(sourceY + targetY) / 2 - 3}
                  stroke="black"
                  strokeWidth="1"
                />
              </g>
            );
          })}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>
        </svg>
        
        {/* Linha para conexão ativa */}
        {connecting && (
          <svg className="absolute inset-0 pointer-events-none">
            <path
              d={`M${
                nodes.find(n => n.id === connecting)?.position.x! + 128
              },${
                nodes.find(n => n.id === connecting)?.position.y! + 40
              } L${
                draggingNodeId ? 
                  nodes.find(n => n.id === draggingNodeId)?.position.x! + 128 : 
                  document.getElementById('flow-canvas')?.getBoundingClientRect().left! + 
                  document.getElementById('flow-canvas')?.getBoundingClientRect().width! / 2
              },${
                draggingNodeId ? 
                  nodes.find(n => n.id === draggingNodeId)?.position.y! + 40 : 
                  document.getElementById('flow-canvas')?.getBoundingClientRect().top! +
                  document.getElementById('flow-canvas')?.getBoundingClientRect().height! / 2
              }`}
              stroke="black"
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
            />
          </svg>
        )}
      </div>
      
      <div className="fixed bottom-4 right-4">
        <Button onClick={handleSave}>Salvar Fluxo</Button>
      </div>
    </div>
  );
};

export default FlowDesigner;
