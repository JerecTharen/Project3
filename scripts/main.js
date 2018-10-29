$.ajax({
    url: '../data/course.JSON',
    type: 'GET',
    success: (resolve,reject) => {
        console.log('connection established');
    }
});