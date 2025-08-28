const cl = console.log;

const toggleModalBtns = document.querySelectorAll('.toggleModal');
const movieModal = document.getElementById('movieModal');
const backDrop = document.getElementById('backDrop');
const display = document.getElementById('display');
const movieForm = document.getElementById('movieForm');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const movieNameControl = document.getElementById('movieName');
const posterUrlControl = document.getElementById('posterUrl');
const overviewControl = document.getElementById('overview');
const ratingControl = document.getElementById('rating');

const dataArray = JSON.parse(localStorage.getItem('dataArray')) || [];

const setStorage = () => {
    localStorage.setItem('dataArray', JSON.stringify(dataArray))
};

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const ratingColor = (r) => {
    if(r > 3){
        return `bg-success`
    }
    else if(r > 1 && r <= 3){
        return `bg-warning`
    }
    else{
        return `bg-danger`
    }
};

const snackBar = (msg, icon) => {
    swal.fire({
        title: msg,
        icon: icon,
        timer: 2000
    })
};

const templating = (arr) => {
    let result = ``;
    arr.forEach(obj => {
        result += `<div class="col-md-3 mb-4" id="${obj.id}">
        <div class="card text-white bg-secondary movie-card">
            <div class="card-body p-1 movie-card-body">
                <div class="content">
                    <img src="${obj.posterUrl}" alt="${obj.movieName}">
                    <span class="badge ${ratingColor(obj.rating)}">${obj.rating}</span>
                    <div class="button-group p-2">
                        <button type="button" onclick="onEdit(this)" class="btn btn-primary btn-sm">Edit</button>
                        <button type="button" onclick="onRemove(this)" class="btn btn-secondary btn-sm ml-1">Remove</button>
                    </div>
                </div>
                <div class="caption p-2">
                    <h5>${obj.movieName}</h5>
                    <p class="m-0 text-justify">${obj.overview}</p>
                </div>
            </div>
        </div>
    </div>`
    })

    display.innerHTML = result
}; 

templating(dataArray);

const onToggleModal = () => {
    movieModal.classList.toggle('active')
    backDrop.classList.toggle('active')
    movieForm.reset()
    addBtn.classList.remove('d-none')
    updateBtn.classList.add('d-none')
};

const showNewCard = (obj) => {
    let newCard = document.createElement('div')

    newCard.innerHTML = `<div class="card text-white bg-secondary movie-card">
    <div class="card-body p-1 movie-card-body">
        <div class="content">
            <img src="${obj.posterUrl}" alt="${obj.movieName}">
            <span class="badge ${ratingColor(obj.rating)}">${obj.rating}</span>
            <div class="button-group p-2">
                <button type="button" onclick="onEdit(this)" class="btn btn-primary btn-sm">Edit</button>
                <button type="button" onclick="onRemove(this)" class="btn btn-secondary btn-sm ml-1">Remove</button>
            </div>
        </div>
        <div class="caption p-2">
            <h5>${obj.movieName}</h5>
            <p class="m-0 text-justify">${obj.overview}</p>
        </div>
    </div>
</div>`

    newCard.id = obj.id
    newCard.className = 'col-md-3 mb-4'

    display.prepend(newCard)
};

const showUpdatedCard = (obj) => {
    let updatedCard = document.getElementById(obj.id)

    updatedCard.innerHTML = `<div class="card text-white bg-secondary movie-card">
    <div class="card-body p-1 movie-card-body">
        <div class="content">
            <img src="${obj.posterUrl}" alt="${obj.movieName}">
            <span class="badge ${ratingColor(obj.rating)}">${obj.rating}</span>
            <div class="button-group p-2">
                <button type="button" onclick="onEdit(this)" class="btn btn-primary btn-sm">Edit</button>
                <button type="button" onclick="onRemove(this)" class="btn btn-secondary btn-sm ml-1">Remove</button>
            </div>
        </div>
        <div class="caption p-2">
            <h5>${obj.movieName}</h5>
            <p class="m-0 text-justify">${obj.overview}</p>
        </div>
    </div>
</div>`
};

const onMovieAdd = (eve) => {
    eve.preventDefault()

    let newObj = {
        movieName: movieNameControl.value,
        posterUrl: posterUrlControl.value,
        overview: overviewControl.value,
        rating: ratingControl.value,
        id: uuid()
    }

    onToggleModal()

    dataArray.unshift(newObj)

    setStorage()

    showNewCard(newObj)

    snackBar(`${newObj.movieName} Movie Card Added Successfully !!!`, 'success')
};

const onEdit = (ele) => {
    let editId = ele.closest('.col-md-3').id
    localStorage.setItem('editId', editId)

    let editObj = dataArray.find(x => x.id === editId)
    onToggleModal()

    movieNameControl.value = editObj.movieName
    posterUrlControl.value = editObj.posterUrl
    overviewControl.value = editObj.overview
    ratingControl.value = editObj.rating

    addBtn.classList.add('d-none')
    updateBtn.classList.remove('d-none')
};

const onMovieUpdate = () => {
    if(movieNameControl.value && posterUrlControl.value && overviewControl.value && ratingControl.value){
        let updateId = localStorage.getItem('editId')
        cl(updateId)
        localStorage.removeItem('editId')

        let updateObj = {
            movieName: movieNameControl.value,
            posterUrl: posterUrlControl.value,
            overview: overviewControl.value,
            rating: ratingControl.value,
            id: updateId
        }

        onToggleModal()

        let updateObjInd = dataArray.findIndex(x => x.id === updateId)
        cl(updateObjInd)
        dataArray[updateObjInd] = updateObj

        setStorage()

        showUpdatedCard(updateObj)

        snackBar(`${updateObj.movieName} Movie Card Updated Successfully !!!`, 'success')
    }else{
        snackBar(`Field can't be empty !!!`, 'error')
    }
};

const onRemove = (ele) => {
    let removeId = ele.closest('.col-md-3').id
    let removeObj = dataArray.find(x => x.id === removeId)
    Swal.fire({
        title: "Are you sure to remove this Movie?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Remove"
      }).then((result) => {
        if (result.isConfirmed) {
            let removeObjInd = dataArray.indexOf(removeObj)
            dataArray.splice(removeObjInd, 1)
    
            setStorage()
    
            ele.closest('.col-md-3').remove()
    
            snackBar(`${removeObj.movieName} Movie Card Deleted Successfully !!!`, 'success')
        }
      });    
};

toggleModalBtns.forEach(btn => btn.addEventListener('click', onToggleModal));
movieForm.addEventListener('submit', onMovieAdd);
updateBtn.addEventListener('click', onMovieUpdate);