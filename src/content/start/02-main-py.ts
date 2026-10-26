import type { Section } from '../types'

export const mainPy: Section = {
  id: 'main-py',
  title: 'main.py: the first lines, run from the terminal',
  scene: 'start-main',
  narration:
    "The expense tracker begins as a single file, main dot py. It is nothing more than text, four lines of it, and the explorer marks it as new. The first line starts with a hash sign, which makes it a comment: a note for people, which Python skips entirely. The second line is blank. The two lines after that are the first real code in the project, and both of them call print. In the terminal, python main dot py hands the file to the interpreter from our environment. Python reads it from the top to the bottom and runs each line in order, which is why the table on the right walks down the file one line at a time. The comment and the blank line do nothing. Line three prints the app's banner. Line four prints Ana's first expense: a coffee at Café Lumen, four fifty. Look at how that line is built, because the second table takes it apart. print was given two things, separated by a comma: some text, and a number. Text in quotes is called a string, and a number with a decimal point is called a float. print turns each of them into characters, puts a single space between them, and ends the line. Notice two things in the terminal. The quotes never appear: they only tell Python where the text starts and ends. And we typed four point five zero, but Python printed four point five. The trailing zero is gone. A float stores the number, not the way it was written, and for money that is already a warning sign. Where exactly did the zero go? To answer that, the next section follows this file through Python itself.",
}
