import { useState } from "react"
import ToDo from "./ToDo"

const Form = () =>{
    const[toDos,setToDos]=useState([])
    const[toDo,setToDo]=useState("")
    const handleChange=(event)=>setToDo(event.target.value)
    const handleClick=()=>{
        if(toDo.trim() === ""){
            alert("El campo no puede estar vacio")
            return;
        }
        setToDos([...toDos,{toDo}])
        return;
    }
    const deleteToDo=index=>{
        const newToDos=[...toDos]
        newToDos.splice(index,1)
        setToDos(newToDos)
    }
    return (
        <>
        <form onSubmit={(e)=>e.preventDefault()}>
            <label> Agregar Tarea</label><br></br>
            <input type="text" name="ToDo" onChange={handleChange}/>
            <button onClick={handleClick}>Agregar</button>  
        </form>

        {toDos.map((value, index)=>(
            <ToDo ToDo={value.toDo} key={index} index={index} deleteToDo={deleteToDo}/>
        ))}
        </>
    )
}
export default Form