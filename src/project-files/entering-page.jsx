import mainLogo from '../images/Kahoot Logo.png'
import axios from 'axios'

export default function EnteringPage() {

    function gettingQuestions(){
        axios.get('https://opentdb.com/api.php?amount=10&category=27&difficulty=medium')
        .then(response => {
            console.log(response.data)
        }).catch(error => {
            console.error(error)
        })
    }

    return(
        <div className='entering-page'>
            <img src={mainLogo} alt="Kahoot's Original Logo" className='kahoot-entering-page-logo' />
            <div className='player-entrance'>
                <textarea placeholder='Oyuncu Adı' id=""></textarea>
                <button onClick={gettingQuestions}>Başla</button>
            </div>
        </div>
    )
}