import React, { Component } from 'react';
import './App.css';
import PixelGrid from './components/pixel_grid/PixelGrid.jsx';
import Web3 from 'web3';
import Bluebird from 'bluebird';

const contract_address = '0x50df62d290ffee39e3d61e8de6d3e2d2ac5fd8b2'
const contract_abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "i",
        "type": "uint256"
      },
      {
        "name": "j",
        "type": "uint256"
      },
      {
        "name": "src",
        "type": "uint256"
      }
    ],
    "name": "claimPixel",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "i",
        "type": "uint256"
      },
      {
        "name": "j",
        "type": "uint256"
      }
    ],
    "name": "getAssignment",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  }
]

class App extends Component {
  constructor(props){
    super(props);

    const is_connected = typeof Web3.givenProvider !== 'undefined'
    const web3 = is_connected ? new Web3(Web3.givenProvider) : null
    console.log(web3)
    window.myweb3 = web3
    
    this.state = {
      is_connected,
      web3,
      contract: null,
      is_fetching_accounts: false,
      accounts: [],
      selected_account_index: 0,
      is_fetching_board: false,
      board: {}
    }
  }

  async componentDidMount(){

    const {
      is_connected,
      web3,
    } = this.state

    if (!is_connected){
      return
    }

    this.setState({
      is_fetching_accounts: true
    })

    const accounts = await web3.eth.getAccounts()

    console.log("got accounts: ", accounts)

    this.setState({
      is_fetching_accounts: false,
      accounts,
      is_fetching_board: true
    })


    const contract = new web3.eth.Contract(contract_abi, contract_address)

    console.log({contract})
    window.mycontract = contract

    const board = {}
    const pixels = []
    for (var i = 0; i < 20; i++) {
      board[i] = {}
      for (var j = 0; j < 20; j++) {
        board[i][j] = {}
        pixels.push({i, j})
      }      
    }

    await Bluebird.map(pixels, async pixel => {

      const src = await contract.methods.getAssignment(pixel.i,pixel.j).call().catch(e => {
        console.log("errored...")
        return 0        
      })
      board[pixel.i][pixel.j] = src
    })

    this.setState({
      is_fetching_board: false,
      board,
      contract
    })

  }

  async claimPixel(i, j, src) {
    const {
      contract,
    } = this.state

    console.log("inside this shit")
    await contract.methods.claimPixel(i,j, src).call().catch(e => {
      console.log("errored...", e)
      return 0        
    })
    console.log("outside this shit")
  }

  render() {
    const {
      is_connected,
      // web3,
      is_fetching_accounts,
      accounts,
      selected_account_index,
      is_fetching_board,
      board,
    } = this.state

    return (

      <div className="App">
        <header className="App-header"/>
        <p className="App-intro"/>

        {
          !is_connected ? undefined : (
            <p> 
              Account: 
              {is_fetching_accounts ? <span style={{fontStyle: 'italic'}}> Fetching accounts... </span> : undefined} 
              {!is_fetching_accounts ? <span style={{fontStyle: 'bold'}}> {accounts[selected_account_index]} </span> : undefined} 
              {!is_fetching_accounts && accounts.length > 1 ? <span> (change) </span> : undefined}
            </p>
          )
        }

        {
          is_connected  ? <PixelGrid
            board={board}
            is_loading={is_fetching_board}
            claimPixel={this.claimPixel.bind(this)}
          /> : <div>
            Please use metamask to connect to the network!
          </div>
        }

        
      </div>

    );
  }
}

export default App;
