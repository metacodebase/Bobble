export type MindMapTaskNodePosition =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom-left'
  | 'bottom-right';

export interface MindMapTaskNode {
  id: string;
  title: string;
  subtitle: string;
  sourceTaskId?: string;
  position: MindMapTaskNodePosition;
  backgroundColor?: string;
  lineColor?: string;
}

export interface MindMapCluster {
  _id: string;
  user: string;
  bobble?: string;
  sourceBobbleId: string;
  captureAt: string;
  centerTitle: string;
  bobbleTitleSnapshot: string;
  taskNodes: MindMapTaskNode[];
  createdAt: string;
  updatedAt: string;
}
