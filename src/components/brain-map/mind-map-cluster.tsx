import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';

import type { MindMapCluster, MindMapTaskNode } from '@/src/features/mind-map/types';
import { Typography } from '@/src/theme/fonts';

const CLUSTER_WIDTH = 340;
const CLUSTER_HEIGHT = 280;
const CENTER_W = 120;
const CENTER_H = 72;
const NODE_W = 108;
const NODE_H = 64;

type LayoutPoint = { x: number; y: number };

const POSITION_LAYOUT: Record<MindMapTaskNode['position'], LayoutPoint> = {
  top: { x: (CLUSTER_WIDTH - NODE_W) / 2, y: 8 },
  left: { x: 8, y: (CLUSTER_HEIGHT - NODE_H) / 2 - 8 },
  right: { x: CLUSTER_WIDTH - NODE_W - 8, y: (CLUSTER_HEIGHT - NODE_H) / 2 - 8 },
  'bottom-left': { x: 28, y: CLUSTER_HEIGHT - NODE_H - 16 },
  'bottom-right': { x: CLUSTER_WIDTH - NODE_W - 28, y: CLUSTER_HEIGHT - NODE_H - 16 },
};

const CENTER_POS = {
  x: (CLUSTER_WIDTH - CENTER_W) / 2,
  y: (CLUSTER_HEIGHT - CENTER_H) / 2,
};

function nodeCenter(pos: LayoutPoint, w: number, h: number) {
  return { x: pos.x + w / 2, y: pos.y + h / 2 };
}

type MindMapClusterViewProps = {
  cluster: MindMapCluster;
  showConnectorBelow?: boolean;
};

export function MindMapClusterView({ cluster, showConnectorBelow }: MindMapClusterViewProps) {
  const center = nodeCenter(CENTER_POS, CENTER_W, CENTER_H);

  // Deduplicate positions if more than 5 nodes share slots — offset slightly by index.
  const placed = cluster.taskNodes.map((node, index) => {
    const base = POSITION_LAYOUT[node.position] ?? POSITION_LAYOUT.top;
    const slotIndex = cluster.taskNodes
      .slice(0, index)
      .filter((n) => n.position === node.position).length;
    const offsetY = slotIndex * 10;
    return {
      node,
      pos: { x: base.x, y: Math.min(base.y + offsetY, CLUSTER_HEIGHT - NODE_H - 4) },
    };
  });

  return (
    <View style={styles.wrap}>
      <Text style={styles.bobbleTitle} numberOfLines={1}>
        {cluster.bobbleTitleSnapshot}
      </Text>
      <View style={styles.canvas}>
        <Svg width={CLUSTER_WIDTH} height={CLUSTER_HEIGHT} style={StyleSheet.absoluteFill}>
          {placed.map(({ node, pos }) => {
            const tip = nodeCenter(pos, NODE_W, NODE_H);
            const lineColor = node.lineColor ?? '#C4B5FD';
            return (
              <Line
                key={`line-${node.id}`}
                x1={center.x}
                y1={center.y}
                x2={tip.x}
                y2={tip.y}
                stroke={lineColor}
                strokeWidth={1.5}
                strokeOpacity={0.85}
              />
            );
          })}
        </Svg>

        <View
          style={[
            styles.centerNode,
            {
              left: CENTER_POS.x,
              top: CENTER_POS.y,
              width: CENTER_W,
              height: CENTER_H,
            },
          ]}
        >
          <Text style={styles.centerTitle} numberOfLines={2}>
            {cluster.centerTitle}
          </Text>
        </View>

        {placed.map(({ node, pos }) => (
          <View
            key={node.id}
            style={[
              styles.taskNode,
              {
                left: pos.x,
                top: pos.y,
                width: NODE_W,
                height: NODE_H,
                backgroundColor: node.backgroundColor ?? '#EDE9FE',
              },
            ]}
          >
            <Text style={styles.taskTitle} numberOfLines={2}>
              {node.title}
            </Text>
            {node.subtitle ? (
              <Text style={styles.taskSubtitle} numberOfLines={1}>
                {node.subtitle}
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      {showConnectorBelow ? (
        <View style={styles.connector}>
          <Svg width={24} height={36}>
            <Path
              d="M12 0 V28"
              stroke="#C4B5FD"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="4 4"
            />
            <Path d="M6 22 L12 30 L18 22" stroke="#C4B5FD" strokeWidth={2} fill="none" />
          </Svg>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: '100%',
  },
  bobbleTitle: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: '#7C6A9A',
    marginBottom: 4,
    maxWidth: CLUSTER_WIDTH - 24,
    textAlign: 'center',
  },
  canvas: {
    width: CLUSTER_WIDTH,
    height: CLUSTER_HEIGHT,
    position: 'relative',
  },
  centerNode: {
    position: 'absolute',
    borderRadius: 18,
    backgroundColor: '#C4B5FD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  centerTitle: {
    ...Typography.heading,
    fontSize: 16,
    lineHeight: 20,
    color: '#4C1D95',
    textAlign: 'center',
  },
  taskNode: {
    position: 'absolute',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  taskTitle: {
    ...Typography.heading,
    fontSize: 12,
    lineHeight: 15,
    color: '#3B2F4A',
  },
  taskSubtitle: {
    ...Typography.body,
    fontSize: 10,
    lineHeight: 13,
    color: '#6B5B7A',
    marginTop: 2,
  },
  connector: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
});
