import { TemplatePage } from './templatePage'
import {Provider} from 'react-redux'
import './App.css'
import store from './reducer/store';

function App() {
  return (<Provider store={store}>
      <TemplatePage />
    </Provider>)
}

export default App
