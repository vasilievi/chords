import { useState, useEffect } from 'react';

export default function HighlightText(props) {

    const [visible, setVisible] = useState(props.visible);

    useEffect(() => {
        highlightText()
        setVisible(props.visible)
    }, [props.text, props.visible])

    
  const highlightText = () => {
    const regex = new RegExp(`[ \n][A-G][ \n]|[ \n][A-G][#m67][ \n]|[ \n][A-G][#bm67][#bm67][ \n]`, 'g');
    const text = props.text
    const highlightedText = text.replace(regex, '<mark class="bg-black text-warning">$&</mark>');
    const pre = document.getElementById('pre')
    pre.innerHTML = highlightedText
  }

    return (
        <pre
            style={{ display: (visible) ? "" : "none" }}
            id='pre'
            className="form-control font-monospace form-control-lg bg-black text-white mb-3"
            >
        </pre>

    )
}
