import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';

import { MindMapNodeDetailModal } from '@/src/components/brain-map/mind-map-node-detail-modal';
import type { MindMapCluster, MindMapTaskNode } from '@/src/features/mind-map/types';
import { FontFamily, Typography } from '@/src/theme/fonts';

const MAX_CLUSTER_WIDTH = 360;
const CLUSTER_HEIGHT = 280;
const COMPACT_CLUSTER_HEIGHT = 180;
const CENTER_W = 112;
const CENTER_H = 72;
const NODE_W = 96;
const NODE_H = 64;

type LayoutPoint = { x: number; y: number };

function nodeCenter(pos: LayoutPoint, w: number, h: number) {
  return { x: pos.x + w / 2, y: pos.y + h / 2 };
}

type MindMapClusterViewProps = {
  cluster: MindMapCluster;
  showConnectorBelow?: boolean;
};

export function MindMapClusterView({ cluster, showConnectorBelow }: MindMapClusterViewProps) {
  const [selectedNode, setSelectedNode] = useState<MindMapTaskNode | null>(null);
  const { width: screenWidth } = useWindowDimensions();
  const clusterWidth = Math.min(MAX_CLUSTER_WIDTH, screenWidth - 32);
  const hasBottomNodes = cluster.taskNodes.some(
    (node) => node.position === 'bottom-left' || node.position === 'bottom-right'
  );
  const canvasHeight = hasBottomNodes ? CLUSTER_HEIGHT : COMPACT_CLUSTER_HEIGHT;
  const centerY = hasBottomNodes ? (CLUSTER_HEIGHT - CENTER_H) / 2 : 88;
  const sideInset = 4;
  const bottomInset = 18;
  const positionLayout: Record<MindMapTaskNode['position'], LayoutPoint> = {
    top: { x: (clusterWidth - NODE_W) / 2, y: 8 },
    left: { x: sideInset, y: centerY + (CENTER_H - NODE_H) / 2 },
    right: {
      x: clusterWidth - NODE_W - sideInset,
      y: centerY + (CENTER_H - NODE_H) / 2,
    },
    'bottom-left': { x: 20, y: canvasHeight - NODE_H - bottomInset },
    'bottom-right': {
      x: clusterWidth - NODE_W - 20,
      y: canvasHeight - NODE_H - bottomInset,
    },
  };
  const centerPos = {
    x: (clusterWidth - CENTER_W) / 2,
    y: centerY,
  };
  const center = nodeCenter(centerPos, CENTER_W, CENTER_H);

  // Deduplicate positions if more than 5 nodes share slots — offset slightly by index.
  const placed = cluster.taskNodes.map((node, index) => {
    const base = positionLayout[node.position] ?? positionLayout.top;
    const slotIndex = cluster.taskNodes
      .slice(0, index)
      .filter((n) => n.position === node.position).length;
    const offsetY = slotIndex * 10;
    return {
      node,
      pos: { x: base.x, y: Math.min(base.y + offsetY, canvasHeight - NODE_H - 4) },
    };
  });

  return (
    <View style={styles.wrap}>
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
          alignSelf: 'center',
        }}
      >
        <Text style={styles.bobbleTitle}>{cluster.bobbleTitleSnapshot}</Text>
      </View>
      <View style={[styles.canvas, { width: clusterWidth, height: canvasHeight }]}>
        <Svg width={clusterWidth} height={canvasHeight} style={StyleSheet.absoluteFill}>
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
          {showConnectorBelow ? (
            <Line
              x1={center.x}
              y1={centerPos.y + CENTER_H}
              x2={center.x}
              y2={canvasHeight}
              stroke="#A78BFA"
              strokeWidth={4}
              strokeLinecap="round"
            />
          ) : null}
        </Svg>

        <View
          style={[
            styles.centerNode,
            {
              left: centerPos.x,
              top: centerPos.y,
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
          <Pressable
            key={node.id}
            accessibilityRole="button"
            accessibilityLabel={`${node.title}. ${node.subtitle}`}
            accessibilityHint="Shows the full node text"
            onPress={() => setSelectedNode(node)}
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
          </Pressable>
        ))}
      </View>

      {showConnectorBelow ? (
        <View style={styles.connector}>
          <Svg width={24} height={36}>
            <Path d="M12 0 V30" stroke="#A78BFA" strokeWidth={4} strokeLinecap="round" />
            <Path
              d="M5 23 L12 31 L19 23"
              stroke="#A78BFA"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </View>
      ) : null}
      <MindMapNodeDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  bobbleTitle: {
    ...Typography.heading,
    fontFamily: FontFamily.bold,
    fontSize: 15,
    lineHeight: 20,
    color: '#111111',
    marginBottom: 4,
    maxWidth: MAX_CLUSTER_WIDTH - 24,
    textAlign: 'center',
  },
  canvas: {
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
  },
});
