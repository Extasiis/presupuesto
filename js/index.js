//Variabler
const formAddGastos = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
const addBtn = document.querySelector('.add__btn');
const formAdd = document.querySelector('#form-add')

const max = new Date().getFullYear(); // <- Contruye el option para el imput de tipe en header
    const min = max - 20;

    const selectYear = document.querySelector('#time');

    for(let i = max; i > min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
}


//Eventos

eventListeners()
function eventListeners(){
    document.addEventListener('DOMContentLoaded', togglePresupuesto)
    formAdd.addEventListener('submit', addBalance); // <- activa el evento global para la ventana emergente de addBalace
    formAddGastos.addEventListener('submit', agregarGastos) // <- Validacion y guarda el valor de Form de gasto
}

//Clases
class Presupuesto{ // <- Guarda los valores
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.tipo = tipo;
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    gastoEliminado(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }

}

class UI{ // <- Muestra el HTML 
    insertarPresupuesto(cantidad){
        const {presupuesto, restante , gastos} = cantidad;
        document.querySelector('#saldo').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
        document.querySelector('#gastos').textContent = gastos;
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        
        if(tipo === 'error'){
            divMensaje.classList.add('mensaje-alerta');
        }else{
            divMensaje.classList.add('mensaje-succes');
        }

        divMensaje.textContent = mensaje;
        document.querySelector('.cotizar__form').insertBefore(divMensaje, formAddGastos);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos){

        this.limpiarHTML(gastoListado);

        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            const nuevoGasto = document.createElement('li');
            nuevoGasto.classList.add('gastos__li')
            nuevoGasto.dataset.id = id;

            nuevoGasto.innerHTML = `<p>${nombre} <p><span> ${cantidad}$</span>`;
            
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('gastos__li-delete');
            btnBorrar.innerHTML = 'Borrar &times;';
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //agregar al html
            gastoListado.appendChild(nuevoGasto);
            console.log(gastoListado);
        });
    }

    
    limpiarHTML(name) {
        while(name.firstChild) {
            name.removeChild(name.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    actualizarGastos(gastos){
        document.querySelector('#gastos').textContent = gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    }


    agregarGastosTipos(gastos){
        gastos.forEach(gasto => {
            const { cantidad, tipo} = gasto; 
            
            const diversion = gastos.filter(gasto => gasto.tipo === 'diversion');
            const sumaDiversion = diversion.reduce((total, diversion) => total + diversion.cantidad, 0);
            document.querySelector('#tipo-diversion').textContent = sumaDiversion;

            const mercado = gastos.filter(gasto => gasto.tipo === 'mercado');
            const sumaComida = mercado.reduce((total, mercado) => total + mercado.cantidad, 0);
            document.querySelector('#tipo-mercado').textContent = sumaComida;

            const educacion = gastos.filter(gasto => gasto.tipo === 'educacion');
            const sumaEducacion = educacion.reduce((total, educacion) => total + educacion.cantidad, 0);
            document.querySelector('#tipo-educacion').textContent = sumaEducacion;

            const hogar = gastos.filter(gasto => gasto.tipo === 'hogar');
            const sumaHogar = hogar.reduce((total, hogar) => total + hogar.cantidad, 0);
            document.querySelector('#tipo-hogar').textContent = sumaHogar;

        })
    }
}

let presupuesto;
const ui = new UI();

//Funciones
function togglePresupuesto(){ // <- activa y desactiva la ventana
    addBtn.classList.toggle("active")  
}

function addBalance(e){ // <- valida el formulario || Guarda el valor en Clase || Instancia el UI con el valor
    e.preventDefault();

    const addBalance = Number(document.querySelector('#add').value);

    if(addBalance === ''|| addBalance < 1){
        console.log('error');
    }

    presupuesto = new Presupuesto(addBalance);
    
    ui.insertarPresupuesto(presupuesto)
}

function agregarGastos(e){
    e.preventDefault();
    
    //Leer los datos del formulario
    const tipo = document.querySelector('#tipo').value;
    const nombre = document.querySelector('#nombre').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar
    if(nombre === '' || cantidad === '' ||  tipo === '0'){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
    } else if( cantidad < 1 || isNaN(cantidad) ){
        ui.imprimirAlerta('Cantidad no validad', 'error')
    }

    const gasto = { nombre, tipo, cantidad, id: Date.now() }
    presupuesto.nuevoGasto(gasto);
    ui.imprimirAlerta('Gastos enviados');

    const { gastos, restante, tipos } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.agregarGastosTipos(gastos);
    ui.actualizarGastos(gastos);

    formAddGastos.reset();
}

function eliminarGasto(id){
    presupuesto.gastoEliminado(id)
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.actualizarGastos(gastos);    
    ui.agregarGastosTipos(gastos);
}