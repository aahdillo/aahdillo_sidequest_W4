## Project Title

GBDA302 Week 4: Build on Blob Example from Class

---

## Authors

Alexandra Dillon, aahdillo, 21092757
Karen Cochrane and David Han

---

## Description

This p5.js project is a simple game where you control a ball. I decided to add two new levels ontop of the already existing level to make the game more challenging.
In the game you can jump across solid platforms, fall through ghost platmorms, and try to avoid lava to reach the top of each level.

---

## Setup and Interaction Instructons

## Use the arrow keys or A/D to move the blob left or right. Press the spacebar, W, or the upward facing key to jump. Your goal is to reach the top of each level. Some platforms are solid, some are ghost (you can fall through), and some are lave (touching them respawns you). You can skip to the next level by pressin N.

## Iteration Notes

- the blob didnt show up for level 3 at first becuase of a mismatch between spawn coordinates and the canvas size.
- Some platforms were duplicated in the level data which caused unreachable areas. i had to clean this up
- I added a respawn function to reset the blob when it touches the lava
- Ghost platforms were initially treated like solid platforms in the collision code, so i had to fix the update() method in blobPlayer.js to ignore them for collisions.

---

## Assets

N/A

---

## GenAI

GenAI suggested how to implement ghost and lava platforms and helped with debugging collision issues when the blob wasnt showing up

---
