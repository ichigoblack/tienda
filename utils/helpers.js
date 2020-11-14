import "firebase/firestore"
import * as firebase from "firebase"
import {firebaseApp} from "./firebas"
import {map,size,filter} from 'lodash'
//import firebase, {firestore} from "firebase/app"

const db = firebase.firestore(firebaseApp)

class Helpers {

    static async getInfoUser(uid){
        return new Promise((resolve,reject)=>{
            db.collection("users")
            .get()
            .then(function(querySnapshot) {
                user = {}
                querySnapshot.forEach(function(doc) {
                    let ob={}
                    if(doc.data().idUser==uid){
                        ob=doc.data()
                        user = ob
                    }
                });
                resolve(user)
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
                reject()
            });
        })
    }
}
module.exports= Helpers