import type { SceneModel } from '@graphlearning/graphl-flow'
import { appMap } from '../map'
import s1 from '../../../spine/intro/01-python/session.txt?raw'
import s4 from '../../../spine/ship/04-the-finished-app/session.txt?raw'
import { outputOf } from '../lab'

// Course 1 — Python, and what we'll build. Two concept scenes: the first with Python's own answers,
// the second showing the FINISHED app's real report up front (the payoff first).
const python1: SceneModel = {
  title: 'Python',
  sub: 'a general-purpose language: readable, batteries included, and everywhere',
  dir: 'row',
  nodes: [
    {
      type: 'group', id: 'core', title: 'Python 3.15', icon: 'python', tone: 'ingest', children: [
        { type: 'code', id: 'asked', terminal: true, filename: 'terminal', code: s1.trim() },
        { type: 'item', id: 'cap', title: 'This course', icon: 'card', tone: 'store', bullets: ['one app, from a first line', 'only the standard library'] },
      ],
    },
    {
      type: 'group', id: 'uses', title: 'What people build with it', icon: 'globe', tone: 'store', dir: 'grid', cols: 2, children: [
        { type: 'item', id: 'u-auto', title: 'automation and scripts', sub: 'pathlib, csv, a cron job', icon: 'workflow', tone: 'store' },
        { type: 'item', id: 'u-cli', title: 'command-line tools', sub: 'argparse, pip itself', icon: 'terminal', tone: 'store' },
        { type: 'item', id: 'u-web', title: 'web services', sub: 'FastAPI, Django', icon: 'globe', tone: 'store' },
        { type: 'item', id: 'u-data', title: 'data', sub: 'pandas, PySpark', icon: 'pandas' },
        { type: 'item', id: 'u-ml', title: 'machine learning', sub: 'PyTorch, scikit-learn', icon: 'brain' },
        { type: 'item', id: 'u-sci', title: 'science and notebooks', sub: 'Jupyter, NumPy', icon: 'jupyter' },
      ],
    },
  ],
  edges: [{ from: 'core', to: 'uses' }],
}

const report = outputOf(s4, 'python -m expense_tracker report')
const build2: SceneModel = appMap({
  title: "What we'll build",
  sub: "expense-tracker: where Ana's money goes. This is the finished app's real report",
  built: 11,
  output: { type: 'code', id: 'out-report', terminal: true, filename: 'terminal: the end of the course', code: `$ expense-tracker report\n${report}` },
})

export const introScenes: Record<string, SceneModel> = { 'intro-python': python1, 'intro-what-we-will-build': build2 }
