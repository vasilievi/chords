import { useState, useEffect } from 'react';

export default function HighlightText(props) {

    useEffect(() => {
        highlightText()
    }, [props.text])

    
  const highlightText = () => {
    const regex = new RegExp(`[ \n][A-G][/][*][ \n]|[ \n][A-G][ \n]|[ \n][A-G][#bm67][ \n]|[ \n][A-G][#bm67][#bm67][ \n]`, 'g');
    const text = props.text
    const highlightedText = text.replace(regex, '<mark class="bg-black text-warning">$&</mark>');
    const pre = document.getElementById('pre')
    pre.innerHTML = highlightedText
  }

    return (
        <pre
            id='pre'
            className="pre form-control font-monospace form-control-lg bg-black text-white mb-3"
            >
        </pre>

    )
}
