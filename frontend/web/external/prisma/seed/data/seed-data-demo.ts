import { PostConstraintType, WorkerConstraintType } from "../../../../libs/constraint/enums/constraint-type";

export const organizationName = 'Faith Church'
export const organizationMaxHistoryCount = 5

export const departmentName = 'Worship Team A'
export const departmentMaxWorkerPostPerRoster = 2

export const postNames = [
  'Host',
  'Worship Leader',
  'Keyboard',
  'Guitar',
  'Drum',
  'Bass',
  'Vocal Female',
  'Vocal Male',
  'Audio',
  'Powerpoint',
]

export const workerNames = [
  'David',
  'Peter',
  'Michael',
  'Michelle',
  'Alice',
  'Sarah',
  'Chris',
  'Karen',
  'Jennifer',
  'Alex',
  'Sonija',
  'Ken',
  'Jason',
  'Eric',
  'Anson',
  'Eason',
  'Amy',
  'Manson',
  'Winnie',
  'Dicky',
  'Hacken',
  'Rayson',
  'Alan',
  'Kith',
  'Sabina',
];

export const postWorkers = [
  { postName: 'Audio', workerName: 'David' },
  { postName: 'Audio', workerName: 'Peter' },
  { postName: 'Audio', workerName: 'Michael' },
  { postName: 'Audio', workerName: 'Alan' },
  { postName: 'Drum', workerName: 'Jason' },
  { postName: 'Drum', workerName: 'Eric' },
  { postName: 'Guitar', workerName: 'Alex' },
  { postName: 'Guitar', workerName: 'Ken' },
  { postName: 'Host', workerName: 'Michelle' },
  { postName: 'Host', workerName: 'Alice' },
  { postName: 'Host', workerName: 'Sarah' },
  { postName: 'Host', workerName: 'Chris' },
  { postName: 'Host', workerName: 'Karen' },
  { postName: 'Keyboard', workerName: 'Jennifer' },
  { postName: 'Keyboard', workerName: 'Sonija' },
  { postName: 'Powerpoint', workerName: 'Kith' },
  { postName: 'Powerpoint', workerName: 'Sabina' },
  { postName: 'Powerpoint', workerName: 'Amy' },
  { postName: 'Vocal Male', workerName: 'Manson' },
  { postName: 'Vocal Male', workerName: 'Dicky' },
  { postName: 'Vocal Male', workerName: 'Hacken' },
  { postName: 'Vocal Male', workerName: 'Rayson' },
  { postName: 'Vocal Female', workerName: 'Winnie' },
  { postName: 'Vocal Female', workerName: 'Amy' },
  { postName: 'Vocal Female', workerName: 'Sabina' },
  { postName: 'Worship Leader', workerName: 'Alan' },
  { postName: 'Worship Leader', workerName: 'Jason' },
  { postName: 'Worship Leader', workerName: 'Dicky' },
  { postName: 'Worship Leader', workerName: 'Winnie' },
  { postName: 'Worship Leader', workerName: 'Sabina' },
]

export const postConstraints = [
  {
    constraintTypeEnum: PostConstraintType.AT_LEAST_1_WORKER_PER_DAY,
    weighting: 1,
    postNames: ['Keyboard', 'Guitar'],
  },
]

export const workerConstraints = [
  {
    constraintTypeEnum: WorkerConstraintType.CORRELATE,
    weighting: 1,
    workerNames: ['Jason', 'Amy'],
  },
  {
    constraintTypeEnum: WorkerConstraintType.CORRELATE,
    weighting: 1,
    workerNames: ['Alan', 'Sabina'],
  },
]