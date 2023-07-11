//CSS
import './App.css';

//REACT
import {useCallback, useEffect, useState} from 'react';

//DATA
import {wordsList} from './data/words';

//COMPONENTS

import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

//ESTAGIOS DO GAME
const stages = [
  {id:1, name: 'start'},
  {id:2, name: 'game'},
  {id:3, name: 'end'},
];

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  

  const pickWordAndPickCategory = useCallback(() => {
    //PEGAR CATEGORIA ALEATORIA
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    

    //PEGAR PALAVRA ALEATORIA
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    

    return {word, category};

    
  }, [words]);

  //START THE GAME
  const startGame = useCallback(() => {
    //Pegar palavra e categoria
    const {word, category} = pickWordAndPickCategory();

    //limpa os states do jogo anterior
    clearLetterStates();
    
    //CRIAR LETRAS DA PALAVRRAR EM UM ARRARY
    let wordLetters = word.split('');

    wordLetters = wordLetters.map((l) => l.toLowerCase());
    console.log(wordLetters);

    //Setando states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

  

    setGameStage(stages[1].name);

  }, [pickWordAndPickCategory]);

  //ferificação das letras

  const verifyLetter = (letter) => {
    

    const normalizedLetter = letter.toLowerCase();

    //Verificando se a letra ja foi utilizada

    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    //VERIFICARR LETRAS CERTAS E ERRADAS NA PALAVRAR

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ])

      setGuesses((actualGuesses) => actualGuesses -1);

    }
    
    //monitoramento dos pontos

    
  };

  //Limpart todos os states

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }


  useEffect(() => {
    if(guesses <= 0) {
      //resetar states 
      clearLetterStates();


      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //VERIFICAR COMDIÇÃO DE VITORIA
  useEffect(() => {

    const uniqueLetters = [... new Set(letters)];

    //CONDIÇÃO DE VITORIA

    if(guessedLetters.length === uniqueLetters.length) {
      
      //ADD SCORE
      setScore((actualScore) => actualScore += 100);

      //restart game e gera nova palavra

      startGame();
    }


    console.log(uniqueLetters);

  }, [guessedLetters, letters, startGame]);

  //RESTART DO GAME

  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game 
      verifyLetter={verifyLetter}
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
      
    </div>
  );
}

export default App;
