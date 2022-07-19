import { useState, useEffect } from 'react'

import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

import './App.css'

const API = 'http://localhost:5000'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')

  // load todos on page load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      const response = await fetch(API + '/todos')
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => console.log(error))

      setLoading(false)

      setTodos(response)
    }

    loadData()
  }, [])
  
  // submit data
  const handleSubmit = async (event) => {
    event.preventDefault()

    // object todo
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    }

    // API call
    await fetch(API + '/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // checks the previous state and loads a new todo
    setTodos((prevState) => [...prevState, todo])
    
    // clear fields
    setTitle('')
    setTime('')
  }

  // delete item
  const handleDelete = async (id) => {
    await fetch(API + '/todos/' + id, {
      method: 'DELETE',
    })

    // filter all items except the item was removed
    setTodos((prevState) => prevState.filter(
      (todo) => todo.id !== id)
    )
  }

  // check item
  const handleCheck = async (todo) => {
    todo.done = !todo.done // whether it was completed or not
    
    const data = await fetch(API + '/todos/' + todo.id, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setTodos((prevState) => prevState.map(
      (todo) => (todo.id === data.id ? (todo = data) : todo))
    )
  }
  
  // loading
  if (loading) {
    return <span className="loading">{<AiOutlineLoading3Quarters/>}</span>
  }

  return (
    <div className="App">    
      <div className="todo-header">
        <h1>Todo React</h1>
      </div>
      <div className="form-todo">
        <h2>Insira a sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label>
              <span>O que você vai fazer?</span>
              <input type="text" name="title" placeholder='Título da tarefa' onChange={(event) => setTitle(event.target.value)} value={title} required />
            </label>
          </div>

          <div className="form-control">
            <label>
              <span>Duração</span>
              <input type="text" name="time" placeholder='Tempo estimado (em horas)' onChange={(event) => setTime(event.target.value)} value={time} required />
            </label>
          </div>

          <input type="submit" value='Criar tarefa' />
        </form>
      </div>
      <div className="list-todo">
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? 'todo-done' : ''}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="action">
              <span onClick={() => handleCheck(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
