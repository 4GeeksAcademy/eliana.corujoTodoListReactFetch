import React, { useState, useEffect } from "react";

const API_URL = "https://playground.4geeks.com/todo";
const USERNAME = "ElianaCorujo"; 

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // Obtener tareas del usuario
    const getTasks = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${USERNAME}`);
            if (!response.ok) {
                console.error(`Error al obtener tareas: ${response.status} ${response.statusText}`);
                return;
            }
            const data = await response.json();
            setTasks(data.todos || []);
        } catch (error) {
            console.error("Hubo un problema con la operación GET:", error);
        }
    };

    // Crear usuario si no existe
    const createUser = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${USERNAME}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            
            if (response.ok || response.status === 400) { 
                console.log(`Usuario ${USERNAME} listo o ya existente. Cargando tareas...`);
                await getTasks(); 
            } else {
                console.error("Error al crear el usuario:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Hubo un problema al crear el usuario:", error);
        }
    };

    // Agregar nueva tarea
    const addTask = async () => {
        if (newTask.trim() === "") return;

        const newTaskObject = {
            label: newTask.trim(), 
            is_done: false 
        };

        try {
            const response = await fetch(`${API_URL}/todos/${USERNAME}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTaskObject)
            });

            if (response.ok) {
                await getTasks();
                setNewTask("");
            } else {
                console.error("Error al agregar la tarea:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Hubo un problema al agregar la tarea:", error);
        }
    };
    const deleteTask = async (taskId) => {
        if (!taskId) {
            console.error("No se pudo eliminar: taskId es inválido o undefined.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/todos/${taskId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                console.log(`Tarea ${taskId} eliminada correctamente.`);
                await getTasks();
            } else {
                console.error(`Error al eliminar la tarea ${taskId}:`, response.status, response.statusText);
            }
        } catch (error) {
            console.error("Hubo un problema con la operación DELETE:", error);
        }
    };

    // Limpiar todas las tareas del usuario
    const clearAllTasks = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${USERNAME}`, {
                method: "DELETE"
            });

            if (response.ok) {
                console.log(`Usuario ${USERNAME} y todas sus tareas eliminadas. Recreando...`);
                await createUser(); 
            } else {
                console.error("Error al limpiar todas las tareas:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Hubo un problema al limpiar todas las tareas:", error);
        }
    };

    useEffect(() => {
        createUser();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center todo-title">Tareas de {USERNAME}</h1>
            
            <div className="todo-list-card">
                <input 
                    type="text"
                    className="form-control"
                    placeholder={tasks.length === 0 ? "No hay tareas, añadir nueva tarea" : "Añadir nueva tarea"}
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addTask()}
                /> 
                
                <ul className="list-group list-group-flush">
                    {tasks.map((task) => (
                        <li 
                            key={task.id} 
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            {task.label}
                            <span 
                                className="delete-icon" 
                                onClick={() => deleteTask(task.id)} 
                                style={{ cursor: 'pointer', color: '#ff4d4d' }}
                            >
                                ❌
                            </span>
                        </li>
                    ))}
                    <li className="list-group-item footer-item text-muted">
                        {tasks.length} item{tasks.length !== 1 ? 's' : ''} left
                    </li>
                </ul>
                
                {tasks.length > 0 && (
                    <button 
                        className="btn btn-danger btn-sm mt-3 w-100" 
                        onClick={clearAllTasks}
                    >
                        Limpiar todas las tareas
                    </button>
                )}
            </div>
        </div>
    );
};

export default Home;
