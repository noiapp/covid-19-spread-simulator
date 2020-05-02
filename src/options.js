const DEFAULT_FILTERS = {
  appUsersPercentage: 25,
  death: false,
  stayHome: false
}

export const CANVAS_SIZE = {
  height: 880,
  width: 360
}

export const DESKTOP_CANVAS_SIZE = {
  height: 400,
  width: 800
}

export const BALL_RADIUS = 5
export const COLORS = {
  death: '#c50000',
  recovered: '#D88DBC',
  infected: '#5ABA4A',
  quarantine: '#FF8136',
  well: '#63C8F2',
  app_installed: '#000000'
}

export const STATES = {
  infected: 'infected',
  quarantine: 'quarantine',
  well: 'well',
  recovered: 'recovered',
  death: 'death'
}

export const PREVENTION_APP_STATES = {
  installed: 'installed',
  not_installed: 'not_installed'
}

export const COUNTERS = {
  ...STATES,
  'max-concurrent-infected': 'max-concurrent-infected'
}

export const STARTING_BALLS = {
  [STATES.infected]: 1,
  [STATES.quarantine]: 0,
  [STATES.well]: 199,
  [STATES.recovered]: 0,
  [STATES.death]: 0,
  'max-concurrent-infected': 0
}

export const RUN = {
  filters: { ...DEFAULT_FILTERS },
  results: { ...STARTING_BALLS },
  tick: 0
}

export const MORTALITY_PERCENTATGE = 5
export const SYMPTOMATIC_PERCENTAGE = 15
export const SPEED = 1
export const MAXSPEED = 10
export const TOTAL_TICKS = 1600
export const TICKS_TO_RECOVER = 500
export const STATIC_PEOPLE_PERCENTATGE = 25

export const resetRun = () => {
  RUN.results = { ...STARTING_BALLS }
  RUN.tick = 0
}
