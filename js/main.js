document.addEventListener('DOMContentLoaded', () =>{
    
    // addStorageToReserve(),
    renderMenuOptions(),
    printModal(reserve),
    printTotals(reserve)
});

const saveReserveStorage = (reserve) => {
    localStorage.setItem('reserves', JSON.stringify(reserve));
};

function addStorageToReserve () {
    const reservation = localStorage.getItem('reserves')
    //operador AND y SPREAD
    reservation && reserve.push(...JSON.parse(reservation));
};

let reserve = [];

//=============   RENDERS

function renderMenuOptions (){

    const menus = document.getElementById('menus');

    // AGREGO FETCH CON RUTA RELATIVA
    fetch('/stock.json')
    .then((response) => response.json())
    .then((options) => { 

    options.forEach((m) => {
        let menu = document.createElement('div')
        menu.classList.add('col-12');
        menu.classList.add('col-lg-3');
        menu.classList.add('col-md-6');
        menu.classList.add('mb-5');
        menu.classList.add('d-flex');
        menu.classList.add('justify-content-center');

        menu.innerHTML = `
        <div class="card text-dark" style="width: 20rem;">
            <img class="card-img-top h-50" src="${m.img}" alt="${m.alt}">
            <div class="card-body m-1">
                <h5 class="card-title">${m.menuName}</h5>
                <p class="card-text">${m.description}</p>
                <p>${m.price}</p>

                <div id=divCounter class= "d-flex flex-row align-items-center text-center justify-content-center">
                    <button id="remove${m.id}" class="btn btn-danger rounded-4"> - </button>
                    <h6 class="text-center m-4" id="quant${m.id}"> - </h6>
                    <button id="add${m.id}"class="btn btn-info rounded-4"> + </button>
                    
                </div>
                
            </div>
        </div>
        `
        menus.appendChild(menu);
        
        let quant = document.getElementById(`quant${m.id}`);
        

        document.getElementById(`remove${m.id}`).addEventListener('click', ()=>{
            removeMenuFromReserve(m.id);
            printCounter(m.id, quant); 
            
            });

        document.getElementById(`add${m.id}`).addEventListener('click',()=>{
            addMenuToReserve(m.id); 
            printCounter(m.id, quant);
        });

        document.getElementById('btnReset').addEventListener('click', () => {
            resetReserve(m.id);
            printCounter(m.id, quant);
        });

        document.getElementById('btnConfirm').addEventListener('click', () => {
            resetReserve(m.id);
            printCounter(m.id, quant);
        });
        printCounter(m.id, quant);
    });   
});
};


// AGREGAR AL CARRITO //
function addMenuToReserve(id){  
    fetch('/stock.json')
    .then((response) => response.json())
    .then((menuOptions) => { 
    let menu = menuOptions.find(menu => menu.id === id);
    let menuInReserve = reserve.find(menu => menu.id === id);
    // TERNARIO
    menuInReserve ?  menuInReserve.quant ++ : (menu.quant = 1, reserve.push(menu))

    Toastify({
        text: "Agregaste un comensal",
        style: {background: "#085492"},
        duration: 1400
        }).showToast();
    
    printModal(reserve)
    printTotals(reserve)
    saveReserveStorage(reserve);
    console.log(reserve)
    });
};
// finAGREGAR AL CARRITO //

//    SACAR DEL CARRITO  //
function removeMenuFromReserve(id){
    let menuInReserve = reserve.find(menuInReserve => menuInReserve.id === id);
    if(!menuInReserve){
        Swal.fire({
            icon:  'warning',
            iconColor: '#b22420',
            title: 'Este menú no está en la reserva',
            showConfirmButton: false,
            timer: 4500,
            showClass:{
                popup: 'swal2-show',
                backdrop: 'swal2-backdrop-show',
                icon: 'swal2-icon-show'   
            },
            hideClass:{
                    popup: 'swal2-hide',
                    backdrop: 'swal2-backdrop-hide',
                    icon: 'swal2-icon-hide'
            }
        })

    } else if(menuInReserve.quant === 0){
        let i= reserve.indexOf(menuInReserve);
        reserve.splice(i,1);

        Toastify({
            text: "Eliminaste un comensal",
            style: {background: "#b22420"},
            duration: 1400
            }).showToast();

    } else{
        menuInReserve.quant --;

        Toastify({
            text: "Eliminaste un comensal",
            style: {background: "#b22420"},
            duration: 1400
            }).showToast();

    };

    printModal(reserve)
    printTotals(reserve)
    saveReserveStorage(reserve);
    console.log(reserve)
};
//   finSACAR DEL CARRITO // 

function resetReserve(){
    reserve.splice(0, (reserve.length));
    printModal(reserve)
    printTotals(reserve)
    saveReserveStorage(reserve)
};

//====== PRINTS =================
function printCounter(id, quant){
    fetch('/stock.json')
    .then((response) => response.json())
    .then(() => { 
    let menuInReserve = reserve.find(menu => menu.id === id);
    !menuInReserve ? quant.innerText = 0 : quant.innerText = menuInReserve.quant;
    });
    
};



function printModal(reserve){
    let modalReserve = document.getElementById('modalBody');
    modalReserve.innerHTML = '';

    reserve.forEach(({quant, menuName}) => {
            let modalText = document.createElement('div');
            modalText.classList.add('text-start');
            modalText.innerHTML = `<p>${quant} menu ${menuName}</p>`;
            if (`${quant}` > 0 ){
            modalBody.appendChild(modalText);
            };
        });
};

function printTotals(reserve){
    const totalQ = reserve.reduce((acc, m) => acc + m.quant, 0);
    const totalReserve = reserve.reduce((acc, m) => acc + (m.price * m.quant), 0);

    let modalTotals = document.getElementById('modalTotals');
    modalTotals.innerHTML = '';

    let modalTotal = document.createElement('div');
    modalTotal.classList.add('text-start');
    modalTotal.innerHTML = `<p>Comensales: ${totalQ}</p>
                            <p>Total a pagar: MXN ${totalReserve}</p>`;
    modalTotals.appendChild(modalTotal);
};

// ================= CONFIRM & GET DATA ===============

const confirmReserve = document.getElementById ('btnConfirm');
confirmReserve.addEventListener('click', () =>{
    Swal.fire({
        title: 'Tu reserva fue confirmada',
        showConfirmButton: false,
        timer: 5000,
        showClass: {
        popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
        }
    })

});
