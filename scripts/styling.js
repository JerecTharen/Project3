(function(){
    let inputs = document.getElementsByTagName('input');
    let header = document.getElementsByTagName('h1')[0].clientHeight;
    // header = header.split('p');
    // header = Number(header[0]);
    for (let i = 0; i < inputs.length; i++){
        inputs[i].style.height = `${header}px`;
    }
})();
(function(){
    let inputs = document.getElementsByTagName('input');
    let header = window.getComputedStyle(document.getElementsByTagName('h1')[0]).getPropertyValue('font-size');
    header = header.split('p');
    header = Number(header[0]);
    for (let i = 0; i < inputs.length; i++){
        inputs[i].style.fontSize = `${header}px`;
    }
})();
(function(){
    let headers = document.getElementsByTagName('h1');
    let result = 0;
    for (let i = 0; i < headers.length; i++){
        let width = window.getComputedStyle(document.getElementsByTagName('h1')[i]).getPropertyValue('width');
        width = width.split('p');
        width = Number(width[0]);
        if (width > result){
            result = width;
        }
    }
    let inputs = document.getElementsByTagName('input');
    for (let x =0; x < inputs.length; x++){
        inputs[i].style.width = `${result}px`;
    }
})();