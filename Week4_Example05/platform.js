/*
Platform.js (Example 5)

A Platform is a single axis-aligned rectangle in the world.

Why a class for something "simple"?
- It standardizes the shape of platform data.
- It makes later upgrades easy (e.g., moving platforms, icy platforms, spikes).
- It keeps drawing code in the object that knows what it is.

In JSON, platforms are stored like:
{ "x": 0, "y": 324, "w": 640, "h": 36 } 
*/

class Platform {
  constructor({ x, y, w, h, type }) {
    // Position is the top-left corner.
    this.x = x;
    this.y = y;

    // Size (width/height).
    this.w = w;
    this.h = h;

    this.type = type || "solid";
  }

  draw(theme) {
    if (this.type === "ghost") {
      fill(255, 120, 180, 120);
    } else if (this.type === "lava") {
      fill(255, 80, 0);
    } else {
      fill(theme.platform);
    }
    rect(this.x, this.y, this.w, this.h);
  }
}
