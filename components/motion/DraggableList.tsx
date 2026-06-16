"use client";

import { Reorder, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface DraggableListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  className?: string;
  itemClassName?: string;
}

export function DraggableList<T>({
  items,
  onReorder,
  keyExtractor,
  renderItem,
  className,
  itemClassName,
}: DraggableListProps<T>) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      className={className}
    >
      <AnimatePresence>
        {items.map((item) => (
          <Reorder.Item
            key={keyExtractor(item)}
            value={item}
            className={itemClassName}
            whileDrag={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          >
            {renderItem(item)}
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}
