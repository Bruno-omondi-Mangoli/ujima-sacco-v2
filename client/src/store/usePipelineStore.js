import { create } from 'zustand'

const usePipelineStore = create((set, get) => ({
  // Selected member
  member: null,
  setMember: (member) => set({
    member,
    scoutResult:   null,
    guardianResult: null,
    hunterResult:  null,
    humanDecision: null,
    stage: 'IDLE'
  }),

  // Agent results
  scoutResult:    null,
  guardianResult: null,
  hunterResult:   null,
  humanDecision:  null,

  // Loading states per agent
  loading: { scout: false, guardian: false, hunter: false },

  // Current stage
  stage: 'IDLE', // IDLE | SCOUT | GUARDIAN | HUNTER | HUMAN | COMPLETE

  // Actions
  setScoutResult: (result) => set({ scoutResult: result, stage: 'GUARDIAN' }),
  setGuardianResult: (result) => set({ guardianResult: result, stage: 'HUNTER' }),
  setHunterResult: (result) => set({ hunterResult: result, stage: 'HUMAN' }),
  setHumanDecision: (decision) => set({ humanDecision: decision, stage: 'COMPLETE' }),

  setLoading: (agent, val) => set(s => ({
    loading: { ...s.loading, [agent]: val }
  })),

  reset: () => set({
    member:         null,
    scoutResult:    null,
    guardianResult: null,
    hunterResult:   null,
    humanDecision:  null,
    stage:          'IDLE',
    loading:        { scout: false, guardian: false, hunter: false }
  })
}))

export default usePipelineStore