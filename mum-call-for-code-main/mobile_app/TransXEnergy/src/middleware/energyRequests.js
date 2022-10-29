/**
 * First add all the buy energy requests in the db
 * Then retrieve all of them every 30 mins (for unseen ones) and run for Customer Matching
 */
// to hold the outputs from the functions
import { useState } from "react"
const serverURL = "http://192.168.100.13:8989/"
const energyRequest = "EnergyRequest/"
const smartHomeEnRequest = serverURL + energyRequest + 'AddSHEnergyRequest'
const bidRequest = serverURL + energyRequest + 'Bid'


async function createEnergyRequest(data){
    
    try{
       
        console.log("Data to send to backend", data)
        return await fetch(smartHomeEnRequest,
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


async function createBid(data){
    
    try{
       
        console.log("Data to send to backend", data)
        return await fetch(bidRequest,
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




module.exports = {createEnergyRequest, createBid}