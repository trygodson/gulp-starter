import App from './modules/index.js'

let hd = {
  name: 'godson',
  age: '23'
}

const app = new App()

const person = () => {
  app();
  return {...hd};

}