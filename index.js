import { ethers} from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

// const { ethers } = require("ethers");

// import {hello} from "./ethers-5"
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick  = connect;
withdrawButton.onclick  = withdraw;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
console.log(ethers)
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({ method: "eth_requestAccounts" });
        connectButton.innerHTML = "Connected";
        console.log("connected");
        console.log(await ethers.version);
    } else {
        connectButton.innerHTML = "Please connect!";
        console.log("no metamask");
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}`);
    if (typeof window.ethereum !== "undefined") {
        // provider
        // signer/wallet
        // contract we are interacting with. (its ABI and address)

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
        const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
        //wait for tx to finish
        await listenForTransactionMine(transactionResponse, provider)
    }catch(error){
            console.log("there is an error")
        }

    }
}


function listenForTransactionMine(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}...`)
    // listen for tx to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        })
        
    })
    
}

async function getBalance(){
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const signer = await provider.getSigner()
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw(){
    if(window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try{
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        }catch(error){
            console.log(error)
        }
    }
}