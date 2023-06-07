import type { Pos } from '$/repository/boardRepository';
import React from 'react';
import { LatestMove } from '../LatestMove/LatestMove';
import styles from './Disc.module.css';

type DiscProps = {
  x?: number | undefined;
  y?: number | undefined;
  color?: number;
  showLatestMove: boolean;
  latestMovePos?: Pos | undefined;
  style?: React.CSSProperties;
};

export const Disc = ({ x, y, color, showLatestMove, latestMovePos, style }: DiscProps) => {
  return (
    <div
      className={styles.disc}
      style={style ? style : { background: color === 1 ? '#000' : '#fff' }}
    >
      {showLatestMove && <LatestMove x={x} y={y} latestMove={latestMovePos} />}
    </div>
  );
};

export default Disc;
