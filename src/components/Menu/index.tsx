"use client";

import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { toolOptions } from "../../data/toolOptions";
import { brushColors } from "../../data/brushColors";
import styles from "./styles.module.css";
import { orderItems } from "../../utils";

function Menu(props) {
  const { size, color, tool, setColor, setSize, onClickToolMenu } = props;

  const renderToolContainer = useMemo(() => {
    const orderedTools = orderItems(toolOptions);
    return (
      <div className={styles.toolContainer}>
        {orderedTools.map((item) => (
          <div
            className={
              item.value === tool
                ? `${styles.tool} ${styles.toolActive}`
                : styles.tool
            }
            onClick={() => {
              onClickToolMenu(item.value);
            }}
          >
            <FontAwesomeIcon icon={Icons[item.icon]} />
          </div>
        ))}
      </div>
    );
  }, [tool, onClickToolMenu]);

  const renderColorContainer = useMemo(() => {
    const ordersItems = orderItems(brushColors);
    if (tool !== "brush") {
      return null;
    }
    return (
      <div className={styles.colorContainer}>
        {ordersItems.map((item) => (
          <div
            className={
              item.color === color
                ? `${styles.colorTile} ${styles.activeTile}`
                : styles.colorTile
            }
            style={{ backgroundColor: item.color }}
            onClick={() => setColor(item.color)}
          ></div>
        ))}
      </div>
    );
  }, [color, tool, setColor]);

  const renderSizeSlider = useMemo(() => {
    return (
      <div className={styles.sizeSlider}>
        <input
          type="range"
          min={1}
          max={10}
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>
    );
  }, [size, setSize]);

  return (
    <div className={styles.menuContainer}>
      {renderToolContainer}
      {renderColorContainer}
      {renderSizeSlider}
    </div>
  );
}

export default Menu;
