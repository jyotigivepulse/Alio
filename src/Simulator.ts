import { Movement, Position } from './Character';
import { initialize, applyZombieMove, executeZombieBite, Board } from './Board';

export type SimulatorResult = {
  readonly zombiePositions: ReadonlyArray<Position>;
  readonly creaturePositions: ReadonlyArray<Position>;
};

export type SimulatorSetup = {
  readonly boardDimension: number;
  readonly zombiePosition: Position;
  readonly creaturePositions: ReadonlyArray<Position>;
  readonly movements: ReadonlyArray<Movement>;
};

const executeMovements = (
  board: Board,
  movements: ReadonlyArray<Movement>,
): Board => {
  const endResultBoard = movements.reduce((board, move) => {
    return executeZombieBite(applyZombieMove(board, move));
  }, board);

  if (endResultBoard.activeZombieId + 1 < endResultBoard.zombies.length) {
    return executeMovements(
      { ...endResultBoard, activeZombieId: endResultBoard.activeZombieId + 1 },
      movements,
    );
  } else {
    return endResultBoard;
  }
};

/**
 * Runs the simulation by executing the series of movements from
 * simulatorSetup.
 *
 * @param {SimulatorSetup} simulatorSetup
 * @returns {SimulatorResult}
 */
export const execute = (simulatorSetup: SimulatorSetup): SimulatorResult => {
  const initialBoard = initialize(
    simulatorSetup.boardDimension,
    simulatorSetup.zombiePosition,
    simulatorSetup.creaturePositions,
  );
  const finishedBoard = executeMovements(
    initialBoard,
    simulatorSetup.movements,
  );

  return {
    zombiePositions: finishedBoard.zombies.map(z => ({ x: z.x, y: z.y })),
    creaturePositions:finishedBoard.creatures.map(z => ({ x: z.x, y: z.y }))
  };
};
