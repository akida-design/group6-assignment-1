import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import axios from 'axios'

function App() {
  // const [count, setCount] = useState(0)
  const [students, setStudents] = useState([])
  const [form, setForm]= useState({id:'', name:'', course:''})
  const [editing, setEditing] = useState(false)

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/students')
      console.log(response.data )
      setStudents(response.data)
      console.log("Use state data",students)
    }
   catch (error) {
    console.error('Error fetching students:', error)
  }
}
useEffect(() => {
  fetchStudents()
}, [])
const handleChange = (e)=>{
  setForm({...form, [e.target.name]: e.target.value})
}
const handleEdit = (student) =>{
  //change the state to editing true
  setForm(student)
  setEditing(true)

}
const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    let response

    if (editing) {
      response = await axios.put(
        `http://localhost:5000/student/${form.id}`,
        form
      )
    } else {
      response = await axios.post(
        'http://localhost:5000/student',
        form
      )
    }

    console.log("response", response)

    fetchStudents()
    setForm({ id: '', name: '', course: '' })
    setEditing(false)

  } catch (error) {
    console.log("error", error)
    if (error.response && error.response.data.error) {
      alert(error.response.data.error)
    } else {
      alert("Something went wrong")
    }
  }
}
const handleDelete = async (student)=>{
  alert("Are you sure you want to delete student",student.name)
  const response = await axios.delete(`http://localhost:5000/student/${student.id}`)
  console.log("Deleting student")
  fetchStudents()
}
const clearFields = ()=>{
  setForm({id:'', name:'', course:''})
     setEditing(false)

}

  return (
      <>
     <h1 className="title">Students</h1>

<div className="container">
  <form onSubmit={handleSubmit} className="form">
    <input name="id" type='number' placeholder="ID" value={form.id} onChange={handleChange} required />
    <input name="name" placeholder="Student Name" value={form.name} onChange={handleChange} required />
    <input name="course" placeholder="Course" value={form.course} onChange={handleChange} required />

    <button type="submit" className="btn primary">
      {editing ? 'Update' : 'Add'} Student
    </button>
    <button onClick={clearFields} className="btn secondary">
      Clear
    </button>
  </form>

  <table className="table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Course</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {students.map((student) => (
        <tr key={student.id}>
          <td>{student.id}</td>
          <td>{student.name}</td>
          <td>{student.course}</td>
          <td>
            <button className="btn edit" onClick={() => handleEdit(student)}>Edit</button>
            <button className="btn delete" onClick={() => handleDelete(student)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </>
  )
}

export default App
