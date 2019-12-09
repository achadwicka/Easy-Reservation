const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('setCurrency', '/:currency', async (ctx) => {
    const currency = ctx.params.currency;

    ctx.session.currency = currency;

    if(currency === 'CLP'){
        ctx.session.symbol = '$';
    }
    else if(currency === 'USD'){
        ctx.session.symbol = '$USD';
    }
    else if(currency === 'EUR'){
        ctx.session.symbol = '€';
    }
    else if(currency === 'GBP'){
        ctx.session.symbol = '£';
    }
    else if(currency === 'HKD'){
        ctx.session.symbol = '$HKD';
    }
  
    ctx.response.body = currency;

});

router.get('setCurrency', '/get', async (ctx) => {
    if (ctx.session.currency != undefined){
        ctx.response.body = ctx.session.currency;
    }
    else{
        ctx.session.currency = 'CLP';
        ctx.session.symbol = '$';
        ctx.response.body = 'CLP';
    }
        
});

module.exports = router;