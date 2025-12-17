export default class PressureSystem {
  private grid: { value: number; gangId: string; aggression: number; }[][];
  private tileSize: number;
  private width: number;
  private height: number;

  constructor(worldWidth: number, worldHeight: number, tileSize: number) {
    this.tileSize = tileSize;
    this.width = Math.floor(worldWidth / tileSize);
    this.height = Math.floor(worldHeight / tileSize);
    this.grid = Array.from({ length: this.height }, () => 
      Array(this.width).fill({ value: 0, gangId: '', aggression: 1 })
    );
  }

  updatePressure(x: number, y: number, delta: number, gangId: string) {
    const gx = Math.floor(x / this.tileSize);
    const gy = Math.floor(y / this.tileSize);
    if (gx >= 0 && gx < this.width && gy >= 0 && gy < this.height) {
      const tile = this.grid[gy][gx];
      tile.value = Phaser.Math.Clamp(tile.value + delta, 10, 100);
      tile.gangId = gangId;
      tile.aggression = 1 + (tile.value / 100);
    }
  }

  getPressure(x: number, y: number): number {
    const gx = Math.floor(x / this.tileSize);
    const gy = Math.floor(y / this.tileSize);
    return this.grid[gy]?.[gx]?.value ?? 0;
  }

  recalculate() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.grid[y][x];
        tile.value = Math.max(10, tile.value - 0.1);
        if (tile.value > 50) {
          const neighbors = [[x-1, y], [x+1, y], [x, y-1], [x, y+1]];
          neighbors.forEach(([nx, ny]) => {
            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
              this.grid[ny][nx].value += 0.5;
            }
          });
        }
      }
    }
  }

  partialReset() {
    this.grid.forEach(row => row.forEach(tile => tile.value /= 2));
  }
}