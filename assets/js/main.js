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

    let spiralX = x / 2;
    let spiralY = y / 2;

    let textX = -x / 50;
    let textY = -y / 50;

    moveObject(bgSpiral, spiralX, spiralY);
    moveObject(mainText, textX, textY);

});