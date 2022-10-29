import { Component, OnInit, ViewChild} from '@angular/core';
import { ConfigService } from '../config.service';
import { ConfigServiceV2 } from '../configV2';
import { BuyEnergyRequest } from '../classes';
import {Router} from '@angular/router';
import { SendDataService } from '../send-data.service';
import { JWTService } from '../userAuth.service';
import {map, Subscription, timer} from 'rxjs';  
import Swal from 'sweetalert2'



// imports required for the pagination
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {  energyRequests } from '../classes';

@Component({
  selector: 'app-new-market-page',
  templateUrl: './new-market-page.component.html',
  styleUrls: ['./new-market-page.component.css']
})
export class NewMarketPageComponent implements OnInit {

  constructor(private _configV2:ConfigServiceV2, private _config:ConfigService, private router: Router, private reqData: SendDataService, private _jwtServ:JWTService) { }

  
  public allOpenBuyRequests:Array<BuyEnergyRequest>=[];
  public allClosedBuyRequests:Array<BuyEnergyRequest>=[];
  public noOpenBuyRequests: boolean = true;
  public noClosedBuyRequests: boolean = true;
  private requestForBid :BuyEnergyRequest = new BuyEnergyRequest("", 0, 0, false, "","") // this will hold the buy energy request data on which the prosumer makes a bid

  public buyerId: string = ""
  public message: string = "";
  private _loggedInUserId : string = "" //id of the user that is logged in
  public timerSubscription: Subscription|any; 


  // for the pagination of closed buy requests
  closedRequestDisplayedCols: string[] = ['reqId', 'energy', 'price', 'type' ]
  closesRequestDataSource = new MatTableDataSource<energyRequests>(allClosedRequests)
    // add the paginator
    @ViewChild(MatPaginator) closedReqPaginator: MatPaginator | any




  async ngOnInit(): Promise<void> {

    // timer(0, 10000) call the function immediately and every 10 seconds 
    this.timerSubscription = timer(0, 1800*1000).pipe( 
      map(async () => { 
        console.log("This is run every 10s now")
        await this._configV2.getCMData().subscribe(async data => {
          let responseCMData = JSON.parse(JSON.stringify(data))
          console.log("CM Data", responseCMData)
          await this._configV2.runCM(responseCMData.Data).subscribe(async data=> {
            let responseCM = JSON.parse(JSON.stringify(data))
            console.log("Response after running cm", responseCM)
            let blockchain = {
              data:responseCM
            }
            await this._configV2.writeToBlockchain(blockchain).subscribe(data => {
              let blockchainResp = JSON.parse(JSON.stringify(data))
              if (blockchainResp.Success){
                Swal.fire('Round of Customer Matching complete ', '', 'success')
              }
              
            })


          })
        })
      }) 
    ).subscribe(); 



    // check if the jwt is stored in local storage or not
    if (this._jwtServ.checkToken()){
      this._jwtServ.verifyToken().subscribe(data => {
        console.log("Verified Token", data)
        let response = JSON.parse(JSON.stringify(data))
        //console.log(response.Username)
        this.getBuyRequests()
        if (data !=null){
          this._loggedInUserId = response.User.UId
          
          // subscribe to the message
          this.reqData.currentMessage.subscribe(message => this.requestForBid = message)
        }        
      })

    }
  }
// don't forget to unsubscribe when the Observable is not necessary anymore 
ngOnDestroy(): void { 
  this.timerSubscription.unsubscribe(); 
} 
  
  async getBuyRequests(){
    this._configV2.getClosedEnergyRequests().subscribe(data => {
      //console.log("Buy requests data for market page", data)
      let response = JSON.parse(JSON.stringify(data))
      console.log("Buy requests data for market page", response)
      //this.allBuyRequests = response.Requests
      let reqArr = response.Data
      allClosedRequests = []
      for(let i = 0; i < reqArr.length; i++) {
        let obj = reqArr[i]
        //console.log("All buy requests")
      

          // for closed requests
            let closedRequest:energyRequests={
              type: obj.Prosumer_or_EV,
                price: obj.UserPrice,
                energy: obj.UserEnergy,
                reqId: obj.requestId,
                bidBtn: ''
            }
            allClosedRequests.push(closedRequest)
            
            
          

          if (i==reqArr.length-1){

            // instantiate pagination list for closed requests
            this.closesRequestDataSource = new MatTableDataSource<energyRequests>(allClosedRequests)
            this.closesRequestDataSource.paginator = this.closedReqPaginator
          }

          
        
        
    }

    })
  }



}

// for the closed requests
let allClosedRequests: energyRequests[] = []