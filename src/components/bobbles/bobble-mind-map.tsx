import { Dumbbell } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { MindMapNode } from '@/src/data/demo-data';
import { DEMO_MIND_MAP } from '@/src/data/demo-data';
import { Typography } from '@/src/theme/fonts';

const MAP_TEXT = '#17164B';
const CANVAS_WIDTH = 340;
const CANVAS_HEIGHT = 420;

const HUB_WIDTH = 130;
const HUB_HEIGHT = 88;
const HUB_CENTER_X = CANVAS_WIDTH / 2;
const HUB_CENTER_Y = CANVAS_HEIGHT / 2;
const HUB_LEFT = HUB_CENTER_X - HUB_WIDTH / 2;
const HUB_RIGHT = HUB_CENTER_X + HUB_WIDTH / 2;
const SIDE_NODE_WIDTH = 100;
const SIDE_GAP = 30;

const CENTER = {
  x: HUB_LEFT,
  y: HUB_CENTER_Y - HUB_HEIGHT / 2,
  width: HUB_WIDTH,
  height: HUB_HEIGHT,
};

type Point = { x: number; y: number };

const CENTER_ANCHOR: Point = { x: HUB_CENTER_X, y: HUB_CENTER_Y };

const NODE_LAYOUT: Record<MindMapNode['position'], { x: number; y: number; width: number }> = {
  top: { x: HUB_CENTER_X - 65, y: 24, width: 130 },
  left: { x: HUB_LEFT - SIDE_GAP - SIDE_NODE_WIDTH, y: HUB_CENTER_Y - 58, width: SIDE_NODE_WIDTH },
  right: { x: HUB_RIGHT + SIDE_GAP, y: HUB_CENTER_Y - 58, width: SIDE_NODE_WIDTH },
  'bottom-left': { x: 36, y: HUB_CENTER_Y + 82, width: 112 },
  'bottom-right': { x: CANVAS_WIDTH - 148, y: HUB_CENTER_Y + 82, width: 112 },
};

function nodeAnchor(position: MindMapNode['position']): Point {
  const layout = NODE_LAYOUT[position];
  const centerX = layout.x + layout.width / 2;

  switch (position) {
    case 'top':
      return { x: centerX, y: layout.y + 56 };
    case 'left':
      return { x: layout.x + layout.width, y: layout.y + 36 };
    case 'right':
      return { x: layout.x, y: layout.y + 36 };
    case 'bottom-left':
      return { x: layout.x + layout.width * 0.75, y: layout.y };
    case 'bottom-right':
      return { x: layout.x + layout.width * 0.25, y: layout.y };
    default:
      return CENTER_ANCHOR;
  }
}

function centerAnchorToward(target: Point): Point {
  const dx = target.x - CENTER_ANCHOR.x;
  const dy = target.y - CENTER_ANCHOR.y;
  const length = Math.hypot(dx, dy) || 1;
  const inset = 34;
  return {
    x: CENTER_ANCHOR.x + (dx / length) * inset,
    y: CENTER_ANCHOR.y + (dy / length) * inset,
  };
}

function curvedPath(from: Point, to: Point) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const curveX = midX + (from.y - to.y) * 0.18;
  const curveY = midY + (to.x - from.x) * 0.12;
  return `M ${from.x} ${from.y} Q ${curveX} ${curveY} ${to.x} ${to.y}`;
}

type MindMapNodeCardProps = {
  node: MindMapNode;
};

function MindMapNodeCard({ node }: MindMapNodeCardProps) {
  const layout = NODE_LAYOUT[node.position];

  return (
    <View
      style={[
        styles.nodeCard,
        {
          left: layout.x,
          top: layout.y,
          width: layout.width,
          backgroundColor: node.backgroundColor,
        },
      ]}
    >
      <Text style={styles.nodeTitle}>{node.title}</Text>
      <Text style={styles.nodeSubtitle} numberOfLines={3}>
        {node.subtitle}
      </Text>
    </View>
  );
}

type BobbleMindMapProps = {
  centerTitle?: string;
  nodes?: MindMapNode[];
};

export function BobbleMindMap({
  centerTitle = DEMO_MIND_MAP.centerTitle,
  nodes = DEMO_MIND_MAP.nodes,
}: BobbleMindMapProps) {
  return (
    <View style={styles.root}>
      <View style={styles.canvas}>
        <View style={[styles.centerCard, { left: CENTER.x, top: CENTER.y, width: CENTER.width }]}>
          <Text style={styles.centerTitle}>{centerTitle}</Text>
          <View style={styles.centerIconCircle}>
            <Dumbbell size={18} color="#9F52F2" strokeWidth={2.2} />
          </View>
        </View>

        <Svg
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          style={styles.connectors}
        >
          {nodes.map((node) => {
            const target = nodeAnchor(node.position);
            const start = centerAnchorToward(target);
            return (
              <Path
                key={node.id}
                d={curvedPath(start, target)}
                stroke={node.lineColor}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </Svg>

        {nodes.map((node) => (
          <MindMapNodeCard key={node.id} node={node} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    position: 'relative',
  },
  connectors: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  centerCard: {
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EDE9FE',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  centerTitle: {
    ...Typography.formLabel,
    fontSize: 17,
    lineHeight: 22,
    color: MAP_TEXT,
    textAlign: 'center',
  },
  centerIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  nodeCard: {
    position: 'absolute',
    zIndex: 2,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 4,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  nodeTitle: {
    ...Typography.formLabel,
    fontSize: 13,
    lineHeight: 17,
    color: MAP_TEXT,
  },
  nodeSubtitle: {
    ...Typography.caption,
    fontSize: 10,
    lineHeight: 14,
    color: '#4B5563',
  },
});
