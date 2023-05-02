const validate = (body)=>{


if( body.firstName ==='' || body.lastName==='' || body.password.length<5 )
  {throw new Error('blad formularza')}
 

else if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email)===false)){
  throw new Error('blad formularza')
}
  }


  

  module.exports = validate