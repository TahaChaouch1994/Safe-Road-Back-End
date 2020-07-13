const express = require('express')
const app = express()
const morgan = require ('morgan')
const mysql = require('mysql')
const multer = require('multer')
const Hapi = require('@hapi/hapi');
const crypto = require('crypto');
const path = require('path');
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs');
const encode = require( 'hashcode' ).hashCode;
var Pushy = require('pushy');
///////////////////////////////////////////////  IMAAAAAAAAAAAAAAAAAAAAAGEE ///////////////////////////////////


let lastImageOriginal="";
let lastImageCrypted="";
let cutImageProfile="";
let cutImageProfileId="";
let point=0;

app.use(function(req, res, next) 
{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});



var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/upload' enctype='multipart/form-data'>" +
"<input type='file' name='upload'/>" +
"<input type='submit' /></form>" +
"</body></html>";


app.get('/form', function (req, res){
  res.writeHead(200, {'Content-Type': 'text/html' });
  res.end(form);

});

// Include the node file module
var fs = require('fs');

storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
      lastImageOriginal = (String) (file.originalname);
     // console.log(lastImageOriginal)
      return crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) {
          return cb(err);
        }
        return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
      });
    }
  });

// Post files
app.post(
  "/upload",
  multer({
    storage: storage
  }).single('upload'), function(req, res) {
   // console.log(req.file);
   // console.log(req.body);
    res.redirect("/uploads/" + req.file.filename );
   // console.log(req.file.filename);
   // lastImage=req.file.filename;
  //  console.log("hhhhhhhhh")
    return res.status(200).end();
  });

app.get('/uploads/:upload', function (req, res){
  file = req.params.upload;

  //console.log(req.params.upload);

  var img = fs.readFileSync(__dirname + "/uploads/" + file);
  lastImageCrypted=file;
  res.writeHead(200, {'Content-Type': 'image/png' });
  res.end(img, 'binary');


  cutImageProfile= lastImageOriginal.substring(0,12);
 
  if(cutImageProfile == "profileimage")
{
  point =lastImageOriginal.indexOf(".")
  cutImageProfileId= lastImageOriginal.substring(12,point);

  
  const queryString = "UPDATE userroad SET image = ? WHERE id = ? "
  connection.query(queryString, [lastImageCrypted,cutImageProfileId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
    // res.json("lol");
      return
      // throw 
      err
    }
  });
  


  console.log(lastImageOriginal)
  console.log(lastImageCrypted)
  console.log(cutImageProfile)
  console.log(cutImageProfileId)
  console.log(point)
}

});



//////////////////////////////////////IOS IMAGE ////////////////////////////
 

var fs = require('fs');

storage = multer.diskStorage({
    destination: './uploadsios/',
    filename: function(req, file, cb) {
      return crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) {
          return cb(err);
        }
        return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
      });
    }
  });


// Post files
app.post(
  "/uploadios",
  multer({
    limits: { fieldSize: 25 * 1024 * 1024 },
    storage: storage
  }).single('uploadios'), function(req, res) {
    console.log(req.file);
    console.log(req.body);
    res.redirect("/uploadsios/" + req.file.filename);
  //  console.log(req.file.filename);
    return res.status(200).end();
  });



app.get('/uploadsios/:uploadios', function (req, res){
  file = req.params.upload;
 // console.log(req.params.upload);
  var img = fs.readFileSync(__dirname + "/uploads/" + file);
  res.writeHead(200, {'Content-Type': 'image/png' });
  res.end(img, 'binary');

});






  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(morgan('short'))

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'saferoad'
 })


 app.listen(3003,()=>{
     console.log('Taha running on 3003')
 })

connection.connect(
    function(err)
    {
        if (err) throw err;
        console.log(err);
    }
)
 //FUll get
app.get("/user", function(req,res) 
{
     connection.query("SELECT * FROM userroad", function(err, result)
     {
        if (err) throw err;
        res.json(result);
        res.end();
     })
})








//Register IOS

app.get('/newuser/:firstname/:lastname/:email/:numero/:datedenaissance/:password/:gender', function (req, res) {

   
  let nom = req.params.firstname
    let prenom = req.params.lastname
    let email = req.params.email
    let numero = req.params.numero
    let datedenaissance = req.params.datedenaissance
    let password = req.params.password
    let gender = req.params.gender


    var hash = encode().value(password);
  
    

    const queryString = "SELECT * FROM userroad WHERE email = ? "
    connection.query(queryString, [email], (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for users: " + err)
      // res.json("lol");
        return
        // throw err
      }
  
      console.log("I think we fetched users successfully");

      //   res.json(rows);
    


    if (rows.length!=0)
     { 
   
        res.json("false")
        res.end
     
        
    }


      else
      { 
        res.json("true")
        res.end
        const queryString = "INSERT INTO userroad (firstname,lastname,email,numero,datedenaissance,password,gender) values (?,?,?,?,?,?,?)"


        connection.query(queryString, [nom,prenom,email,numero,datedenaissance,hash,gender], (err, rows, fields) => {
          if (err) {
            console.log("Failed to query for users: " + err)
           
            return
            // throw err
          }
      
         // res.send(500)
      
    });}
    })
  
    // res.end()


})














//Register ANDROID


app.get('/newuserandroid/:email/:password', function (req, res) {

   


      let email = req.params.email
      let password2 = req.params.password
      var pwd = encode().value(password2); 

  
  
      
  
      const queryString = "SELECT * FROM userroad WHERE email = ? "
      connection.query(queryString, [email], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
        // res.json("lol");
          return
          // throw err
        }
    
        console.log("I think we fetched users successfully");
  
        //   res.json(rows);
      
  
  
      if (rows.length!=0)
       { 
     
          res.json("false")
          res.end
       
          
      }
  
  
        else
        { 
          res.json("true")
          res.end
          const queryString = "INSERT INTO userroad (email,password) values (?,?)"
  
  
          connection.query(queryString, [email,pwd], (err, rows, fields) => {
            if (err) {
              console.log("Failed to query for users: " + err)
             
              return
              // throw err
            }
        
           // res.send(500)
        
      });}
      })
    
      // res.end()
      
      
    })    





    //Update ANDROID
  
  
    app.get('/updateuser/:email/:firstname/:lastname/:numero/:gender/:datedenaissance', function (req, res) {
  
        let email = req.params.email
        let firstname = req.params.firstname
        let lastname = req.params.lastname
        let numero = req.params.numero
        let gender = req.params.gender
        let datedenaissance = req.params.datedenaissance
  
        
    
    
    
       
  
            const queryString = "UPDATE userroad SET firstname = '"+firstname+"' , lastname = '"+lastname+"',numero = '"+numero+"', gender = '"+gender+"', datedenaissance = '"+datedenaissance+"',etatcompte = '1'  WHERE email = '"+email+"'   "
        
  
            connection.query(queryString, [email], (err, rows, fields) => {
              if (err) {
                console.log("Failed to query for users: " + err)
               
                return
                // throw err
              }
          
             // res.send(500)
             res.json("good")
        })
          
             // res.send(500)
          
    
   
      
        // res.end()
    
    
    })
  
  
  
  

    // Second Update ANDROID
  
  
    app.get('/updateuser2/:email/:adresse/:numero', function (req, res) {
  
      let email = req.params.email
      let adresse = req.params.adresse
      let numero = req.params.numero


      
  
  
  
     

          const queryString = "UPDATE userroad SET adresse = '"+adresse+"' ,numero = '"+numero+"'  WHERE email = '"+email+"';" 
      

          connection.query(queryString, [email], (err, rows, fields) => {
            if (err) {
              console.log("Failed to query for users: " + err)
             
              return
              // throw err
            }
        
           // res.send(500)
           res.json("good")
      })
        
           // res.send(500)
        
  
 
    
      // res.end()
  
  
  })
  
  
  
  
  
     //Update IOS
  
  
     app.get('/updateuserIos/:email/:firstname/:lastname/:adresse/:numero', function (req, res) {
  
      let email = req.params.email
      let firstname = req.params.firstname
      let lastname = req.params.lastname
      let adresse = req.params.adresse
      let numero = req.params.numero
   

      
  
  
  
     

          const queryString = "UPDATE userroad SET firstname = '"+firstname+"' , lastname = '"+lastname+"',adresse = '"+adresse+"', numero = '"+numero+"'   WHERE email = '"+email+"'   "
      

          connection.query(queryString, [email], (err, rows, fields) => {
            if (err) {
              console.log("Failed to query for users: " + err)
             
              return
              // throw err
            }
        
           // res.send(500)
           res.json("true")
      })
        
           // res.send(500)
        
  
 
    
      // res.end()
  
  
  })
  
  
  
  

    


    









//CONNECTION

app.get('/user/:email/:pwd', (req, res) => {
    const userId = req.params.email
    const userpwd= req.params.pwd
    var hash = encode().value(userpwd); 

    const queryString = "SELECT * FROM userroad WHERE email = ? and password = ?"
    connection.query(queryString, [userId,hash], (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for users: " + err)
        res.sendStatus(500)
        return
        // throw err
      }
  
      console.log("I think we fetched users successfully")
  
      
  /*
      const users = rows.map((row) => {
        return {row}
      })
  */if (rows.length!=0)
     { res.json("true");}
      else
      {res.json("false")}
    })
  
    // res.end()
  })








  //GET PROFIL ANDROID

  app.get('/usergetemail/:email', (req, res) => {
    const userId = req.params.email
    const userpwd= req.params.pwd
    const queryString = "SELECT * FROM userroad WHERE email = ?"
    connection.query(queryString, [userId], (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for users: " + err)
        res.sendStatus(500)
        return
        // throw err
      }
      else
      res.json(rows);
  
  
    })
  
    // res.end()
  })






  // CHANGE PASSWORD ANDROID


  app.get('/changepassword/:email/:pwd', (req, res) => {
    const userId = req.params.email
    const userpwd= req.params.pwd

    var hash = encode().value(userpwd); 

    const queryString = "UPDATE userroad SET password = '"+hash+"'  WHERE email = '"+userId+"'   "
      

          connection.query(queryString, [userId], (err, rows, fields) => {
            if (err) {
              console.log("Failed to query for users: " + err)
             
              return
              // throw err
            }
        
           // res.send(500)
           res.json("true")
      })


    })





    //Register ANDROID


app.get('/newuserandroid/:email/:password', function (req, res) {

   

  let email = req.params.email
  let password = req.params.password

  var hash = encode().value(password); 
  


  

  const queryString = "SELECT * FROM userroad WHERE email = ? "
  connection.query(queryString, [email], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
    // res.json("lol");
      return
      // throw err
    }

    console.log("I think we fetched users successfully");

    //   res.json(rows);
  


  if (rows.length!=0)
   { 
 
      res.json("false")
      res.end
   
      
  }


    else
    { 
      res.json("true")
      res.end
      const queryString = "INSERT INTO userroad (email,password) values (?,?)"


      connection.query(queryString, [email,hash], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }
    
       // res.send(500)
    
  });}
  })

  // res.end()
  
  
})    




function changeTime(obj2)
{
  obj = String(obj2)
  if (obj.length ==1)
{
  obj = "0" + obj
}

return obj
}


//Add Declare ANDROID


app.get('/adddeclare/:iduserroad/:titre/:contenu/:latitude/:longitude/:stolen', function (req, res) {

    let iduserroad = req.params.iduserroad
    let titre = req.params.titre
    let contenu = req.params.contenu
    let latitude = req.params.latitude
    let longitude = req.params.longitude
    let stolen = req.params.stolen




    

let ts = Date.now();

let date_ob = new Date(ts);
let jour = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

 jour2=changeTime(jour)
 month2=changeTime(month)
 year2=changeTime(year)
 hours2=changeTime(hours)
 minutes2=changeTime(minutes)
 seconds2=changeTime(seconds)



let date =(jour2+"/"+month2+"/"+year2+" at "+hours2+":"+minutes2);



   

        const queryString = "INSERT INTO  userdeclare SET iduserroad = '"+iduserroad+"' , titre = '"+titre+"',contenu = '"+contenu+"', latitude = '"+latitude+"', longitude = '"+longitude+"', stolen = '"+stolen+"', date = '"+date+"'   "
    

        connection.query(queryString, [iduserroad,titre,contenu,latitude,longitude,stolen,date], (err, rows, fields) => {
          if (err) {
            console.log("Failed to query for users: " + err)
           
            return
            // throw err
          }
      
         // res.send(500)
         res.json("good")
    })
      
         // res.send(500)
      


  
    // res.end()


})





//Add Declare ANDROID


app.get('/adddeclare/:iduserroad/:titre/:contenu/:latitude/:longitude/:stolen', function (req, res) {

    let iduserroad = req.params.iduserroad
    let titre = req.params.titre
    let contenu = req.params.contenu
    let latitude = req.params.latitude
    let longitude = req.params.longitude
    let stolen = req.params.stolen




    

let ts = Date.now();

let date_ob = new Date(ts);
let jour = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();



let date =(jour+"/"+month+"/"+year+"/"+hours+"/"+minutes+"/"+seconds);



   

        const queryString = "INSERT INTO  userdeclare SET iduserroad = '"+iduserroad+"' , titre = '"+titre+"',contenu = '"+contenu+"', latitude = '"+latitude+"', longitude = '"+longitude+"', stolen = '"+stolen+"', date = '"+date+"'   "
    

        connection.query(queryString, [iduserroad,titre,contenu,latitude,longitude,stolen,date], (err, rows, fields) => {
          if (err) {
            console.log("Failed to query for users: " + err)
           
            return
            // throw err
          }
      
         // res.send(500)
         res.json("good")
    })
      
         // res.send(500)
      


  
    // res.end()


})



//Add Declare ANDROID


app.get('/adddeclare/:iduserroad/:titre/:contenu/:latitude/:longitude/:stolen', function (req, res) {

    let iduserroad = req.params.iduserroad
    let titre = req.params.titre
    let contenu = req.params.contenu
    let latitude = req.params.latitude
    let longitude = req.params.longitude
    let stolen = req.params.stolen




    

let ts = Date.now();

let date_ob = new Date(ts);
let jour = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();



let date =(jour+"/"+month+"/"+year+"/"+hours+"/"+minutes+"/"+seconds);



   

        const queryString = "INSERT INTO  userdeclare SET iduserroad = '"+iduserroad+"' , titre = '"+titre+"',contenu = '"+contenu+"', latitude = '"+latitude+"', longitude = '"+longitude+"', stolen = '"+stolen+"', date = '"+date+"'   "
    

        connection.query(queryString, [iduserroad,titre,contenu,latitude,longitude,stolen,date], (err, rows, fields) => {
          if (err) {
            console.log("Failed to query for users: " + err)
           
            return
            // throw err
          }
      
         // res.send(500)
         res.json("good")
    })
      
         // res.send(500)
      


  
    // res.end()


})



  //GET MY POSTS ANDROID

  app.get('/usergetdeclare/:iduserroad', (req, res) => {
    const iduserroad = req.params.iduserroad

    const queryString = "SELECT * FROM userdeclare WHERE iduserroad = ?"
    connection.query(queryString, [iduserroad], (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for users: " + err)
        res.sendStatus(500)
        return
        // throw err
      }
      else
      res.json(rows);
  
  
    })
  
    // res.end()
  })








    //GET ALL POSTS ANDROID

    app.get('/usergetdeclare2', (req, res) => {
      const iduserroad = req.params.iduserroad
  

      const queryString = "SELECT  ud.* ,ur.firstname as firstname,ur.lastname as lastname,ur.gender as gender from userdeclare ud join userroad ur on ur.id=ud.iduserroad;"
      connection.query(queryString,(err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
          res.sendStatus(500)
          return
          // throw err
        }
        else
        res.json(rows);
    
    
      })
    
      // res.end()
    })






    // GET IMAGE BY ID



    app.get('/getimagebyid/:iduserroad', (req, res) => {
      const iduserroad = req.params.iduserroad
  
      const queryString = "SELECT image FROM userroad WHERE id = ?"
      connection.query(queryString, [iduserroad], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
          res.sendStatus(500)
          return
          // throw err
        }
        else
        res.json(rows);
    
    
      })
    
      // res.end()
    })


    // GET IMAGE BY ID IOS



    app.get('/getimagebyidios/:iduserroad', (req, res) => {
      const iduserroad = req.params.iduserroad
  
      const queryString = "SELECT * FROM userroad WHERE id = ?"
      connection.query(queryString, [iduserroad], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
          res.sendStatus(500)
          return
          // throw err
        }
        else
        res.json(rows);
    
    
      })
    
      // res.end()
    })



      //GET ONE POST ANDROID

      app.get('/usergetonepost/:iduserdeclare', (req, res) => {
        const iduserdeclare = req.params.iduserdeclare
    
  
        const queryString = "SELECT  ud.* ,ur.firstname as firstname,ur.lastname as lastname,ur.gender as gender from userdeclare ud join userroad ur on ur.id=ud.iduserroad WHERE iduserdeclare=?;"
        connection.query(queryString, [iduserdeclare],(err, rows, fields) => {
          if (err) {
            console.log("Failed to query for users: " + err)
            res.sendStatus(500)
            return
            // throw err
          }
          else
          res.json(rows);
      
      
        })
      
        // res.end()
      })
    

      


   //Add Comment IOS


app.get('/addcomment/:postid/:diglaid/:commentcontenu', function (req, res) {

  let postid = req.params.postid
  let diglaid = req.params.diglaid
  let commentcontenu = req.params.commentcontenu





      const queryString = "INSERT INTO  userdeclarecomment SET postid = '"+postid+"' , diglaid = '"+diglaid+"',commentcontenu = '"+commentcontenu+"'"
  

      connection.query(queryString, [postid,diglaid,commentcontenu], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }
    
       // res.send(500)
       res.json("good")
  })
    
       // res.send(500)
    



  // res.end()


})



 //Get Comment IOS


 app.get('/getcommentbyid/:postid', function (req, res) {

  let postid = req.params.postid

      const queryString = "SELECT  udc.* ,ur.firstname as firstname,ur.lastname as lastname FROM userdeclarecomment udc join userroad ur on ur.id=udc.diglaid WHERE postid = '"+postid+"';"

  

      connection.query(queryString, [postid], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }
    
       // res.send(500)
       res.json(rows)
  })
    
       // res.send(500)
    



  // res.end()


})
    




/*

///////// MAIL FUNCTION /////////






var mailto = 'taha.chaouch@esprit.tn';
var passwordcode = (Math.floor(100000 + Math.random() * 900000)).toString()

var transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
   user: 'saferoadesprit@gmail.com',
   pass: 'Test2020'
}
});



var mailOptions = {
  from: 'taha.chaouch@esprit.tn',
  to: mailto,
  subject: 'Password reset',
  text: 'Hello, Your Verification Code is: ' +passwordcode 
};


transporter.sendMail(mailOptions, function(error, info){
if(error) {
  console.log(error);
} else {
  console.log('Email sent')
  console.log(

    passwordcode

);
}

})


*/




 //Get Reset Code


 app.get('/getresetcode/:mail', function (req, res) {

  let mail = req.params.mail

  var mailto = mail;
  var passwordcode = (Math.floor(100000 + Math.random() * 900000)).toString()

  
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
     user: 'saferoadesprit@gmail.com',
     pass: 'Test2020'
  }
  });
  
  
  
  var mailOptions = {
    from: 'saferoadesprit@gmail.com',
    to: mailto,
    subject: 'Password reset',
    text: 'Hello, Your Verification Code is: ' +passwordcode 
  };
  
  
  transporter.sendMail(mailOptions, function(error, info){
  if(error) {
    console.log(error);
  } else {
    console.log('Email sent')
    console.log(
  
      passwordcode
  
  );
  }
  
  })




  const queryString2 = "DELETE FROM resetcode WHERE mail=?"

  

  connection.query(queryString2, [mailto], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
     
      return
    }

   res.json(rows)
})


  

      const queryString = "INSERT INTO resetcode(mail,code) VALUES(?,?)"

  

      connection.query(queryString, [mailto,passwordcode], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
        }
  })
    



})





// CHECK CODE RESET



app.get('/checkcodereset/:mail/:code', function (req, res) {

  let mail = req.params.mail
  let code = req.params.code

      const queryString = "SELECT resetid FROM resetcode WHERE mail = '"+mail+"' AND code = '"+code+"'"

  

      connection.query(queryString, [mail,code], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }
    
       res.json(rows)
  })
    


})




//GET MAIL BY ID


app.get('/getidbymail/:mail/:currentid', function (req, res) {

  let mail = req.params.mail
  let currentid = req.params.currentid

      const queryString = "SELECT id FROM userroad WHERE email = '"+mail+"' "

  

      connection.query(queryString, [mail], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
        }

        

        if(rows.length != 0)
        {

         

       /*   res.json(rows) 

          console.log(rows[0].id)

          res.end() */

          receiveridtest = rows[0].id


          const queryString3 = "SELECT etat FROM trustedfriend  WHERE (idreceiver = '"+receiveridtest+"' AND idsender = '"+currentid+"'  AND (etat = 1 OR etat =2) ) OR (idreceiver = '"+currentid+"' AND idsender = '"+receiveridtest+"' AND (etat = 1 OR etat =2)) "


          connection.query(queryString3, [currentid,receiveridtest], (err, rows, fields) => {
            if (err) {
              console.log("Failed to query for users: " + err)
             
              return
            }
            else if(rows.length > 0)
            {
              res.json("ALREA")
            }
             
            else
            {



              
                 const queryString5 = "SELECT keyuser FROM pushnotif WHERE iduser = '"+mail+"' "

                 
  

                    connection.query(queryString5, [mail], (err, rows2, fields) => {
                       if (err) {
                         console.log("Failed to query for users: " + err)
         
                          return
                       }


                       else

                       {



                        var pushyAPI = new Pushy('0cff1886cc0e31064a938d2dd218d4f2b530b5fa6c6f0d00bbe2eccef272dbad');
                        var data = {
                          message: 'You have Received A Trusted Friend Invitation ' 
                      };
                       
                      var to = [rows2[0].keyuser];

                      var options = {
                        notification: {
                            badge: 1,
                            sound: 'ping.aiff',
                            body: 'Hello World \u270c'
                        },
                    };



                    pushyAPI.sendPushNotification(data, to, options, function (err, id) {

                      if (err) {
                          return console.log('Fatal Error', err);
                      }
                  
                      console.log('Push sent successfully! (ID: ' + id + ')');
                  });





                       }


                      })

                 
            



              
            const queryString2 = "INSERT INTO trustedfriend (idsender,idreceiver) values (?,?) "
          
           connection.query(queryString2, [currentid,receiveridtest], (err, rows, fields) => {
            if (err) {
              console.log("Failed to query for users: " + err)
             
              return
            }

            else 
            {
              res.json("GOOOD")
            }
          })
            }

          })
          
       

      
      }

        else 
        {
          res.json("ERROR")
          res.end()
        }

      

        
              
  })

})
    
    



// ANNULER LA DEMANDE 

app.get('/annulerfriend/:idrequest', function (req, res) {

  let idrequest = req.params.idrequest


      const queryString = "UPDATE trustedfriend SET etat=0 WHERE idtrustedfriend = '"+idrequest+"' "

  

      connection.query(queryString, [idrequest], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }
  })
    
  res.json("GOOD")


})


// ACCEPTER LA DEMANDE 

app.get('/accepterfriend/:idrequest', function (req, res) {

  let idrequest = req.params.idrequest


      const queryString = "UPDATE trustedfriend SET etat=2 WHERE idtrustedfriend = '"+idrequest+"' "

  

      connection.query(queryString, [idrequest], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }
  })
    
  res.json("GOOD")


})




//AFFICHER DEMANDE EN COURS SENDER

app.get('/senderwait/:idsender', function (req, res) {

  let idsender = req.params.idsender


  const queryString ="SELECT  tf.* ,ur.firstname as firstname,ur.lastname as lastname FROM trustedfriend tf join userroad ur on ur.id=tf.idreceiver WHERE idsender = '"+idsender+"' AND etat=1;"


  

      connection.query(queryString, [idsender], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }

        res.json(rows)



  })
    



})


//AFFICHER DEMANDE EN COURS RECEIVER

app.get('/receiverwait/:idreceiver', function (req, res) {

  let idreceiver = req.params.idreceiver


  const queryString ="SELECT  tf.* ,ur.firstname as firstname,ur.lastname as lastname FROM trustedfriend tf join userroad ur on ur.id=tf.idsender WHERE idreceiver = '"+idreceiver+"' AND etat=1;"


  

      connection.query(queryString, [idreceiver], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }

        res.json(rows)
  })
    



})





//AFFICHER MES AMIES

app.get('/mycontact/:idreceiver', function (req, res) {

  let idreceiver = req.params.idreceiver


  const queryString ="SELECT  tf.* ,ur.firstname as firstname,ur.lastname as lastname FROM trustedfriend tf join userroad ur on ur.id=tf.idreceiver WHERE ((idsender = '"+idreceiver+"') AND etat=2);"


  

      connection.query(queryString, [idreceiver], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }

        res.json(rows)
  })
    



})



//AFFICHER MES AMIES PARTII

app.get('/mycontactsupp/:idreceiver', function (req, res) {

  let idreceiver = req.params.idreceiver


  const queryString2 ="SELECT  tf.* ,ur.firstname as firstname,ur.lastname as lastname FROM trustedfriend tf join userroad ur on ur.id=tf.idsender WHERE ((idreceiver = '"+idreceiver+"') AND etat=2);"


  

      connection.query(queryString2, [idreceiver], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }

        res.json(rows)
  })
    



})




// CONVERT EMAIL TO ID
app.get('/convertmailtoid/:mail', function (req, res) {

  let mail = req.params.mail

      const queryString = "SELECT id FROM userroad WHERE email = '"+mail+"' "

  

      connection.query(queryString, [mail], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
        }

        
        if(rows.length != 0)
        {


          receiveridtest = rows[0].id
          res.json(receiveridtest)


          

        }

        else res.json("BAD")

        res.end();

      })

})




// CHECK EXISTANCE of mail (one donne id ici ) in friend list
app.get('/checkidfriend/:id/:idcurrent', function (req, res) {

  let id = req.params.id
  let idcurrent = req.params.idcurrent

      const queryString = "SELECT idtrustedfriend FROM trustedfriend WHERE (idreceiver = '"+id+"' OR idsender = '"+id+"') AND etat=2 AND (idreceiver = '"+idcurrent+"' OR idsender = '"+idcurrent+"')"

  

      connection.query(queryString, [id,idcurrent], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
        }

        
        if(rows.length != 0)
        {



          res.json("GOOD")

        }

        else res.json("BAD")

        res.end();

      })

})





         

 









//Add Declare FOR A FRIEND ANDROID


app.get('/adddeclareforafriend/:mailfriend/:iduserroad/:titre/:contenu/:latitude/:longitude/:stolen', function (req, res) {



  let mailfriend = req.params.mailfriend
  let iduserroad = req.params.iduserroad
  let titre = req.params.titre
  let contenu = req.params.contenu
  let latitude = req.params.latitude
  let longitude = req.params.longitude
  let stolen = req.params.stolen




  

  //CONVERT MAIL TO ID 

  
        const queryString = "SELECT id FROM userroad WHERE email = '"+mailfriend+"' "
        connection.query(queryString, [mailfriend], (err, rows, fields) => {
          if (err) {
            console.log("Failed to query for users: " + err)
           
            return
          }
  
          
          if(rows.length != 0)
          {
  
  
           receiveridtest = rows[0].id
         /*    res.json(receiveridtest)*/
  
  
         // check friend in list 

        
              const queryString2 = "SELECT idtrustedfriend FROM trustedfriend WHERE (idreceiver = '"+receiveridtest+"' OR idsender = '"+receiveridtest+"') AND etat=2 AND (idreceiver = '"+iduserroad+"' OR idsender = '"+iduserroad+"')"
        
          
        
              connection.query(queryString2, [receiveridtest,iduserroad], (err, rows, fields) => {
                if (err) {
                  console.log("Failed to query for users: " + err)
                 
                  return
                }
        
                
                if(rows.length != 0)
                {
        

                  let ts = Date.now();

  let date_ob = new Date(ts);
  let jour = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

jour2=changeTime(jour)
month2=changeTime(month)
year2=changeTime(year)
hours2=changeTime(hours)
minutes2=changeTime(minutes)
seconds2=changeTime(seconds)



let date =(jour2+"/"+month2+"/"+year2+" at "+hours2+":"+minutes2);



 

      const queryString3 = "INSERT INTO  userdeclare SET iduserroad = '"+receiveridtest+"' , titre = '"+titre+"',contenu = '"+contenu+"', latitude = '"+latitude+"', longitude = '"+longitude+"', stolen = '"+stolen+"', date = '"+date+"'   "
  

      connection.query(queryString3, [receiveridtest,titre,contenu,latitude,longitude,stolen,date], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err

        }

       res.json("good")
       res.end()
  })
        
        
               
        
                }
        
                // Friend not in list
                else res.json("BAD2")
        
                
        
              })
        
        




            
  
          }
  
            // return that mail doesnt exist
          else res.json("BAD")
  
          
  
        })
  

})












/*const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json('wrong password'); */
  



  app.get('/testhash/:psswd', function (req, res) {
    let password = req.params.psswd

    var hash = encode().value(password); 

    res.json(hash)


  })






  app.get('/testnotif', function (req, res) {



var pushyAPI = new Pushy('0cff1886cc0e31064a938d2dd218d4f2b530b5fa6c6f0d00bbe2eccef272dbad');
 
var data = {
    message: 'Hello World!'
};
 
var to = ['0650a5807ed665361f7c0b'];

var options = {
    notification: {
        badge: 1,
        sound: 'ping.aiff',
        body: 'Hello World \u270c'
    },
};

pushyAPI.sendPushNotification(data, to, options, function (err, id) {

    if (err) {
        return console.log('Fatal Error', err);
    }

    console.log('Push sent successfully! (ID: ' + id + ')');
});

    });











    
  app.get('/insertintonotif/:iduser/:key', function (req, res) {

    let iduser = req.params.iduser
    let key = req.params.key


    const queryString2 = "SELECT idpushnotif FROM pushnotif WHERE keyuser = '"+key+"'and iduser='"+iduser+"' "

    connection.query(queryString2, [iduser,key], (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for users: " + err)
       
        return
        // throw err
      }


      if (rows.length ==0)
      {


        const queryString = "INSERT INTO pushnotif (iduser,keyuser) values (?,?)"


        connection.query(queryString, [iduser,key], (err, rows, fields) => {
          if (err) {
            console.log("Failed to query for users: " + err)
           
            return
            // throw err
          }

          res.json("good")
  })

     
      }

      else 

      {
        res.json("bad")
      }



    }) 

})









//////////////////////////////////////   
///////  PUSH LAST POSITION IOS //////
////////////////////////////////////





app.get('/getlastposition/:email/:longitude/:largitude', function (req, res) {

  let longitude = req.params.longitude
  let largitude = req.params.largitude
  let email = req.params.email


  const queryString = "SELECT idlastposition FROM lastposition WHERE email = '"+email+"' "

  connection.query(queryString, [email], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
     
      return
      // throw err
    }


    if (rows.length ==0)
    {


      const queryString = "INSERT INTO lastposition (email,lastlongitude,lastlastitude) values (?,?,?)"


      connection.query(queryString, [email,longitude,largitude], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }

        res.json("good")
        })

   
    }

    else 

    {
      
      const queryString2 = "UPDATE lastposition SET lastlongitude = '"+longitude+"' , lastlastitude = '"+largitude+"'  WHERE email = '"+email+"'   "


      connection.query(queryString2, [longitude,largitude,email], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }

        res.json("good")
        })



    }



  }) 

})






//////////////////////////////////////   
//////////  PUSH NOTIF IOS //////////
////////////////////////////////////








app.get('/getlastposition/:email/:longitude/:largitude', function (req, res) {

  let longitude = req.params.longitude
  let largitude = req.params.largitude
  let email = req.params.email


  const queryString = "SELECT idlastposition FROM lastposition WHERE email = '"+email+"' "

  connection.query(queryString, [email], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
     
      return
      // throw err
    }


    if (rows.length ==0)
    {


      const queryString = "INSERT INTO lastposition (email,lastlongitude,lastlastitude) values (?,?,?)"


      connection.query(queryString, [email,longitude,largitude], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }

        res.json("good")
        })

   
    }

    else 

    {
      
      const queryString2 = "UPDATE lastposition SET lastlongitude = '"+longitude+"' , lastlastitude = '"+largitude+"'  WHERE email = '"+email+"'   "


      connection.query(queryString2, [longitude,largitude,email], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }

        res.json("good")
        })



    }



  }) 

})















//////////////////////////////////////   
///////  GET ID DEVICE IOS //////
////////////////////////////////////





app.get('/insertintonotifios/:iduser/:key', function (req, res) {

  let iduser = req.params.iduser
  let key = req.params.key


  const queryString2 = "SELECT idpushnotifios FROM pushnotifios WHERE deviceios = '"+key+"'and email='"+iduser+"' "

  connection.query(queryString2, [key,iduser], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
     
      return
      // throw err
    }


    if (rows.length ==0)
    {


      const queryString = "INSERT INTO pushnotifios (email,deviceios) values (?,?)"


      connection.query(queryString, [iduser,key], (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for users: " + err)
         
          return
          // throw err
        }

        res.json("good")
})

   
    }

    else 

    {
      res.json("bad")
    }



  }) 

})
















//////////////////////////////////////   
///////  PUSH LAST POSITION IOS //////
////////////////////////////////////






app.get('/pushnotifalert/:longitude/:latitude', function (req, res) {

  let longitude = req.params.longitude
  let latitude = req.params.latitude


  const queryString2 = "SELECT deviceios FROM pushnotifios pn JOIN lastposition lp  ON (pn.email = lp.email)   WHERE ((ABS('"+longitude+"' - lp.lastlongitude) <= 50) AND (ABS('"+latitude+"' - lp.lastlastitude) <= 50))  "

  connection.query(queryString2, [longitude,latitude], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
     
      return
      // throw err
    }





             if(rows.length != 0)
             {
                res.json("GOOD")
                for(i=0;i<rows.length;i++)
                {
                  

                      


                  var pushyAPI = new Pushy('0cff1886cc0e31064a938d2dd218d4f2b530b5fa6c6f0d00bbe2eccef272dbad');
                  var data = {
                    message: ' SOMEONE NEAR YOU IN DANGER !!!!!!!! ' 
                };
                 
                var to = [rows[i].deviceios];

                var options = {
                  notification: {
                      badge: 1,
                      sound: 'ping.aiff',
                      body: 'Hello World \u270c'
                  },
              };



              pushyAPI.sendPushNotification(data, to, options, function (err, id) {

                if (err) {
                    return console.log('Fatal Error', err);
                }
            
                console.log('Push sent successfully! (ID: ' + id + ')');
            });





                }
             }

             else 
             {
              res.json("BAD")
             }
 



  }) 

})



