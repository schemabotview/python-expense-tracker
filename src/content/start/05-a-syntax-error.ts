import type { Section } from '../types'

export const aSyntaxError: Section = {
  id: 'a-syntax-error',
  title: 'A SyntaxError: found before anything runs',
  scene: 'start-syntax-error',
  narration:
    "Every programmer breaks their code many times a day, so one of the most useful skills you can learn is reading what Python says when it happens. Here, line five has lost its closing bracket. We run the file, and look closely at the terminal: there is no banner. Line three is perfectly correct, yet it never printed. That tells you when this error was found. You saw the path in the last picture but one: before Python runs a single line, it parses the whole file, checking its grammar, every bracket closed and every colon in place. The diagram on the right follows that path. The parser reached the end of the file with a bracket still open, so it stopped, and nothing ran at all. Now read the error itself, line by line, with the table beside it. The first line names the file and the line number, five. The second line shows that line of code. The third line has a caret pointing up, at the bracket that was opened and never closed. And the last line says what kind of error this is, a SyntaxError, followed by a plain description: the opening bracket was never closed. Python's messages have become far more helpful in recent versions, and this one says exactly what is wrong. Notice that the caret points at where the bracket was opened, not at where the missing one belongs. For a missing bracket, the true mistake is often at the end of the line, or even on a later line. So the habit is: read the last line of the error first, then the line it points at, then look around it. Next, an error that the parser cannot see.",
}
