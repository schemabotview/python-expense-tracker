import type { Section } from '../types'

export const aNameError: Section = {
  id: 'a-name-error',
  title: 'A NameError: found while it runs',
  scene: 'start-name-error',
  narration:
    "This time the bracket is back, but on line four, print has been typed as p r n t. As far as the parser is concerned, that is perfectly good Python: p r n t is a valid name, so the file passes the grammar check and starts running. The table on the right shows what happened, line by line. Line three runs, and the banner appears in the terminal. Then line four runs, and Python has to find out what p r n t means. It looks in two places, shown in the diagram: the names this file has defined, and then the built in names that every program starts with, such as print and len. Neither has anything called p r n t, so Python raises a NameError, and line five never runs. The traceback reads the same way as before. It gives the file and the line, underlines the name it could not find, and on the last line names the error and adds a suggestion: did you mean print? Python suggests a close match whenever it can find one, and it is usually right. The table at the bottom is the real lesson of this pair. A SyntaxError is found by the parser, before any line runs, so nothing happens at all. A NameError is found by the running program, only when it reaches the bad line, so everything before that line has already happened. Here that means one printed banner. In an app that saves your expenses, it could mean a file half written, which is why this course will check its input, and test its code, before it trusts either. Fix the name, and the project is set up. In the next course, it starts to hold real data.",
}
