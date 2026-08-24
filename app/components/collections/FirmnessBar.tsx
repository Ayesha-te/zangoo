import { getFirmnessPercent } from "@/app/utils/firmness";
import styles from "./firmnessBar.module.css";

type FirmnessBarProps = {
  firmness: string;
  className?: string;
};

export function FirmnessBar({ firmness, className }: FirmnessBarProps) {
  return (
    <span className={className ? `${styles.wrap} ${className}` : styles.wrap}>
      <span className={styles.track}>
        <span className={styles.fill} style={{ width: `${getFirmnessPercent(firmness)}%` }} />
      </span>
      <small>{firmness}</small>
    </span>
  );
}
