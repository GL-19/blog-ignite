import { useEffect } from 'react';

export function UtterancesComments(): JSX.Element {
  useEffect(() => {
    const anchor = document.getElementById('inject-comments-for-uterances');
    if (!anchor) return;

    const script = document.createElement('script');

    script.src = 'https://utteranc.es/client.js';
    script.async = true;

    script.setAttribute(
      'repo',
      'GL-19/ignite-react-desafio05-criando-um-projeto-do-zero'
    );
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', 'comment :speech_balloon:');
    script.setAttribute('theme', 'github-dark');
    script.setAttribute('crossorigin', 'anonymous');

    anchor.appendChild(script);
  }, []);

  return <div id="inject-comments-for-uterances" />;
}
