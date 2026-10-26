import type { SceneModel } from '@graphlearning/graphl-flow'
import { startScenes } from './start'
import { holdScenes } from './hold'
import { decideScenes } from './decide'
import { saveScenes } from './save'
import { reportScenes } from './report'
import { commandScenes } from './command'
import { modelScenes } from './model'
import { trustScenes } from './trust'
import { connectScenes } from './connect'
import { shipScenes } from './ship'
import { introScenes } from './intro'

// Scene registry. Sections reference scenes by id; a graphl-flow scene carries no id of its own, so
// the id is the key here. Scenes are grouped by course (one folder each, mirroring src/content),
// each folder exporting a Record; ids are globally unique, and a duplicate THROWS rather than
// letting one course's scene shadow another's.
const GROUPS: Record<string, SceneModel>[] = [introScenes, startScenes, holdScenes, decideScenes, saveScenes, reportScenes, commandScenes, modelScenes, trustScenes, connectScenes, shipScenes]

export const SCENES: Record<string, SceneModel> = {}
for (const group of GROUPS)
  for (const [id, scene] of Object.entries(group)) {
    if (id in SCENES) throw new Error(`scene id "${id}" is registered twice`)
    SCENES[id] = scene
  }

export function getScene(id: string): SceneModel | undefined {
  return SCENES[id]
}
