$('#selectCurrency').ready(async function() {
    await fetch('/setCurrency/get')
        .then((response) => {
            return response.text()
        }).then((response1)=> {
            setOptions(response1);
        })
  });

$('#selectCurrency').on('change', function() {
    setCurrency(this.value)
  });

async function setCurrency(value){
const req = $.ajax({
    url: '/setCurrency/'+value.toString(),
    method: 'post',
    });

    req.done(() => {
    $('#selectCurrency').val(value.toString());
});
}

async function setOptions(value) {
    const options = ['CLP', 'USD', 'EUR', 'GBP', 'HKD']
    
    $('#selectCurrency').append(`<option value="${value}"> ${value} </option>`);

    options.forEach(option => {
        if(option !== value){
            $('#selectCurrency').append(`<option value="${option}"> ${option} </option>`);
        }
    })
}