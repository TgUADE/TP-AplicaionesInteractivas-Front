const ToDo = ({ToDo, deleteToDo, index}) => {

    return (
        <>
        <h3>{ToDo}</h3>
        <button onClick={()=>deleteToDo(index)}>X</button>
        </>
    )
}
export default ToDo