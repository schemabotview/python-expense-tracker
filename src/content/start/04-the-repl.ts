import type { Section } from '../types'

export const theRepl: Section = {
  id: 'the-repl',
  title: 'The REPL beside the editor',
  scene: 'start-repl',
  narration:
    "Python has a second way to run code, and it is the one you will reach for whenever you are not sure what a line will do. Typing python on its own, here with dash q to skip the banner, opens the REPL. The name describes the loop on the right: it reads the line you type, evaluates it, prints the value, and waits for the next one. Unlike a script, it shows you the value of everything, without being asked. Ana also had lunch today, twelve ninety nine, and we want the app to print what the day has cost so far. So we try it here first. Four point five zero comes straight back as four point five, the same lost zero as before. Then coffee plus lunch, four fifty plus twelve ninety nine, comes back as seventeen point four nine, followed by a long run of zeros and a two. That is not a typing mistake, and it is not a bug in Python. A float stores numbers in binary, and twelve point nine nine has no exact binary form, so what you get is the nearest value a float can hold, and the sum carries the error. The REPL is also good for small questions about text: upper turns Café Lumen into capitals, accent and all. Then exit leaves the REPL, and everything typed there is gone; the table at the bottom puts the REPL and the file side by side. Trying the line has done its job, so we write it into main dot py as line five, and run the file. The new line prints the same long number. For an app that tracks money, that is the wrong answer: amounts must come out in exact cents. We will leave it for now, deliberately, and fix it properly in the next course, with a type made for money.",
}
