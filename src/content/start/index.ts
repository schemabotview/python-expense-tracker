import type { Course } from '../types'
import { aVenv } from './01-a-venv'
import { mainPy } from './02-main-py'
import { whatPythonDoes } from './03-what-python-does'
import { theRepl } from './04-the-repl'
import { aSyntaxError } from './05-a-syntax-error'
import { aNameError } from './06-a-name-error'

export const start: Course = {
  id: 'start',
  title: 'The first script',
  sections: [aVenv, mainPy, whatPythonDoes, theRepl, aSyntaxError, aNameError],
}
