import fs from "fs";

import { Direction } from "./types";

class PacmanSimulator {
  private gridWidth: number;
  private gridHeight: number;
  private pacmanX: number;
  private pacmanY: number;
  private pacmanFacing: Direction;
  private hasValidPlaceCommandExecuted: boolean;

  constructor(gridWidth: number, gridHeight: number) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.pacmanX = 0;
    this.pacmanY = 0;
    this.pacmanFacing = Direction.EAST;
    this.hasValidPlaceCommandExecuted = false;
  }
  /**
   * Process a single command
   * @param { string } line The command line to process
   * @return { void }
   */
  private processCommand(command: string): void {
    const trimmedCommand = command.trim();

    if (trimmedCommand !== "") {
      const parts = trimmedCommand.split(" ");
      const action = parts[0].toUpperCase();

      if (!this.hasValidPlaceCommandExecuted && action !== "PLACE") {
        // Discard commands until a valid "PLACE" command is executed
        return;
      }

      switch (action) {
        case "PLACE":
          if (parts.length < 2) {
            console.log("Invalid command: PLACE command must have arguments");
            return;
          }

          const placeArgs = parts[1].split(",");

          // Regular expression pattern to validate the format of the arguments
          const formatPattern = /^(-?\d+),(-?\d+),(NORTH|WEST|SOUTH|EAST)$/i;

          if (placeArgs.length !== 3 || !formatPattern.test(parts[1])) {
            console.log(
              'Invalid command: PLACE command arguments should be in the format "X,Y,F"'
            );
            return;
          }

          const [x, y, facing] = placeArgs;
          this.place(
            parseInt(x),
            parseInt(y),
            facing.toUpperCase() as Direction
          );
          this.hasValidPlaceCommandExecuted = true;
          break;
        case "MOVE":
          this.move();
          break;
        case "LEFT":
          this.turnLeft();
          break;
        case "RIGHT":
          this.turnRight();
          break;
        case "REPORT":
          this.report();
          break;
        default:
          console.log("Invalid command");
      }
    }
  }

  /**
   * Place the Pacman on the specified position and set the direction
   * @param { number } x Position X
   * @param { number } y Position Y
   * @param { Direction } facing Direction of Pacman
   * @return { void }
   */
  private place(x: number, y: number, facing: Direction): void {
    if (this.isValidPosition(x, y)) {
      this.pacmanX = x;
      this.pacmanY = y;
      this.pacmanFacing = facing;
    } else {
      console.log("Invalid command: PLACE command is outside the grid");
    }
  }

  /**
   * Move the Pacman one unit forward in the direction it is currently facing
   * @return { void }
   */
  private move(): void {
    let newX = this.pacmanX;
    let newY = this.pacmanY;

    switch (this.pacmanFacing) {
      case Direction.NORTH:
        newY++;
        break;
      case Direction.WEST:
        newX--;
        break;
      case Direction.SOUTH:
        newY--;
        break;
      case Direction.EAST:
        newX++;
        break;
    }

    if (this.isValidPosition(newX, newY)) {
      this.pacmanX = newX;
      this.pacmanY = newY;
    }
  }

  /**
   * Rotate the Pacman 90 degrees to the left without changing its position
   * @return { void }
   */
  private turnLeft(): void {
    const directionMap: Record<Direction, Direction> = {
      [Direction.NORTH]: Direction.WEST,
      [Direction.WEST]: Direction.SOUTH,
      [Direction.SOUTH]: Direction.EAST,
      [Direction.EAST]: Direction.NORTH,
    };
    this.pacmanFacing = directionMap[this.pacmanFacing];
  }

  /**
   * Rotate the Pacman 90 degrees to the right without changing its position
   * @return { void }
   */
  private turnRight(): void {
    const directionMap: Record<Direction, Direction> = {
      [Direction.NORTH]: Direction.EAST,
      [Direction.EAST]: Direction.SOUTH,
      [Direction.SOUTH]: Direction.WEST,
      [Direction.WEST]: Direction.NORTH,
    };
    this.pacmanFacing = directionMap[this.pacmanFacing];
  }

  /**
   * Print the current position and facing direction of the Pacman
   * @return { void }
   */
  private report(): void {
    console.log(`${this.pacmanX},${this.pacmanY},${this.pacmanFacing}`);
  }

  /**
   * Check if a position is valid within the grid
   * @param { number } x The X coordinate
   * @param { number } y The Y coordinate
   * @return { boolean } True if the position is valid, false otherwise
   */
  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight;
  }

  /**
   * Start the simulation by reading commands from the specified file
   * @param { string } fileName The path of the file to read commands from
   * @return { void }
   */
  public start(fileName: string): void {
    try {
      const data: string = fs.readFileSync(fileName, "utf-8");
      const lines: string[] = data.split(/\r?\n/); // handle different break characters in different OS

      lines.forEach((line: string) => {
        this.processCommand(line);
      });
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }
}

export default PacmanSimulator;
