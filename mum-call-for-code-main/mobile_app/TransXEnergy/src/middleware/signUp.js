// we make the http requests to access the backend from this file

// to hold the outputs from the functions
import { useState } from "react"
const serverURL = "http://192.168.100.13:8989/"
const authRequest = "Auth/"
const signUpRequest = serverURL + authRequest + "SignUp"

// api call to sign up user
async function userSignUp(data){
    console.log("arg", data)
    try{
        console.log(signUpRequest)
       
        console.log("Data to send to backend", data)
        return await fetch(signUpRequest,
            {
                method:'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(data)
            })

            .then(async (response) => await response.json())
            .then(async (json) => {
                //console.log("here", json)
                console.log("Here are the results",json)
                return json
              
            })
            .catch((error) => {
              console.error(error);
            });
           
        
    }catch(error){
        console.log("Error")
        console.log(error)
    }

}


module.exports = {userSignUp}