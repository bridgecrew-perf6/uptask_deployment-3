import axios from "axios";
//import { ContextExclusionPlugin } from "webpack";
import Swal from "sweetalert2";
import { actualizarAvance } from "../funciones/avance";

const tareas = document.querySelector('.listado-pendientes');

if(tareas) {
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            // Request hacia /tareas/:id

            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url,{ idTarea })
                .then(function(respuesta){
                    if(respuesta.status == 200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }
        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;
                Swal.fire({
                    title: '¿Estas seguro?',
                    text: "!Tarea borrada no se puede recuperar!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, borrarlo',
                    cancelButtonText: 'No, Cancelar'
                }).then((result) => {
                    if (result.value) {
                        const url = `${location.origin}/tareas/${idTarea}`;

                        // Aplicar delete por medio de axios
                        axios.delete(url, { params: { idTarea }})
                            .then(function(respuesta){
                                if(respuesta.status == 200){
                                    // Eliminar el nodo de la lista
                                    tareaHTML.parentElement.removeChild(tareaHTML);

                                    // Alerta opcional
                                    Swal.fire(
                                        'Correcto',
                                        respuesta.data,
                                        'success'
                                    )
                                    actualizarAvance();
                                }
                            });
                    }
                })
            
        }
    })
}
export default tareas;