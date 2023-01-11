import { useState, useEffect } from 'react';

export default function HighlightText(props) {

    const [visible, setVisible] = useState(props.visible);

    useEffect(() => {
        highlightText()
        setVisible(props.visible)
    }, [props.text, props.visible])

    
  const highlightText = () => {
    const regex = new RegExp(` [A-G] |
                               | Am | Bm | Cm | Dm | Em | Fm | Gm 
                               | A# | B# | C# | D# | E# | F# | G# 
                               | Ab | Bb | Cb | Db | Eb | Fb | Gb 
                               | A7 | B7 | C7 | D7 | E7 | F7 | G7 `, 'g');
    const text = props.text
    const highlightedText = text.replace(regex, '<mark class="bg-black text-warning">$&</mark>');
    const pre = document.getElementById('pre')
    pre.innerHTML = highlightedText
  }

    return (
        <pre
            style={{ display: (visible) ? "" : "none" }}
            id='pre'
            className="pre form-control font-monospace form-control-lg bg-black text-white mb-3"
            >
        </pre>

    )
}
