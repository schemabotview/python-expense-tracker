import { intro } from './intro'
import { start } from './start'
import { hold } from './hold'
import { decide } from './decide'
import { save } from './save'
import { report } from './report'
import { command } from './command'
import { model } from './model'
import { trust } from './trust'
import { connect } from './connect'
import { ship } from './ship'
import type { Course, Section } from './types'

// Course registry, in syllabus order. One course per chapter of COURSE-PLAN.md; a course is
// registered here only once it is authored.
export const COURSES: Record<string, Course> = {
  [intro.id]: intro,
  [start.id]: start,
  [hold.id]: hold,
  [decide.id]: decide,
  [save.id]: save,
  [report.id]: report,
  [command.id]: command,
  [model.id]: model,
  [trust.id]: trust,
  [connect.id]: connect,
  [ship.id]: ship,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract every recorder drives, so it cannot be a per-repo decision. Re-exported here
// because this module is what the app and the scripts import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
