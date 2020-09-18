const admin = require('firebase-admin');
let serviceAccount = require('./../serviceAccountKey');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://predictive-maintenance-4bb7c.firebaseio.com"
});
const db = admin.firestore();


//users doc
let userTable = db.collection('users').doc('userDetails');

async function addUser(name,email,pass){
    try{
        let arrUnion = await userTable.update({
        name: admin.firestore.FieldValue.arrayUnion(name),
        email: admin.firestore.FieldValue.arrayUnion(email),
        pass: admin.firestore.FieldValue.arrayUnion(pass)
        });
        return Promise.all([arrUnion]).then(res => {});

    }catch(err){
      console.log(err)
      return err;
    }
  }

  async function getUsers(){
        await userTable.get()
          .then(doc => {
            if (!doc.exists) {
              res = null
            } else {
              // console.log('Document data:', doc.data());
              res = doc.data()
            }
          })
          .catch(err => {
            res = err
          });
      return res
  }

  //dataset doc

let datasetTable = db.collection('dataset').doc('test');

async function addData(current,power){
    try{
        let arrUnion = await datasetTable.update({
          current: admin.firestore.FieldValue.arrayUnion(current),
          power: admin.firestore.FieldValue.arrayUnion(power)
        });
        return Promise.all([arrUnion]).then(res => {});

    }catch(err){
      console.log(err)
      return err;
    }
  }

  async function getData(){
        await datasetTable.get()
          .then(doc => {
            if (!doc.exists) {
              res = null
            } else {
              res = doc.data()
            }
          })
          .catch(err => {
            res = err
          });
      return res
  }



  module.exports = {
    addUser,
    getUsers,
    addData,
    getData
  }