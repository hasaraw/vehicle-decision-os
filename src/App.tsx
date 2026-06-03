import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Battery,
  Camera,
  Car,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Gauge,
  Heart,
  Home,
  Moon,
  RefreshCcw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Table2,
  Trophy,
  Upload,
  Zap,
} from 'lucide-react'
import { type ChangeEvent, type ComponentType, type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './App.css'
import {
  type AppState,
  type Category,
  type PageId,
  type RatingSection,
  type ScoreRow,
  type VehicleId,
  comparisonFields,
  createDefaultState,
  experienceCategories,
  getCompletion,
  getRadarData,
  getRecommendation,
  getScores,
  getSortedScores,
  getUpgradeScores,
  mergeAppState,
  ownershipCategories,
  reflectionQuestions,
  scoreLabel,
  vehicleIds,
  vehicles,
} from './domain'

const storageKey = 'vehicle-decision-os-state-v2'

const pages: Array<{ id: PageId; label: string; Icon: ComponentType<{ size?: number; strokeWidth?: number }> }> = [
  { id: 'dashboard', label: 'Home', Icon: Home },
  { id: 'profiles', label: 'Profiles', Icon: Car },
  { id: 'experience', label: 'Drive', Icon: Gauge },
  { id: 'ownership', label: 'Own', Icon: ShieldCheck },
  { id: 'reflection', label: 'Reflect', Icon: ClipboardList },
  { id: 'hasara', label: '11 PM', Icon: Moon },
  { id: 'comparison', label: 'Compare', Icon: Table2 },
  { id: 'recommendation', label: 'Final', Icon: Trophy },
]

const loadInitialState = () => {
  if (typeof window === 'undefined') return createDefaultState()
  try {
    const saved = window.localStorage.getItem(storageKey)
    return saved ? mergeAppState(JSON.parse(saved)) : createDefaultState()
  } catch {
    return createDefaultState()
  }
}

const readImageFiles = async (files: FileList | null) => {
  if (!files) return []
  const images = [...files].filter((file) => file.type.startsWith('image/')).slice(0, 6)
  return Promise.all(
    images.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        }),
    ),
  )
}

const downloadBlob = (content: BlobPart, filename: string, type: string) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

const fileDate = () => new Date().toISOString().slice(0, 10)

const scoreTone = (score: number) => {
  if (score >= 78) return 'excellent'
  if (score >= 62) return 'good'
  if (score >= 48) return 'watch'
  return 'risk'
}

function App() {
  const [state, setState] = useState<AppState>(loadInitialState)
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleId>('leaf')
  const importInputRef = useRef<HTMLInputElement>(null)

  const scores = useMemo(() => getScores(state), [state])
  const sortedScores = useMemo(() => getSortedScores(state), [state])
  const completion = useMemo(() => getCompletion(state), [state])
  const recommendation = useMemo(() => getRecommendation(state), [state])
  const radarData = useMemo(() => getRadarData(scores), [scores])
  const emotionalWinner = useMemo(
    () => [...scores].sort((a, b) => b.emotion - a.emotion)[0],
    [scores],
  )
  const logicalWinner = useMemo(
    () => [...scores].sort((a, b) => b.logical - a.logical)[0],
    [scores],
  )

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state])

  const commitState = (updater: (previous: AppState) => AppState) => {
    setState((previous) => ({
      ...updater(previous),
      updatedAt: new Date().toISOString(),
    }))
  }

  const updateRating = (
    section: RatingSection,
    vehicleId: VehicleId,
    categoryId: string,
    patch: Partial<AppState[RatingSection][VehicleId][string]>,
  ) => {
    commitState((previous) => {
      const sectionRatings = previous[section]
      const current = sectionRatings[vehicleId][categoryId]
      return {
        ...previous,
        [section]: {
          ...sectionRatings,
          [vehicleId]: {
            ...sectionRatings[vehicleId],
            [categoryId]: {
              ...current,
              ...patch,
              completed: true,
            },
          },
        },
      } as AppState
    })
  }

  const addRatingPhotos = async (
    section: RatingSection,
    vehicleId: VehicleId,
    categoryId: string,
    files: FileList | null,
  ) => {
    const photos = await readImageFiles(files)
    if (!photos.length) return
    commitState((previous) => {
      const sectionRatings = previous[section]
      const current = sectionRatings[vehicleId][categoryId]
      return {
        ...previous,
        [section]: {
          ...sectionRatings,
          [vehicleId]: {
            ...sectionRatings[vehicleId],
            [categoryId]: {
              ...current,
              photos: [...current.photos, ...photos],
              completed: true,
            },
          },
        },
      } as AppState
    })
  }

  const removeRatingPhoto = (section: RatingSection, vehicleId: VehicleId, categoryId: string, index: number) => {
    commitState((previous) => {
      const sectionRatings = previous[section]
      const current = sectionRatings[vehicleId][categoryId]
      return {
        ...previous,
        [section]: {
          ...sectionRatings,
          [vehicleId]: {
            ...sectionRatings[vehicleId],
            [categoryId]: {
              ...current,
              photos: current.photos.filter((_, photoIndex) => photoIndex !== index),
            },
          },
        },
      } as AppState
    })
  }

  const updateProfileNote = (vehicleId: VehicleId, value: string) => {
    commitState((previous) => ({
      ...previous,
      profileNotes: { ...previous.profileNotes, [vehicleId]: value },
    }))
  }

  const addGalleryPhotos = async (vehicleId: VehicleId, files: FileList | null) => {
    const photos = await readImageFiles(files)
    if (!photos.length) return
    commitState((previous) => ({
      ...previous,
      galleries: {
        ...previous.galleries,
        [vehicleId]: [...previous.galleries[vehicleId], ...photos],
      },
    }))
  }

  const removeGalleryPhoto = (vehicleId: VehicleId, index: number) => {
    commitState((previous) => ({
      ...previous,
      galleries: {
        ...previous.galleries,
        [vehicleId]: previous.galleries[vehicleId].filter((_, photoIndex) => photoIndex !== index),
      },
    }))
  }

  const updateReflection = (vehicleId: VehicleId, questionId: string, value: string) => {
    commitState((previous) => ({
      ...previous,
      reflections: {
        ...previous.reflections,
        [vehicleId]: {
          ...previous.reflections[vehicleId],
          [questionId]: value,
        },
      },
    }))
  }

  const updateComparison = (fieldId: string, vehicleId: VehicleId, value: string) => {
    commitState((previous) => ({
      ...previous,
      comparison: {
        ...previous.comparison,
        [fieldId]: {
          ...previous.comparison[fieldId],
          [vehicleId]: value,
        },
      },
    }))
  }

  const updateWeight = (key: keyof AppState['weights'], value: number) => {
    commitState((previous) => ({
      ...previous,
      weights: { ...previous.weights, [key]: value },
    }))
  }

  const chooseHasara = (vehicleId: VehicleId) => {
    commitState((previous) => ({ ...previous, hasaraChoice: vehicleId }))
  }

  const exportJson = () => {
    downloadBlob(
      JSON.stringify(state, null, 2),
      `vehicle-decision-os-${fileDate()}.json`,
      'application/json',
    )
  }

  const importJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        setState(mergeAppState(JSON.parse(String(reader.result))))
      } catch {
        window.alert('That file could not be imported.')
      }
    }
    reader.readAsText(file)
    event.currentTarget.value = ''
  }

  const resetAll = () => {
    if (!window.confirm('Reset all saved evaluations for Vehicle Decision OS?')) return
    setState(createDefaultState())
  }

  const exportPdf = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const margin = 42
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const maxWidth = pageWidth - margin * 2
    let y = margin

    const addText = (text: string, size = 10, weight: 'normal' | 'bold' = 'normal', gap = 12) => {
      doc.setFont('helvetica', weight)
      doc.setFontSize(size)
      const lines = doc.splitTextToSize(text, maxWidth)
      lines.forEach((line: string) => {
        if (y > pageHeight - margin) {
          doc.addPage()
          y = margin
        }
        doc.text(line, margin, y)
        y += size + 4
      })
      y += gap
    }

    addText('Vehicle Decision OS', 20, 'bold', 4)
    addText('Clarity before commitment.', 11, 'normal', 18)
    addText(`Recommendation: ${vehicles[recommendation.winner.id].name}`, 14, 'bold')
    addText(`Confidence Score: ${recommendation.confidence}%`)
    addText(`Safety System: ${recommendation.safetyMessage}`)
    addText(recommendation.summary)

    addText('Scores', 13, 'bold', 4)
    scores.forEach((score) => {
      addText(
        `${vehicles[score.id].name}: overall ${Math.round(score.overall)}, emotional ${Math.round(
          score.emotion,
        )}, ownership ${Math.round(score.ownership)}, experience ${Math.round(score.experience)}`,
        10,
        'normal',
        4,
      )
    })

    addText('Top Reasons To Buy', 13, 'bold', 4)
    recommendation.topReasons.forEach((reason, index) => addText(`${index + 1}. ${reason}`, 10, 'normal', 3))
    addText('Top Reasons Not To Buy', 13, 'bold', 4)
    recommendation.reasonsNot.forEach((reason, index) => addText(`${index + 1}. ${reason}`, 10, 'normal', 3))
    addText('Biggest Unknowns', 13, 'bold', 4)
    recommendation.unknowns.forEach((item, index) => addText(`${index + 1}. ${item}`, 10, 'normal', 3))
    addText('Ownership Risks', 13, 'bold', 4)
    recommendation.risks.forEach((item, index) => addText(`${index + 1}. ${item}`, 10, 'normal', 3))
    doc.save(`vehicle-decision-os-report-${fileDate()}.pdf`)
  }

  const navigateTo = (page: PageId, vehicleId?: VehicleId) => {
    if (vehicleId) setSelectedVehicle(vehicleId)
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-lockup" type="button" onClick={() => navigateTo('dashboard')}>
          <span className="brand-mark">
            <Zap size={18} strokeWidth={2.4} />
          </span>
          <span>
            <strong>Vehicle Decision OS</strong>
            <small>Clarity before commitment.</small>
          </span>
        </button>
        <div className="top-actions">
          <IconButton label="Import" onClick={() => importInputRef.current?.click()} Icon={Upload} />
          <input ref={importInputRef} className="sr-only" type="file" accept="application/json" onChange={importJson} />
          <IconButton label="Export data" onClick={exportJson} Icon={Download} />
          <IconButton label="PDF" onClick={exportPdf} Icon={FileText} />
          <IconButton label="Reset" onClick={resetAll} Icon={RefreshCcw} />
        </div>
      </header>

      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.section
            key={activePage}
            className={`page page-${activePage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activePage === 'dashboard' && (
              <DashboardPage
                completion={completion}
                emotionalWinner={emotionalWinner}
                logicalWinner={logicalWinner}
                navigateTo={navigateTo}
                recommendation={recommendation}
                scores={scores}
                sortedScores={sortedScores}
              />
            )}
            {activePage === 'profiles' && (
              <ProfilesPage
                addGalleryPhotos={addGalleryPhotos}
                galleries={state.galleries}
                profileNotes={state.profileNotes}
                removeGalleryPhoto={removeGalleryPhoto}
                updateProfileNote={updateProfileNote}
              />
            )}
            {activePage === 'experience' && (
              <EvaluationPage
                addRatingPhotos={addRatingPhotos}
                categories={experienceCategories}
                ratings={state.experience}
                removeRatingPhoto={removeRatingPhoto}
                section="experience"
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
                subtitle="The sensory score. Cabin, tech, theatre, smile."
                title="Experience Evaluation"
                updateRating={updateRating}
              />
            )}
            {activePage === 'ownership' && (
              <EvaluationPage
                addRatingPhotos={addRatingPhotos}
                categories={ownershipCategories}
                ratings={state.ownership}
                removeRatingPhoto={removeRatingPhoto}
                section="ownership"
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
                subtitle="The Monday morning score. Costs, support, fit, confidence."
                title="Ownership Evaluation"
                updateRating={updateRating}
              />
            )}
            {activePage === 'reflection' && (
              <ReflectionPage
                reflections={state.reflections}
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
                updateReflection={updateReflection}
              />
            )}
            {activePage === 'hasara' && (
              <HasaraPage choice={state.hasaraChoice} chooseHasara={chooseHasara} navigateTo={navigateTo} />
            )}
            {activePage === 'comparison' && (
              <ComparisonPage
                comparison={state.comparison}
                logicalWinner={logicalWinner}
                emotionalWinner={emotionalWinner}
                overallWinner={sortedScores[0]}
                radarData={radarData}
                scores={scores}
                state={state}
                updateComparison={updateComparison}
                updateWeight={updateWeight}
              />
            )}
            {activePage === 'recommendation' && (
              <RecommendationPage
                completion={completion}
                exportPdf={exportPdf}
                navigateTo={navigateTo}
                recommendation={recommendation}
                scores={scores}
              />
            )}
          </motion.section>
        </AnimatePresence>
      </main>

      <nav className="bottom-nav" aria-label="Primary navigation">
        {pages.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={activePage === id ? 'nav-item active' : 'nav-item'}
            onClick={() => navigateTo(id)}
          >
            <Icon size={18} strokeWidth={2.2} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

interface IconButtonProps {
  label: string
  onClick: () => void
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>
}

function IconButton({ label, onClick, Icon }: IconButtonProps) {
  return (
    <button className="icon-button" type="button" onClick={onClick} title={label} aria-label={label}>
      <Icon size={18} strokeWidth={2.2} />
      <span>{label}</span>
    </button>
  )
}

interface DashboardPageProps {
  completion: ReturnType<typeof getCompletion>
  emotionalWinner: ScoreRow
  logicalWinner: ScoreRow
  navigateTo: (page: PageId, vehicleId?: VehicleId) => void
  recommendation: ReturnType<typeof getRecommendation>
  scores: ScoreRow[]
  sortedScores: ScoreRow[]
}

function DashboardPage({
  completion,
  emotionalWinner,
  logicalWinner,
  navigateTo,
  recommendation,
  scores,
  sortedScores,
}: DashboardPageProps) {
  const leader = sortedScores[0]
  const leaderVehicle = vehicles[leader.id]
  const closeCall = recommendation.gap <= 5
  return (
    <div data-testid="dashboard-page">
      <PageHeading
        eyebrow="Decision cockpit"
        title="Vehicle Decision OS"
        subtitle="A premium field tool for the dealership visit, the quiet drive home, and the morning after."
      />

      <section className="leader-band" style={{ '--accent': leaderVehicle.accent } as CSSProperties}>
        <div>
          <p className="eyebrow">Current Leader</p>
          <h2>{closeCall ? 'Too close to call' : leaderVehicle.name}</h2>
          <p>{recommendation.safetyMessage}</p>
        </div>
        <div className="leader-metrics">
          <Metric label="Confidence" value={`${recommendation.confidence}%`} />
          <Metric label="Completion" value={`${completion.percent}%`} />
          <Metric label="Gap" value={`${Math.round(recommendation.gap)} pts`} />
        </div>
        <button className="primary-action" type="button" onClick={() => navigateTo('recommendation')}>
          <Trophy size={18} />
          Final Recommendation
        </button>
      </section>

      <section className="vehicle-score-grid">
        {scores.map((score) => (
          <VehicleScoreCard key={score.id} navigateTo={navigateTo} score={score} />
        ))}
      </section>

      <section className="signal-strip">
        <SignalTile Icon={Heart} label="Emotional Winner" value={vehicles[emotionalWinner.id].shortName} />
        <SignalTile Icon={Scale} label="Logical Winner" value={vehicles[logicalWinner.id].shortName} />
        <SignalTile Icon={Sparkles} label="Overall Winner" value={vehicles[leader.id].shortName} />
      </section>

      <section className="flow-band">
        <FlowButton Icon={Gauge} label="Experience" onClick={() => navigateTo('experience')} />
        <FlowButton Icon={ShieldCheck} label="Ownership" onClick={() => navigateTo('ownership')} />
        <FlowButton Icon={Moon} label="Hasara Test" onClick={() => navigateTo('hasara')} />
        <FlowButton Icon={Table2} label="Compare" onClick={() => navigateTo('comparison')} />
      </section>
    </div>
  )
}

interface VehicleScoreCardProps {
  navigateTo: (page: PageId, vehicleId?: VehicleId) => void
  score: ScoreRow
}

function VehicleScoreCard({ navigateTo, score }: VehicleScoreCardProps) {
  const vehicle = vehicles[score.id]
  return (
    <motion.article
      className="vehicle-card"
      style={{ '--accent': vehicle.accent } as CSSProperties}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <VehicleImage vehicleId={score.id} />
      <div className="vehicle-card-body">
        <div className="vehicle-title-row">
          <div>
            <p className="eyebrow">{vehicle.role}</p>
            <h3>{vehicle.name}</h3>
          </div>
          <span className="badge">{vehicle.badge}</span>
        </div>
        <div className="score-row">
          <ScoreRing label="Overall" score={score.overall} />
          <MiniScore label="Emotional" score={score.emotion} />
          <MiniScore label="Ownership" score={score.ownership} />
        </div>
        <div className="card-actions">
          <button type="button" onClick={() => navigateTo('experience', score.id)}>
            <Gauge size={16} />
            Score
          </button>
          <button type="button" onClick={() => navigateTo('profiles', score.id)}>
            <Car size={16} />
            Profile
          </button>
        </div>
      </div>
    </motion.article>
  )
}

function ProfilesPage({
  addGalleryPhotos,
  galleries,
  profileNotes,
  removeGalleryPhoto,
  updateProfileNote,
}: {
  addGalleryPhotos: (vehicleId: VehicleId, files: FileList | null) => Promise<void>
  galleries: AppState['galleries']
  profileNotes: AppState['profileNotes']
  removeGalleryPhoto: (vehicleId: VehicleId, index: number) => void
  updateProfileNote: (vehicleId: VehicleId, value: string) => void
}) {
  return (
    <div>
      <PageHeading
        eyebrow="Vehicle profiles"
        title="The three candidates"
        subtitle="Each car gets its own memory lane: role, gallery, notes, and the first impression that sticks."
      />
      <section className="profile-grid">
        {vehicleIds.map((id) => {
          const vehicle = vehicles[id]
          return (
            <article className="profile-card" key={id} style={{ '--accent': vehicle.accent } as CSSProperties}>
              <VehicleImage vehicleId={id} />
              <div className="profile-content">
                <div className="vehicle-title-row">
                  <div>
                    <p className="eyebrow">{vehicle.role}</p>
                    <h3>{vehicle.name}</h3>
                  </div>
                  <span className="badge">{vehicle.badge}</span>
                </div>
                <p className="profile-copy">{vehicle.description}</p>
                <div className="fit-signal-list">
                  {vehicle.fitSignals.map((signal) => (
                    <span key={signal}>{signal}</span>
                  ))}
                </div>
                <label className="field-label" htmlFor={`profile-notes-${id}`}>
                  Profile notes
                </label>
                <textarea
                  id={`profile-notes-${id}`}
                  value={profileNotes[id]}
                  onChange={(event) => updateProfileNote(id, event.currentTarget.value)}
                  placeholder="First impression, dealer comments, family reactions..."
                />
                <PhotoUploader
                  id={`gallery-upload-${id}`}
                  label="Add vehicle photos"
                  onChange={(files) => addGalleryPhotos(id, files)}
                />
                <PhotoStrip photos={galleries[id]} removePhoto={(index) => removeGalleryPhoto(id, index)} />
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}

function EvaluationPage({
  addRatingPhotos,
  categories,
  ratings,
  removeRatingPhoto,
  section,
  selectedVehicle,
  setSelectedVehicle,
  subtitle,
  title,
  updateRating,
}: {
  addRatingPhotos: (
    section: RatingSection,
    vehicleId: VehicleId,
    categoryId: string,
    files: FileList | null,
  ) => Promise<void>
  categories: Category[]
  ratings: AppState[RatingSection]
  removeRatingPhoto: (section: RatingSection, vehicleId: VehicleId, categoryId: string, index: number) => void
  section: RatingSection
  selectedVehicle: VehicleId
  setSelectedVehicle: (vehicleId: VehicleId) => void
  subtitle: string
  title: string
  updateRating: (
    section: RatingSection,
    vehicleId: VehicleId,
    categoryId: string,
    patch: Partial<AppState[RatingSection][VehicleId][string]>,
  ) => void
}) {
  const average =
    categories.reduce((sum, category) => sum + ratings[selectedVehicle][category.id].score, 0) /
    categories.length
  return (
    <div>
      <PageHeading eyebrow={vehicles[selectedVehicle].badge} title={title} subtitle={subtitle} />
      <VehicleSelector selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle} />
      <section className="score-summary-band" style={{ '--accent': vehicles[selectedVehicle].accent } as CSSProperties}>
        <ScoreRing label="Live score" score={average * 10} />
        <div>
          <p className="eyebrow">{vehicles[selectedVehicle].role}</p>
          <h2>{vehicles[selectedVehicle].name}</h2>
          <p>{vehicles[selectedVehicle].description}</p>
        </div>
      </section>
      <section className="rating-grid">
        {categories.map((category) => {
          const entry = ratings[selectedVehicle][category.id]
          return (
            <article className="rating-card" key={category.id}>
              <div className="rating-head">
                <div>
                  <h3>{category.label}</h3>
                  <span className={`score-chip ${scoreTone(entry.score * 10)}`}>{entry.score}/10</span>
                </div>
                {entry.completed && <CheckCircle2 className="complete-icon" size={18} />}
              </div>
              <input
                aria-label={category.label}
                className="range-control"
                max="10"
                min="1"
                onChange={(event) =>
                  updateRating(section, selectedVehicle, category.id, {
                    score: Number(event.currentTarget.value),
                  })
                }
                style={{ '--value': `${((entry.score - 1) / 9) * 100}%` } as CSSProperties}
                type="range"
                value={entry.score}
              />
              <textarea
                value={entry.notes}
                onChange={(event) =>
                  updateRating(section, selectedVehicle, category.id, {
                    notes: event.currentTarget.value,
                  })
                }
                placeholder="Notes from the seat, the road, the showroom..."
              />
              <PhotoUploader
                id={`${section}-${selectedVehicle}-${category.id}`}
                label="Add photo"
                onChange={(files) => addRatingPhotos(section, selectedVehicle, category.id, files)}
              />
              <PhotoStrip
                photos={entry.photos}
                removePhoto={(index) => removeRatingPhoto(section, selectedVehicle, category.id, index)}
              />
            </article>
          )
        })}
      </section>
    </div>
  )
}

function ReflectionPage({
  reflections,
  selectedVehicle,
  setSelectedVehicle,
  updateReflection,
}: {
  reflections: AppState['reflections']
  selectedVehicle: VehicleId
  setSelectedVehicle: (vehicleId: VehicleId) => void
  updateReflection: (vehicleId: VehicleId, questionId: string, value: string) => void
}) {
  return (
    <div>
      <PageHeading
        eyebrow="Reflection engine"
        title="The part the numbers miss"
        subtitle="The best answer usually appears after the obvious answer has finished talking."
      />
      <VehicleSelector selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle} />
      <section className="reflection-grid">
        {reflectionQuestions.map((question) => (
          <label className="reflection-card" key={question.id}>
            <span>{question.label}</span>
            <textarea
              value={reflections[selectedVehicle][question.id]}
              onChange={(event) => updateReflection(selectedVehicle, question.id, event.currentTarget.value)}
              placeholder="Write the honest version."
            />
          </label>
        ))}
      </section>
    </div>
  )
}

function HasaraPage({
  choice,
  chooseHasara,
  navigateTo,
}: {
  choice: VehicleId | null
  chooseHasara: (vehicleId: VehicleId) => void
  navigateTo: (page: PageId, vehicleId?: VehicleId) => void
}) {
  return (
    <div data-testid="hasara-page">
      <section className="hasara-hero">
        <div className="hasara-copy">
          <p className="eyebrow">The Hasara Test</p>
          <h1>It is 11:00 PM.</h1>
          <p>You are driving home alone.</p>
          <p>Ben Böhmer is playing.</p>
          <p>The roads are empty.</p>
          <h2>Which car do you want to be sitting in?</h2>
        </div>
      </section>
      <section className="hasara-grid">
        {vehicleIds.map((id) => {
          const vehicle = vehicles[id]
          const selected = choice === id
          return (
            <motion.button
              key={id}
              className={selected ? 'hasara-option selected' : 'hasara-option'}
              onClick={() => chooseHasara(id)}
              style={{ '--accent': vehicle.accent } as CSSProperties}
              type="button"
              whileTap={{ scale: 0.985 }}
            >
              <VehicleImage vehicleId={id} />
              <span className="hasara-option-body">
                <span className="badge">{vehicle.badge}</span>
                <strong>{vehicle.name}</strong>
                <small>{vehicle.role}</small>
                {selected && (
                  <span className="selection-line">
                    <Star size={16} />
                    Selected
                  </span>
                )}
              </span>
            </motion.button>
          )
        })}
      </section>
      <div className="hasara-footer">
        <p>This answer materially shifts the emotional weighting.</p>
        <button className="primary-action" type="button" onClick={() => navigateTo('recommendation')}>
          <Trophy size={18} />
          See Impact
        </button>
      </div>
    </div>
  )
}

function ComparisonPage({
  comparison,
  emotionalWinner,
  logicalWinner,
  overallWinner,
  radarData,
  scores,
  state,
  updateComparison,
  updateWeight,
}: {
  comparison: AppState['comparison']
  emotionalWinner: ScoreRow
  logicalWinner: ScoreRow
  overallWinner: ScoreRow
  radarData: ReturnType<typeof getRadarData>
  scores: ScoreRow[]
  state: AppState
  updateComparison: (fieldId: string, vehicleId: VehicleId, value: string) => void
  updateWeight: (key: keyof AppState['weights'], value: number) => void
}) {
  const barData = scores.map((score) => ({
    name: vehicles[score.id].shortName,
    Overall: Math.round(score.overall),
    Emotion: Math.round(score.emotion),
    Logic: Math.round(score.logical),
  }))

  return (
    <div>
      <PageHeading
        eyebrow="Comparison engine"
        title="Emotion and logic on the same screen"
        subtitle="Weights, upgrade deltas, editable specs, and the current winners."
      />

      <section className="winner-grid">
        <WinnerTile Icon={Heart} label="Emotional Winner" score={emotionalWinner.emotion} vehicleId={emotionalWinner.id} />
        <WinnerTile Icon={Scale} label="Logical Winner" score={logicalWinner.logical} vehicleId={logicalWinner.id} />
        <WinnerTile Icon={Trophy} label="Overall Winner" score={overallWinner.overall} vehicleId={overallWinner.id} />
      </section>

      <section className="analysis-layout">
        <div className="analysis-panel">
          <div className="section-label">
            <SlidersHorizontal size={18} />
            Weighted scoring
          </div>
          <WeightSlider label="Experience" value={state.weights.experience} onChange={(value) => updateWeight('experience', value)} />
          <WeightSlider label="Ownership" value={state.weights.ownership} onChange={(value) => updateWeight('ownership', value)} />
          <WeightSlider label="Emotion" value={state.weights.emotion} onChange={(value) => updateWeight('emotion', value)} />
        </div>
        <div className="chart-panel" aria-label="Radar chart">
          <ResponsiveContainer height={260} width="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.14)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#d9e5ff', fontSize: 12 }} />
              <Radar dataKey="Leaf" fill="#63e6be" fillOpacity={0.12} stroke="#63e6be" />
              <Radar dataKey="S05" fill="#36d7ff" fillOpacity={0.12} stroke="#36d7ff" />
              <Radar dataKey="S07" fill="#b491ff" fillOpacity={0.12} stroke="#b491ff" />
              <Tooltip contentStyle={{ background: '#10131d', border: '1px solid rgba(255,255,255,0.12)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-panel" aria-label="Weighted score chart">
          <ResponsiveContainer height={260} width="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: '#d9e5ff', fontSize: 12 }} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#10131d', border: '1px solid rgba(255,255,255,0.12)' }} />
              <Bar dataKey="Overall" fill="#36d7ff" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Emotion" fill="#b491ff" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Logic" fill="#63e6be" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="upgrade-section">
        <div className="section-label">
          <Battery size={18} />
          Leaf Upgrade Analysis
        </div>
        <div className="upgrade-grid">
          {(['s05', 's07'] as const).map((id) => (
            <article className="upgrade-panel" key={id} style={{ '--accent': vehicles[id].accent } as CSSProperties}>
              <h3>{vehicles[id].name} vs Leaf</h3>
              {getUpgradeScores(state, id).map((item) => (
                <ProgressBar key={item.id} label={item.label} value={item.value} />
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="comparison-table-shell">
        <div className="section-label">
          <Table2 size={18} />
          Editable comparison
        </div>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Field</th>
                {vehicleIds.map((id) => (
                  <th key={id}>{vehicles[id].shortName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFields.map((field) => (
                <tr key={field.id}>
                  <th>{field.label}</th>
                  {vehicleIds.map((id) => (
                    <td key={id}>
                      <input
                        aria-label={`${field.label} ${vehicles[id].name}`}
                        value={comparison[field.id][id]}
                        onChange={(event) => updateComparison(field.id, id, event.currentTarget.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function RecommendationPage({
  completion,
  exportPdf,
  navigateTo,
  recommendation,
  scores,
}: {
  completion: ReturnType<typeof getCompletion>
  exportPdf: () => void
  navigateTo: (page: PageId, vehicleId?: VehicleId) => void
  recommendation: ReturnType<typeof getRecommendation>
  scores: ScoreRow[]
}) {
  const winnerVehicle = vehicles[recommendation.winner.id]
  return (
    <div>
      <PageHeading
        eyebrow="Final recommendation"
        title={winnerVehicle.name}
        subtitle="The answer is about fit, not conquest."
      />

      <section className="recommendation-hero" style={{ '--accent': winnerVehicle.accent } as CSSProperties}>
        <VehicleImage vehicleId={winnerVehicle.id} />
        <div className="recommendation-copy">
          <span className="badge">{winnerVehicle.badge}</span>
          <h2>{winnerVehicle.name}</h2>
          <p>{recommendation.summary}</p>
          <div className="leader-metrics">
            <Metric label="Confidence" value={`${recommendation.confidence}%`} />
            <Metric label="Completion" value={`${completion.percent}%`} />
            <Metric label="Gap" value={`${Math.round(recommendation.gap)} pts`} />
          </div>
        </div>
      </section>

      <section className={`safety-system ${completion.percent < 70 ? 'warning' : recommendation.gap <= 5 ? 'close' : 'clear'}`}>
        {completion.percent < 70 ? <AlertTriangle size={20} /> : recommendation.gap <= 5 ? <Scale size={20} /> : <CheckCircle2 size={20} />}
        <div>
          <p className="eyebrow">Decision Safety System</p>
          <h2>{recommendation.safetyMessage}</h2>
        </div>
      </section>

      <section className="score-strip">
        {scores.map((score) => (
          <div className="score-strip-item" key={score.id}>
            <span>{vehicles[score.id].shortName}</span>
            <strong>{scoreLabel(score.overall)}</strong>
            <ProgressBar label="Overall" value={Math.round(score.overall)} compact />
          </div>
        ))}
      </section>

      <section className="recommendation-grid">
        <ListPanel title="Top 5 Reasons To Buy" items={recommendation.topReasons} Icon={CheckCircle2} />
        <ListPanel title="Top 5 Reasons Not To Buy" items={recommendation.reasonsNot} Icon={AlertTriangle} />
        <ListPanel title="Biggest Unknowns" items={recommendation.unknowns} Icon={Sparkles} />
        <ListPanel title="Questions Still Unanswered" items={recommendation.questions} Icon={ClipboardList} />
        <ListPanel title="Ownership Risks" items={recommendation.risks} Icon={ShieldCheck} />
      </section>

      <section className="final-actions">
        <button className="primary-action" type="button" onClick={exportPdf}>
          <FileText size={18} />
          Export PDF
        </button>
        <button className="secondary-action" type="button" onClick={() => navigateTo('hasara')}>
          <Moon size={18} />
          Revisit 11 PM
        </button>
      </section>
    </div>
  )
}

function PageHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
}

function VehicleSelector({
  selectedVehicle,
  setSelectedVehicle,
}: {
  selectedVehicle: VehicleId
  setSelectedVehicle: (vehicleId: VehicleId) => void
}) {
  return (
    <div className="vehicle-selector" role="tablist" aria-label="Vehicles">
      {vehicleIds.map((id) => (
        <button
          key={id}
          type="button"
          className={selectedVehicle === id ? 'selected' : ''}
          onClick={() => setSelectedVehicle(id)}
          style={{ '--accent': vehicles[id].accent } as CSSProperties}
        >
          <span>{vehicles[id].shortName}</span>
          <small>{vehicles[id].badge}</small>
        </button>
      ))}
    </div>
  )
}

function VehicleImage({ vehicleId }: { vehicleId: VehicleId }) {
  const vehicle = vehicles[vehicleId]
  return (
    <div className="vehicle-image" style={{ '--accent': vehicle.accent } as CSSProperties}>
      <img src={vehicle.image} alt={`${vehicle.name} visual`} />
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function MiniScore({ label, score }: { label: string; score: number }) {
  return (
    <div className="mini-score">
      <span>{label}</span>
      <strong>{scoreLabel(score)}</strong>
    </div>
  )
}

function ScoreRing({ label, score }: { label: string; score: number }) {
  return (
    <div
      className="score-ring"
      style={{ '--ring': `${Math.round(score * 3.6)}deg` } as CSSProperties}
      aria-label={`${label} ${Math.round(score)}`}
    >
      <strong>{scoreLabel(score)}</strong>
      <span>{label}</span>
    </div>
  )
}

function SignalTile({
  Icon,
  label,
  value,
}: {
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>
  label: string
  value: string
}) {
  return (
    <div className="signal-tile">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function FlowButton({
  Icon,
  label,
  onClick,
}: {
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>
  label: string
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick}>
      <Icon size={18} />
      <span>{label}</span>
    </button>
  )
}

function WinnerTile({
  Icon,
  label,
  score,
  vehicleId,
}: {
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>
  label: string
  score: number
  vehicleId: VehicleId
}) {
  return (
    <div className="winner-tile" style={{ '--accent': vehicles[vehicleId].accent } as CSSProperties}>
      <Icon size={20} />
      <span>{label}</span>
      <strong>{vehicles[vehicleId].name}</strong>
      <small>{Math.round(score)} pts</small>
    </div>
  )
}

function WeightSlider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="weight-slider">
      <span>
        {label}
        <strong>{Math.round(value)}%</strong>
      </span>
      <input
        max="70"
        min="0"
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        style={{ '--value': `${(value / 70) * 100}%` } as CSSProperties}
        type="range"
        value={value}
      />
    </label>
  )
}

function ProgressBar({ compact, label, value }: { compact?: boolean; label: string; value: number }) {
  return (
    <div className={compact ? 'progress-row compact' : 'progress-row'}>
      <div>
        <span>{label}</span>
        <strong>{Math.round(value)}%</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  )
}

function PhotoUploader({ id, label, onChange }: { id: string; label: string; onChange: (files: FileList | null) => void }) {
  return (
    <label className="photo-uploader" htmlFor={id}>
      <Camera size={16} />
      <span>{label}</span>
      <input id={id} type="file" accept="image/*" multiple onChange={(event) => onChange(event.currentTarget.files)} />
    </label>
  )
}

function PhotoStrip({ photos, removePhoto }: { photos: string[]; removePhoto: (index: number) => void }) {
  if (!photos.length) return null
  return (
    <div className="photo-strip">
      {photos.map((photo, index) => (
        <button key={`${photo.slice(0, 40)}-${index}`} type="button" onClick={() => removePhoto(index)}>
          <img src={photo} alt="" />
        </button>
      ))}
    </div>
  )
}

function ListPanel({
  Icon,
  items,
  title,
}: {
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>
  items: string[]
  title: string
}) {
  return (
    <article className="list-panel">
      <div className="section-label">
        <Icon size={18} />
        {title}
      </div>
      <ol>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </article>
  )
}

export default App
