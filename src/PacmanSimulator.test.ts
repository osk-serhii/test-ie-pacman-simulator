import fs from "fs";

import PacmanSimulator from "./PacmanSimulator";
import { Direction } from "./types";

const TEST_INPUT_FILENAME = "test-input.txt";

const testData = [
  {
    // simple move
    input: `
      PLACE 0,0,NORTH

      MOVE
      
      REPORT
    `,
    output: "0,1,NORTH",
  },
  {
    // simple rotate
    input: `
      PLACE 0,0,NORTH

      LEFT
      
      REPORT
    `,
    output: "0,0,WEST",
  },
  {
    // mix of correct move and rotate
    input: `
      PLACE 1,2,EAST

      MOVE
      
      MOVE
      
      LEFT
      
      MOVE
      
      REPORT
    `,
    output: "3,3,NORTH",
  },
  {
    // Invalid move
    input: `
      PLACE 1,1,WEST

      MOVE

      MOVE

      MOVE
      
      REPORT
    `,
    output: "0,1,WEST",
  },
  {
    // Correct move after invalid move
    input: `
      PLACE 1,1,WEST

      MOVE

      MOVE

      MOVE

      RIGHT

      MOVE

      RIGHT

      MOVE
      
      REPORT
    `,
    output: "1,2,EAST",
  },
  {
    // Invalid placement
    input: `
      PLACE -1,1,EAST
      
      REPORT
    `,
    output: "0,0,EAST",
  },
  {
    // Commands after invalid placement
    input: `
      PLACE -1,1,EAST

      MOVE

      MOVE

      RIGHT

      MOVE

      RIGHT

      MOVE

      MOVE
      
      REPORT
    `,
    output: "0,0,EAST",
  },
  {
    // Multiple placement
    input: `
      PLACE 1,1,EAST

      MOVE

      MOVE

      PLACE 3,3,EAST

      MOVE

      LEFT
      
      REPORT
    `,
    output: "4,3,NORTH",
  },
];

describe("PacmanSimulator", () => {
  let simulator: PacmanSimulator;
  const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

  beforeEach(() => {
    fs.writeFileSync(TEST_INPUT_FILENAME, "");

    // Create a new instance of PacmanSimulator
    simulator = new PacmanSimulator(5, 5);
  });

  afterAll(() => {
    fs.unlinkSync(TEST_INPUT_FILENAME);
  });

  test("Simple move", () => {
    // Write the test commands
    const data = testData[0];
    fs.writeFileSync(TEST_INPUT_FILENAME, data.input);

    simulator.start(TEST_INPUT_FILENAME);

    // Assert the console.log output
    expect(consoleLogMock).toHaveBeenCalledWith(data.output);
  });

  test("Simple rotate", () => {
    // Write the test commands
    const data = testData[1];
    fs.writeFileSync(TEST_INPUT_FILENAME, data.input);

    simulator.start(TEST_INPUT_FILENAME);

    // Assert the console.log output
    expect(consoleLogMock).toHaveBeenCalledWith(data.output);
  });

  test("Mix of correct move and rotate", () => {
    // Write the test commands
    const data = testData[2];
    fs.writeFileSync(TEST_INPUT_FILENAME, data.input);

    simulator.start(TEST_INPUT_FILENAME);

    // Assert the console.log output
    expect(consoleLogMock).toHaveBeenCalledWith(data.output);
  });

  test("Should prevent any invalid movement (any movement off the grid)", () => {
    // Write the test commands
    const data = testData[3];
    fs.writeFileSync(TEST_INPUT_FILENAME, data.input);

    simulator.start(TEST_INPUT_FILENAME);

    // Assert the console.log output
    expect(consoleLogMock).toHaveBeenCalledWith(data.output);
  });

  test("Should accept valid movements even after invalid move", () => {
    // Write the test commands
    const data = testData[4];
    fs.writeFileSync(TEST_INPUT_FILENAME, data.input);

    simulator.start(TEST_INPUT_FILENAME);

    // Assert the console.log output
    expect(consoleLogMock).toHaveBeenCalledWith(data.output);
  });

  test("Should not accept invalid placement", () => {
    // Write the test commands
    const data = testData[5];
    fs.writeFileSync(TEST_INPUT_FILENAME, data.input);

    simulator.start(TEST_INPUT_FILENAME);

    // Assert the console.log output
    expect(consoleLogMock).toHaveBeenCalledWith(data.output);
  });

  test("Should discard all commands until a valid placement", () => {
    // Write the test commands
    const data = testData[6];
    fs.writeFileSync(TEST_INPUT_FILENAME, data.input);

    simulator.start(TEST_INPUT_FILENAME);

    // Assert the console.log output
    expect(consoleLogMock).toHaveBeenCalledWith(data.output);
  });

  test("Should accept future placement again", () => {
    // Write the test commands
    const data = testData[7];
    fs.writeFileSync(TEST_INPUT_FILENAME, data.input);

    simulator.start(TEST_INPUT_FILENAME);

    // Assert the console.log output
    expect(consoleLogMock).toHaveBeenCalledWith(data.output);
  });

  test("Correct workflow with correct calling of each method", () => {
    // Write the test commands
    const data = testData[7];
    fs.writeFileSync(TEST_INPUT_FILENAME, data.input);

    const placeMock = jest
      .spyOn<any, any>(simulator, "place")
      .mockImplementation();
    const moveMock = jest
      .spyOn<any, any>(simulator, "move")
      .mockImplementation();
    const turnLeftMock = jest
      .spyOn<any, any>(simulator, "turnLeft")
      .mockImplementation();
    const reportMock = jest
      .spyOn<any, any>(simulator, "report")
      .mockImplementation();

    simulator.start(TEST_INPUT_FILENAME);

    // Assert the private methods calls
    expect(placeMock).toHaveBeenCalledWith(1, 1, Direction.EAST);
    expect(placeMock).toHaveBeenCalledTimes(2);
    expect(moveMock).toHaveBeenCalledTimes(3);
    expect(turnLeftMock).toHaveBeenCalledTimes(1);
    expect(reportMock).toHaveBeenCalledTimes(1);

    // Cleanup mock
    placeMock.mockRestore();
    moveMock.mockRestore();
    turnLeftMock.mockRestore();
    reportMock.mockRestore();
  });
});
