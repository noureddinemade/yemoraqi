//

const bgSpiral      = document.querySelector('div.bg');
const mainText      = document.querySelector('section h1');

//

const moveObject    = (obj, x, y) => {

    obj.style.transform = `translate(${x}px,${y}px)`

}

//

document.addEventListener('mousemove', (e) => {

    let x = e.pageX;
    let y = e.pageY;

    let spiralX = x / 10;
    let spiralY = y / 10;

    moveObject(bgSpiral, spiralX, spiralY);

});