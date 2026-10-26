import type { SceneModel } from '@graphlearning/graphl-flow'
import { startVenv } from './venv'
import { startMain } from './main-py'
import { startWhatPythonDoes } from './what-python-does'
import { startRepl } from './repl'
import { startSyntaxError } from './syntax-error'
import { startNameError } from './name-error'

export const startScenes: Record<string, SceneModel> = {
  'start-venv': startVenv,
  'start-main': startMain,
  'start-what-python-does': startWhatPythonDoes,
  'start-repl': startRepl,
  'start-syntax-error': startSyntaxError,
  'start-name-error': startNameError,
}
