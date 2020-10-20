/* eslint-disable react/jsx-handler-names */
import React, { useState } from 'react';
import * as topojson from 'topojson-client';
import { CustomProjection} from '@visx/geo';
import { Projection } from '@visx/geo/lib/types';
import { Zoom } from ' ';

import topology from './world-topo.json';

export type GeoCustomProps = {
  width: number;
  height: number;
  events?: boolean;
};

// dont really need this background
export const background = 'blue';

const PROJECTIONS: { [projection: string]: Projection } = {};


// we will not need the data below its dummy data
const world = topojson.feature(topology, topology.objects.units) as {};



export default function GeoCustom({ width, height, events = true }: GeoCustomProps) {
  const [setProjection] = useState<string>("forFun");

  const centerX = width / 2;
  const centerY = height / 2;
  const initialScale = (width / 630) * 100;
  console.log(world.features);
  return width < 10 ? null : (
    <>
      <Zoom
        width={width}
        height={height}
        scaleXMin={100}
        scaleXMax={1000}
        scaleYMin={100}
        scaleYMax={1000}
        transformMatrix={{
          scaleX: initialScale,
          scaleY: initialScale,
          translateX: centerX,
          translateY: centerY,
          skewX: 0,
          skewY: 0,
        }}
      >
       
        {zoom => (
          <div className="container">
            <svg width={width} height={height} className={zoom.isDragging ? 'dragging' : undefined}>
              <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
              <CustomProjection
                
                data={world.features}
                scale={zoom.transformMatrix.scaleX}
                translate={[zoom.transformMatrix.translateX, zoom.transformMatrix.translateY]}
              >
                
              </CustomProjection>

              {/** intercept all mouse events */}
              <rect
                x={0}
                y={0}
                width={width}
                height={height}
                rx={14}
                fill="transparent"
                onTouchStart={zoom.dragStart}
                onTouchMove={zoom.dragMove}
                onTouchEnd={zoom.dragEnd}
                onMouseDown={zoom.dragStart}
                onMouseMove={zoom.dragMove}
                onMouseUp={zoom.dragEnd}
                onMouseLeave={() => {
                  if (zoom.isDragging) zoom.dragEnd();
                }}
              />
            </svg>
            {events && (
              <div className="controls">
                <button
                  className="btn btn-zoom"
                  onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
                >
                  +
                </button>
                <button
                  className="btn btn-zoom btn-bottom"
                  onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
                >
                  -
                </button>
                <button className="btn btn-lg" onClick={zoom.reset}>
                  Reset
                </button>
              </div>
            )}
          </div>
        )}
      </Zoom>
      <label>
        projection:{' '}
        <select onChange={event => setProjection(event.target.value)}>
          {Object.keys(PROJECTIONS).map(projectionName => (
            <option key={projectionName} value={projectionName}>
              {projectionName}
            </option>
          ))}
        </select>
      </label>
      <style jsx>{`
        .container {
          position: relative;
        }
        svg {
          cursor: grab;
        }
        svg.dragging {
          cursor: grabbing;
        }
        .btn {
          margin: 0;
          text-align: center;
          border: none;
          background: #dde1fe;
          color: #222;
          padding: 0 4px;
          border-top: 1px solid #8993f9;
        }
        .btn-lg {
          font-size: 12px;
          line-height: 1;
          padding: 4px;
        }
        .btn-zoom {
          width: 26px;
          font-size: 22px;
        }
        .btn-bottom {
          margin-bottom: 1rem;
        }
        .controls {
          position: absolute;
          bottom: 20px;
          right: 15px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        label {
          font-size: 12px;
        }
      `}</style>
    </>
  );
}
