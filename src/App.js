import "./styles/css/index.css";
import Button from './components/buttons/Button';

function App() {
  return (
    <div>
      <h1>Hola mundo!</h1>
      <h2>Hola mundo!</h2>
      <h3>Hola mundo!</h3>
      <h4>Hola mundo!</h4>
      <h5>Hola mundo!</h5>
      <h6>Hola mundo!</h6>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex aliquid harum cum dolore, consectetur illo in recusandae, sint aperiam deleniti odio ratione aliquam quos voluptatem delectus fugiat. Quos, autem et!</p>
      <p className="small">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex aliquid harum cum dolore, consectetur illo in recusandae, sint aperiam deleniti odio ratione aliquam quos voluptatem delectus fugiat. Quos, autem et!</p>
      <caption>Texto mini</caption>
      <Button text="Primary" type="btn-primary" />
      <Button text="Secondary" type="btn-secondary" />
      <Button text="Tertiary" type="btn-tertiary" />
      <Button text="Cancel" type="btn-danger" />
      <Button text="Link" type="btn-link" />
    </div>
  );
}

export default App;
