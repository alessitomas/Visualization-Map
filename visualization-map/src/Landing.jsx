import './Landing.css';
import imgBackground from "./assets/imagem/background.png"
import icone from "./assets/imagem/icone.png"


function Landing() {    
  return (
    <div className="landing-page" style={{ backgroundImage: `url(${imgBackground})` }}>
      <header>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Oswald&display=swap" rel="stylesheet"/>

        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Carlito&display=swap" rel="stylesheet"/>

        <h1>Bem-vindo ao PTV-SP</h1>
        <main>
          <p>Uma ferramenta de análise origem-destino de profissionais da educação</p>
        </main>
      </header>
      <button
      className="image-button"
      style={{ backgroundImage: `url(${icone})` }}
    ></button>
    </div>

  );
}

export default Landing;
