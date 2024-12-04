let itemCounter = 0;
let imageid;
let files;

function theSlider() {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    var mainImage = document.getElementById("mainImage");

    output.innerHTML = slider.value;
    mainImage.style.width = slider.value + "%";

    slider.oninput = function() {
        output.innerHTML = this.value;
        mainImage.style.width = this.value +"%";
    }

}

document.getElementsByClassName("photo-upload")[0].addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementsByClassName('user-photo')[0].src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.querySelector('.clothing-upload').addEventListener('change', function(event) {
    files = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('clothing-item');
                img.style.position = 'absolute';
                img.style.top = '100px';
                img.style.left = '100px';
                img.draggable = true; 
                img.id = `clothing-item-${itemCounter++}`;

                document.getElementById('display-area').appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }
});

document.addEventListener('dragstart', function(event) {
    if (event.target.classList.contains('clothing-item')) {
        event.dataTransfer.setData('text/plain', event.target.id);
    }
});

document.addEventListener('dragover', function(event) {
    event.preventDefault();

});


document.addEventListener('drop', function(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);

    if (draggableElement) {

        if(draggableElement )
        draggableElement.style.left = event.clientX + 'px';
        draggableElement.style.top = event.clientY + 'px';

        const src = draggableElement.src;

        const clothingItemData = {
            src: src,
            top: draggableElement.style.top,
            left: draggableElement.style.left
        };

         let savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || [];

         savedOutfits.push(clothingItemData);
 
         localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));

    }
});

document.querySelector('.trash-bin').addEventListener('dragover', function(event) {
    event.preventDefault();
});

document.getElementById('save-canvas').addEventListener('click', function () {
    const backgroundImage = document.querySelector('.user-photo');
    const displayArea = document.getElementById('display-area');
    const clothingItems = displayArea.querySelectorAll('.clothing-item');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = backgroundImage.width;
    canvas.height = backgroundImage.height;

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    clothingItems.forEach(item => {
        const img = new Image();
        img.src = item.src;
        const left = parseFloat(item.style.left);
        const top = parseFloat(item.style.top);

        img.onload = function () {
            ctx.drawImage(img, left, top, item.width, item.height);
        };
    });

    setTimeout(() => {
        const dataURL = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `clothing-item-${Date()}`;
        link.click();
    }, 500); 
});




document.querySelector('.trash-bin').addEventListener('drop', function (event) {
    event.preventDefault();
    const draggedElementId = event.dataTransfer.getData('text');
    const draggedElement = document.getElementById(draggedElementId);

    if (draggedElement && draggedElement.classList.contains('clothing-item')) {
        draggedElement.remove();
        alert('Item dropped in the trash bin!');
    } else {
        alert('Invalid item! Could not delete.');
    }
});


