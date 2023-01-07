import { useState, useEffect } from 'react';
import { transpose } from 'chord-transposer';

function homePage(params) {
    let initText = `
    E
  Champangne
  C#m                F#m    B7
  Per brindare a un incontro
  F#m   B7
  Con te
                      E
  Che già eir di un altro
  Bm7     E7               A
  Ricordi c'era stato un invito
  F#                      B7
  Stasera si va tutti a casa mia
  E
  Così
  C#m                F#m    B7
  Cominciava la festa
  F#m    B7
  E già
                  E
  Ti girava la testa
  C#7
  Per me
                       F#m
  Non contavano gli altri
  F#              B7           E   E7
  Seguivo con lo sguardo sole te
  A       B7                  G#m C#m
  Se vuoi, ti accompagno se vuoi
                 F#7 B7
  La scusa più banale
              E           E7
  Per rimanere soli io e te
     A       B7          G#m
  E poi gettare via l perché
  C#m           F#m       E
  Amarti come sei
                     B    B7
  La prima volta, l'ultima
  E          C#m
  Champagne
                  F#m     B7
  Per un dolce segreto
       F#m       B7
  Per noi
                 E
  Un amore proibito
  C#7                        F#m
  Ormai resta solo un bicchiere
      F#         B7         E E7
  Ed un ricordo da gettare via
     A B7                G#m C#m
  Lo so, mi guardate lo so
                   F#m    B7
  Mi sembra una pazzia
             E                E7
  Brindare sole, senza compagnia
     A       B7           G#m C#m
  Ma io, io devo festeggiare
      F#m          B7
  La fine di un amore
                 E
  Cameriere, champange
  
    `
    const [text, setText] = useState(initText);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        console.log('useEffect');
        let textarea = document.getElementById('textarea')
        textarea.style.height = (window.innerHeight - 120).toString() + "px"
    }, [])

    const transposeUp = () => {
        setText(transpose(text).up(1).toString());
    }

    const transposeDown = () => {
        setText(transpose(text).down(1).toString());
    }

    const edit = () => {
        setEditMode(true)
    }

    const save = () => {
        setEditMode(false)
    }

    return (
        <div className="bg-black text-white p-3">
            <h1 className="display-3">Text title</h1>
            <div className='row mb-3'>
                <div className='col' style={{ display: (editMode) ? "none" : "" }}>
                    <div className='btn-group'>
                        <button className='btn btn-outline-light' onClick={transposeUp}>+</button>
                        <button className='btn btn-outline-light' onClick={transposeDown}>-</button>
                        <button className='btn btn-outline-light' onClick={transposeDown}>Reset</button>
                    </div>
                </div>
                <div className='col'>
                    <button
                        className='btn btn-outline-light'
                        onClick={edit}
                        style={{ display: (editMode) ? "none" : "" }}
                    >Edit</button>
                    <button className='btn btn-outline-warning'
                        onClick={save}
                        style={{ display: (editMode) ? "" : "none" }}
                    >Save</button>
                </div>
            </div>
            <textarea
                id='textarea'
                className="form-control font-monospace form-control-lg bg-black text-white"
                disabled={(editMode) ? false : true}
                value={text}
                onChange={(e) => {
                    setText(e.target.value)
                }}></textarea>
        </div>
    )
}

export default homePage