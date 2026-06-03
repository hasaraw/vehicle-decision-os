export const vehicleIds = ['leaf', 's05', 's07'] as const

export type VehicleId = (typeof vehicleIds)[number]

export type PageId =
  | 'dashboard'
  | 'profiles'
  | 'experience'
  | 'ownership'
  | 'reflection'
  | 'hasara'
  | 'comparison'
  | 'recommendation'

export type RatingSection = 'experience' | 'ownership'

export interface Vehicle {
  id: VehicleId
  name: string
  shortName: string
  role: string
  badge: string
  image: string
  accent: string
  description: string
  fitSignals: string[]
}

export interface Category {
  id: string
  label: string
}

export interface RatingEntry {
  score: number
  notes: string
  photos: string[]
  completed: boolean
}

export type RatingMap = Record<string, RatingEntry>
export type VehicleRatingMap = Record<VehicleId, RatingMap>
export type ReflectionMap = Record<VehicleId, Record<string, string>>
export type ComparisonMap = Record<string, Record<VehicleId, string>>

export interface Weights {
  experience: number
  ownership: number
  emotion: number
}

export interface AppState {
  version: 1
  profileNotes: Record<VehicleId, string>
  galleries: Record<VehicleId, string[]>
  experience: VehicleRatingMap
  ownership: VehicleRatingMap
  reflections: ReflectionMap
  hasaraChoice: VehicleId | null
  comparison: ComparisonMap
  weights: Weights
  updatedAt: string
}

export interface ScoreRow {
  id: VehicleId
  experience: number
  ownership: number
  emotion: number
  logical: number
  overall: number
}

export interface CompletionStatus {
  completed: number
  total: number
  percent: number
}

export interface Recommendation {
  winner: ScoreRow
  runnerUp: ScoreRow
  confidence: number
  gap: number
  safetyMessage: string
  topReasons: string[]
  reasonsNot: string[]
  unknowns: string[]
  questions: string[]
  risks: string[]
  summary: string
}

export const vehicles: Record<VehicleId, Vehicle> = {
  leaf: {
    id: 'leaf',
    name: 'Nissan Leaf 2014',
    shortName: 'Leaf',
    role: 'Current vehicle',
    badge: 'Baseline',
    image: '/vehicle-images/leaf-baseline.png',
    accent: '#63e6be',
    description:
      'The known reference point. Every upgrade has to prove it improves real daily life, not just the spec sheet.',
    fitSignals: ['Known costs', 'Familiar rhythm', 'Baseline comfort'],
  },
  s05: {
    id: 's05',
    name: 'Deepal S05 REEV',
    shortName: 'S05 REEV',
    role: 'Practical Challenger',
    badge: 'Value Pick',
    image: '/vehicle-images/s05-reev.png',
    accent: '#36d7ff',
    description:
      'The pragmatic step up. The question is whether it adds enough comfort, range confidence, and tech without overreaching.',
    fitSignals: ['Value tension', 'Range confidence', 'Daily practicality'],
  },
  s07: {
    id: 's07',
    name: 'Deepal S07',
    shortName: 'S07',
    role: 'Flagship Spaceship',
    badge: 'Premium Pick',
    image: '/vehicle-images/s07.png',
    accent: '#b491ff',
    description:
      'The emotional ceiling. The question is whether the premium experience still makes sense after the first-week glow fades.',
    fitSignals: ['Premium cabin', 'Future-tech pull', 'Long-term desire'],
  },
}

export const experienceCategories: Category[] = [
  { id: 'exteriorPresence', label: 'Exterior Presence' },
  { id: 'interiorQuality', label: 'Interior Quality' },
  { id: 'seatComfort', label: 'Seat Comfort' },
  { id: 'drivingPosition', label: 'Driving Position' },
  { id: 'visibility', label: 'Visibility' },
  { id: 'roadPresence', label: 'Road Presence' },
  { id: 'technologyWow', label: 'Technology Wow Factor' },
  { id: 'hudExperience', label: 'HUD Experience' },
  { id: 'screenExperience', label: 'Screen Experience' },
  { id: 'audioQuality', label: 'Audio Quality' },
  { id: 'ambientLighting', label: 'Ambient Lighting' },
  { id: 'panoramicRoof', label: 'Panoramic Roof Experience' },
  { id: 'nightDriveVibe', label: 'Night Drive Vibe' },
  { id: 'futureTechFeel', label: 'Future-Tech Feel' },
  { id: 'makesMeSmile', label: 'Makes Me Smile' },
  { id: 'takeLongWayHome', label: 'Would Take The Long Way Home' },
]

export const ownershipCategories: Category[] = [
  { id: 'garageFit', label: 'Garage Fit' },
  { id: 'chargingConvenience', label: 'Charging Convenience' },
  { id: 'dailyConvenience', label: 'Daily Convenience' },
  { id: 'familyFriendliness', label: 'Family Friendliness' },
  { id: 'dealerConfidence', label: 'Dealer Confidence' },
  { id: 'partsAvailability', label: 'Parts Availability Confidence' },
  { id: 'warrantyConfidence', label: 'Warranty Confidence' },
  { id: 'longTermOwnership', label: 'Long-Term Ownership Confidence' },
  { id: 'futureMaintenance', label: 'Future Maintenance Confidence' },
  { id: 'valueForMoney', label: 'Value For Money' },
  { id: 'futureFunCompatibility', label: 'Future Fun Car Compatibility' },
]

export const reflectionQuestions: Category[] = [
  { id: 'surprised', label: 'What surprised me?' },
  { id: 'disappointed', label: 'What disappointed me?' },
  { id: 'excited', label: 'What excited me most?' },
  { id: 'annoySixMonths', label: 'What would annoy me after six months?' },
  { id: 'wantTomorrow', label: 'Would I still want this tomorrow?' },
  { id: 'sameCostChoice', label: 'If all three cost the same, which would I choose?' },
  { id: 'fiveYearChoice', label: 'If I could only keep one for five years, which would I choose?' },
]

export const comparisonFields: Category[] = [
  { id: 'price', label: 'Price' },
  { id: 'length', label: 'Length' },
  { id: 'width', label: 'Width' },
  { id: 'wheelbase', label: 'Wheelbase' },
  { id: 'batterySize', label: 'Battery Size' },
  { id: 'motorPower', label: 'Motor Power' },
  { id: 'torque', label: 'Torque' },
  { id: 'driveType', label: 'Drive Type' },
  { id: 'range', label: 'Range' },
  { id: 'combinedRange', label: 'Combined Range' },
  { id: 'warranty', label: 'Warranty' },
  { id: 'dealerSupport', label: 'Dealer Support' },
  { id: 'chargingSpeed', label: 'Charging Speed' },
  { id: 'maintenanceComplexity', label: 'Maintenance Complexity' },
]

export const upgradeCategories: Category[] = [
  { id: 'technology', label: 'Technology Upgrade' },
  { id: 'comfort', label: 'Comfort Upgrade' },
  { id: 'audio', label: 'Audio Upgrade' },
  { id: 'range', label: 'Range Upgrade' },
  { id: 'performance', label: 'Performance Upgrade' },
  { id: 'interior', label: 'Interior Upgrade' },
  { id: 'lifestyle', label: 'Lifestyle Upgrade' },
]

const emotionalCategoryIds = [
  'nightDriveVibe',
  'futureTechFeel',
  'makesMeSmile',
  'takeLongWayHome',
  'roadPresence',
]

const logicalExperienceIds = [
  'seatComfort',
  'drivingPosition',
  'visibility',
  'screenExperience',
  'audioQuality',
]

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))

const createRatingMap = (categories: Category[]): RatingMap =>
  categories.reduce<RatingMap>((map, category) => {
    map[category.id] = { score: 5, notes: '', photos: [], completed: false }
    return map
  }, {})

const createVehicleRatings = (categories: Category[]): VehicleRatingMap =>
  vehicleIds.reduce<VehicleRatingMap>((map, id) => {
    map[id] = createRatingMap(categories)
    return map
  }, {} as VehicleRatingMap)

const createReflections = (): ReflectionMap =>
  vehicleIds.reduce<ReflectionMap>((map, id) => {
    map[id] = reflectionQuestions.reduce<Record<string, string>>((answers, question) => {
      answers[question.id] = ''
      return answers
    }, {})
    return map
  }, {} as ReflectionMap)

const defaultComparisonValue = (fieldId: string, vehicleId: VehicleId) => {
  if (fieldId === 'price' && vehicleId === 'leaf') return 'Already owned'
  if (fieldId === 'dealerSupport' && vehicleId === 'leaf') return 'Known baseline'
  if (fieldId === 'maintenanceComplexity' && vehicleId === 'leaf') return 'Known baseline'
  if (fieldId === 'price') return 'Confirm offer'
  if (fieldId === 'warranty') return 'Confirm terms'
  return 'Confirm at dealer'
}

const createComparison = (): ComparisonMap =>
  comparisonFields.reduce<ComparisonMap>((map, field) => {
    map[field.id] = vehicleIds.reduce<Record<VehicleId, string>>((values, id) => {
      values[id] = defaultComparisonValue(field.id, id)
      return values
    }, {} as Record<VehicleId, string>)
    return map
  }, {})

export const createDefaultState = (): AppState => ({
  version: 1,
  profileNotes: { leaf: '', s05: '', s07: '' },
  galleries: { leaf: [], s05: [], s07: [] },
  experience: createVehicleRatings(experienceCategories),
  ownership: createVehicleRatings(ownershipCategories),
  reflections: createReflections(),
  hasaraChoice: null,
  comparison: createComparison(),
  weights: { experience: 40, ownership: 30, emotion: 30 },
  updatedAt: new Date().toISOString(),
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const mergeRatingEntry = (value: unknown): RatingEntry => {
  if (!isRecord(value)) return { score: 5, notes: '', photos: [], completed: false }
  const score = typeof value.score === 'number' ? clamp(value.score, 1, 10) : 5
  const notes = typeof value.notes === 'string' ? value.notes : ''
  const photos = Array.isArray(value.photos)
    ? value.photos.filter((photo): photo is string => typeof photo === 'string')
    : []
  const completed = Boolean(value.completed || notes.trim() || photos.length)
  return { score, notes, photos, completed }
}

const mergeVehicleRatings = (value: unknown, categories: Category[]): VehicleRatingMap => {
  const fallback = createVehicleRatings(categories)
  if (!isRecord(value)) return fallback
  return vehicleIds.reduce<VehicleRatingMap>((map, vehicleId) => {
    const vehicleValue = isRecord(value[vehicleId]) ? value[vehicleId] : {}
    map[vehicleId] = categories.reduce<RatingMap>((ratings, category) => {
      ratings[category.id] = mergeRatingEntry(vehicleValue[category.id])
      return ratings
    }, {})
    return map
  }, {} as VehicleRatingMap)
}

const mergeReflections = (value: unknown): ReflectionMap => {
  const fallback = createReflections()
  if (!isRecord(value)) return fallback
  return vehicleIds.reduce<ReflectionMap>((map, vehicleId) => {
    const candidateVehicleValue = value[vehicleId]
    const vehicleValue: Record<string, unknown> = isRecord(candidateVehicleValue)
      ? candidateVehicleValue
      : {}
    map[vehicleId] = reflectionQuestions.reduce<Record<string, string>>((answers, question) => {
      const answer = vehicleValue[question.id]
      answers[question.id] = typeof answer === 'string' ? answer : ''
      return answers
    }, {})
    return map
  }, {} as ReflectionMap)
}

const mergeComparison = (value: unknown): ComparisonMap => {
  const fallback = createComparison()
  if (!isRecord(value)) return fallback
  return comparisonFields.reduce<ComparisonMap>((map, field) => {
    const candidateFieldValue = value[field.id]
    const fieldValue: Record<string, unknown> = isRecord(candidateFieldValue) ? candidateFieldValue : {}
    map[field.id] = vehicleIds.reduce<Record<VehicleId, string>>((values, vehicleId) => {
      const candidate = fieldValue[vehicleId]
      values[vehicleId] = typeof candidate === 'string' ? candidate : fallback[field.id][vehicleId]
      return values
    }, {} as Record<VehicleId, string>)
    return map
  }, {})
}

const mergeTextRecord = (value: unknown): Record<VehicleId, string> =>
  vehicleIds.reduce<Record<VehicleId, string>>((map, vehicleId) => {
    map[vehicleId] =
      isRecord(value) && typeof value[vehicleId] === 'string' ? value[vehicleId] : ''
    return map
  }, {} as Record<VehicleId, string>)

const mergeGalleryRecord = (value: unknown): Record<VehicleId, string[]> =>
  vehicleIds.reduce<Record<VehicleId, string[]>>((map, vehicleId) => {
    const candidate = isRecord(value) ? value[vehicleId] : undefined
    map[vehicleId] = Array.isArray(candidate)
      ? candidate.filter((photo): photo is string => typeof photo === 'string')
      : []
    return map
  }, {} as Record<VehicleId, string[]>)

const mergeWeights = (value: unknown): Weights => {
  if (!isRecord(value)) return { experience: 40, ownership: 30, emotion: 30 }
  return {
    experience: typeof value.experience === 'number' ? clamp(value.experience, 0, 100) : 40,
    ownership: typeof value.ownership === 'number' ? clamp(value.ownership, 0, 100) : 30,
    emotion: typeof value.emotion === 'number' ? clamp(value.emotion, 0, 100) : 30,
  }
}

export const mergeAppState = (value: unknown): AppState => {
  const base = createDefaultState()
  if (!isRecord(value)) return base
  const hasaraChoice = vehicleIds.includes(value.hasaraChoice as VehicleId)
    ? (value.hasaraChoice as VehicleId)
    : null
  return {
    version: 1,
    profileNotes: mergeTextRecord(value.profileNotes),
    galleries: mergeGalleryRecord(value.galleries),
    experience: mergeVehicleRatings(value.experience, experienceCategories),
    ownership: mergeVehicleRatings(value.ownership, ownershipCategories),
    reflections: mergeReflections(value.reflections),
    hasaraChoice,
    comparison: mergeComparison(value.comparison),
    weights: mergeWeights(value.weights),
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : base.updatedAt,
  }
}

const averageRatings = (ratings: RatingMap, ids?: string[]) => {
  const ratingIds = ids ?? Object.keys(ratings)
  if (!ratingIds.length) return 50
  const total = ratingIds.reduce((sum, id) => sum + (ratings[id]?.score ?? 5), 0)
  return (total / ratingIds.length) * 10
}

const averageMixedSources = (state: AppState, vehicleId: VehicleId, sources: string[]) => {
  const values = sources.map((source) => {
    const [section, id] = source.split(':')
    if (section === 'ownership') return (state.ownership[vehicleId][id]?.score ?? 5) * 10
    return (state.experience[vehicleId][id]?.score ?? 5) * 10
  })
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export const getScores = (state: AppState): ScoreRow[] => {
  const totalWeight = state.weights.experience + state.weights.ownership + state.weights.emotion || 1
  return vehicleIds.map((id) => {
    const experience = averageRatings(state.experience[id])
    const ownership = averageRatings(state.ownership[id])
    const emotionBase = averageRatings(state.experience[id], emotionalCategoryIds)
    const hasaraBoost = state.hasaraChoice ? (state.hasaraChoice === id ? 18 : -6) : 0
    const emotion = clamp(emotionBase + hasaraBoost)
    const logicalExperience = averageRatings(state.experience[id], logicalExperienceIds)
    const logical = logicalExperience * 0.35 + ownership * 0.65
    const overall =
      (experience * state.weights.experience +
        ownership * state.weights.ownership +
        emotion * state.weights.emotion) /
      totalWeight
    return {
      id,
      experience,
      ownership,
      emotion,
      logical,
      overall,
    }
  })
}

export const getCompletion = (state: AppState): CompletionStatus => {
  let completed = state.hasaraChoice ? 1 : 0
  let total = 1

  vehicleIds.forEach((vehicleId) => {
    experienceCategories.forEach((category) => {
      total += 1
      if (state.experience[vehicleId][category.id].completed) completed += 1
    })
    ownershipCategories.forEach((category) => {
      total += 1
      if (state.ownership[vehicleId][category.id].completed) completed += 1
    })
    reflectionQuestions.forEach((question) => {
      total += 1
      if (state.reflections[vehicleId][question.id].trim()) completed += 1
    })
  })

  return { completed, total, percent: Math.round((completed / total) * 100) }
}

export const getSortedScores = (state: AppState) =>
  [...getScores(state)].sort((a, b) => b.overall - a.overall)

export const getRadarData = (scores: ScoreRow[]) => [
  {
    metric: 'Experience',
    Leaf: Math.round(scores.find((score) => score.id === 'leaf')?.experience ?? 0),
    S05: Math.round(scores.find((score) => score.id === 's05')?.experience ?? 0),
    S07: Math.round(scores.find((score) => score.id === 's07')?.experience ?? 0),
  },
  {
    metric: 'Ownership',
    Leaf: Math.round(scores.find((score) => score.id === 'leaf')?.ownership ?? 0),
    S05: Math.round(scores.find((score) => score.id === 's05')?.ownership ?? 0),
    S07: Math.round(scores.find((score) => score.id === 's07')?.ownership ?? 0),
  },
  {
    metric: 'Emotion',
    Leaf: Math.round(scores.find((score) => score.id === 'leaf')?.emotion ?? 0),
    S05: Math.round(scores.find((score) => score.id === 's05')?.emotion ?? 0),
    S07: Math.round(scores.find((score) => score.id === 's07')?.emotion ?? 0),
  },
]

export const getUpgradeScores = (state: AppState, vehicleId: Exclude<VehicleId, 'leaf'>) => {
  const sources: Record<string, string[]> = {
    technology: [
      'experience:technologyWow',
      'experience:hudExperience',
      'experience:screenExperience',
      'experience:futureTechFeel',
    ],
    comfort: ['experience:interiorQuality', 'experience:seatComfort', 'experience:drivingPosition'],
    audio: ['experience:audioQuality'],
    range: ['ownership:chargingConvenience', 'ownership:dailyConvenience'],
    performance: ['experience:roadPresence', 'experience:takeLongWayHome'],
    interior: ['experience:interiorQuality', 'experience:ambientLighting', 'experience:panoramicRoof'],
    lifestyle: [
      'ownership:familyFriendliness',
      'ownership:valueForMoney',
      'ownership:futureFunCompatibility',
      'experience:makesMeSmile',
    ],
  }

  return upgradeCategories.map((category) => {
    const challenger = averageMixedSources(state, vehicleId, sources[category.id])
    const baseline = averageMixedSources(state, 'leaf', sources[category.id])
    return {
      id: category.id,
      label: category.label,
      value: Math.round(clamp(50 + (challenger - baseline))),
    }
  })
}

const completedRatingsForVehicle = (state: AppState, vehicleId: VehicleId) => {
  const experience = experienceCategories.map((category) => ({
    label: category.label,
    section: 'experience',
    ...state.experience[vehicleId][category.id],
  }))
  const ownership = ownershipCategories.map((category) => ({
    label: category.label,
    section: 'ownership',
    ...state.ownership[vehicleId][category.id],
  }))
  return [...experience, ...ownership].filter((entry) => entry.completed)
}

const ensureFive = (items: string[], fallback: string[]) =>
  [...items, ...fallback].filter(Boolean).slice(0, 5)

export const getRecommendation = (state: AppState): Recommendation => {
  const [winner, runnerUp] = getSortedScores(state)
  const completion = getCompletion(state)
  const gap = Math.max(0, winner.overall - runnerUp.overall)
  const winnerVehicle = vehicles[winner.id]
  const completedRatings = completedRatingsForVehicle(state, winner.id)
  const highRatings = completedRatings
    .filter((entry) => entry.score >= 8)
    .sort((a, b) => b.score - a.score)
    .map((entry) => `${entry.label} scored ${entry.score}/10 for the ${winnerVehicle.shortName}.`)
  const lowRatings = completedRatings
    .filter((entry) => entry.score <= 5)
    .sort((a, b) => a.score - b.score)
    .map((entry) => `${entry.label} is still a concern at ${entry.score}/10.`)
  const hasaraReason =
    state.hasaraChoice === winner.id
      ? [`It won the 11:00 PM emotional test, which carries extra weight here.`]
      : []

  const comparisonUnknowns = comparisonFields
    .filter((field) => /confirm/i.test(state.comparison[field.id][winner.id]))
    .map((field) => `${field.label} for the ${winnerVehicle.shortName}`)

  const reflectionUnknowns = reflectionQuestions
    .filter((question) => !state.reflections[winner.id][question.id].trim())
    .map((question) => question.label)

  const ownershipRisks = ['dealerConfidence', 'partsAvailability', 'warrantyConfidence', 'futureMaintenance']
    .map((id) => {
      const category = ownershipCategories.find((item) => item.id === id)
      const entry = state.ownership[winner.id][id]
      if (!category || entry.score > 6) return ''
      return `${category.label} needs another look.`
    })
    .filter(Boolean)

  let safetyMessage = 'Stop researching. Sleep on it. Revisit tomorrow.'
  if (completion.percent < 70) safetyMessage = 'More information required before making a decision.'
  else if (gap <= 5) safetyMessage = 'The decision is too close. Consider a second visit.'

  let confidence = clamp(completion.percent * 0.45 + gap * 4 + winner.overall * 0.25, 1, 98)
  if (completion.percent < 70) confidence = Math.min(confidence, 58)
  if (gap <= 5) confidence = Math.min(confidence, 72)

  const topReasons = ensureFive([...hasaraReason, ...highRatings], [
    `${winnerVehicle.shortName} is currently ahead in weighted scoring.`,
    `Its role as ${winnerVehicle.role.toLowerCase()} matches the strongest current signals.`,
    `The score balance favors life-fit over a single isolated category.`,
    `Current notes do not overturn its lead.`,
    `It remains competitive after ownership weighting is applied.`,
  ])

  const reasonsNot = ensureFive(lowRatings, [
    `The lead may change after more dealership observations.`,
    `Unconfirmed ownership details could affect the decision.`,
    `A second test drive may expose comfort or visibility issues.`,
    `Dealer support should be validated before commitment.`,
    `The emotional pull needs to survive an overnight pause.`,
  ])

  const unknowns = ensureFive(comparisonUnknowns, [
    'Final drive-away price',
    'Warranty exclusions',
    'Dealer response quality',
    'Real-world charging rhythm',
    'Parts availability timeline',
  ])

  const questions = ensureFive(reflectionUnknowns, [
    'Would I still choose this after sleeping on it?',
    'What compromise will bother me six months from now?',
    'Does this car fit my future fun-car plan?',
    'What did the dealer not answer clearly?',
    'Which car makes ordinary drives feel better?',
  ])

  const risks = ensureFive(ownershipRisks, [
    'Warranty confidence needs confirmation.',
    'Dealer support quality needs proof.',
    'Parts availability should be discussed plainly.',
    'Future maintenance complexity may change the ownership story.',
    'The best-feeling car may not be the lowest-risk car.',
  ])

  const summary =
    `${winnerVehicle.name} is currently the strongest life-fit candidate. ` +
    `It leads the weighted model with ${Math.round(winner.overall)} overall, ` +
    `${Math.round(winner.emotion)} emotional, and ${Math.round(winner.ownership)} ownership points. ` +
    `The recommendation should be treated as provisional until the safety system clears the evaluation threshold.`

  return {
    winner,
    runnerUp,
    confidence: Math.round(confidence),
    gap,
    safetyMessage,
    topReasons,
    reasonsNot,
    unknowns,
    questions,
    risks,
    summary,
  }
}

export const scoreLabel = (score: number) => `${Math.round(score)}`
