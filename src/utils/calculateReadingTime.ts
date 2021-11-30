interface PostSection {
  heading: string;
  body: {
    text: string;
  }[];
}

export function calculateReadingTime(content: PostSection[]): string {
  const totalWords = content.reduce((currentWords, currentSection) => {
    const headingWords = currentSection.heading.split(' ').length;

    const bodyWords = currentSection.body.reduce(
      (currentBodyWords, currentParagraph) => {
        const paragraphWords = currentParagraph.text.split(' ').length;
        return currentBodyWords + paragraphWords;
      },
      0
    );

    return currentWords + headingWords + bodyWords;
  }, 0);

  const totalTime = Math.ceil(totalWords / 200);

  return `${totalTime} min`;
}
