import { PostConstraintType, WorkerConstraintType } from "../../../../libs/share/_general/enums/constraint-type";

export const organizationName = 'Demo Church'

export const departmentName = 'Worship Team'

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
  'Jane',
  'Alan',
  'QQ',
  'Gogo',
  'Jeffery',
  'Shu Yan',
  'Vincent',
  'Marco',
  'YL',
  'Foon',
  'Chow Sir',
  'Sunny',
  'Pakho',
  'Andrea',
  'Jason',
  'Kathryn',
  'Simmon',
  'Florence',
  'Amy',
  'Kwok Fai',
  'Betty',
  'Picnic',
  'Ka yan',
  'Louis',
];

export const postWorkers = [
  { postName: 'Audio', workerName: 'Chow Sir' },
  { postName: 'Audio', workerName: 'Louis' },
  { postName: 'Audio', workerName: 'Marco' },
  { postName: 'Audio', workerName: 'Picnic' },
  { postName: 'Drum', workerName: 'Jeffery' },
  { postName: 'Drum', workerName: 'Sunny' },
  { postName: 'Guitar', workerName: 'Gogo' },
  { postName: 'Host', workerName: 'Chow Sir' },
  { postName: 'Host', workerName: 'Foon' },
  { postName: 'Host', workerName: 'Jane' },
  { postName: 'Host', workerName: 'Kwok Fai' },
  { postName: 'Host', workerName: 'Simmon' },
  { postName: 'Keyboard', workerName: 'QQ' },
  { postName: 'Powerpoint', workerName: 'Andrea' },
  { postName: 'Powerpoint', workerName: 'Ka yan' },
  { postName: 'Powerpoint', workerName: 'YL' },
  { postName: 'Vocal Male', workerName: 'Jason' },
  { postName: 'Vocal Male', workerName: 'Pakho' },
  { postName: 'Vocal Male', workerName: 'Vincent' },
  { postName: 'Vocal Female', workerName: 'Amy' },
  { postName: 'Vocal Female', workerName: 'Kathryn' },
  { postName: 'Vocal Female', workerName: 'Shu Yan' },
  { postName: 'Worship Leader', workerName: 'Alan' },
  { postName: 'Worship Leader', workerName: 'Betty' },
  { postName: 'Worship Leader', workerName: 'Chow Sir' },
  { postName: 'Worship Leader', workerName: 'Florence' },
  { postName: 'Worship Leader', workerName: 'Jason' },
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
    workerNames: ['Jason', 'Kathryn'],
  },
  {
    constraintTypeEnum: WorkerConstraintType.CORRELATE,
    weighting: 1,
    workerNames: ['Ka yan', 'Louis'],
  },
]