const express = require("express");
const Web3 = require("web3");

const app = express();
const port = 8080;

const Contract = require("web3-eth-contract");

const getWeb3 = () => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:7545")
  );
  return web3;
};

const getAccounts = async () => {
  try {
    const accounts = await getWeb3().eth.getAccounts();
    console.log(accounts);
    return accounts;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getGasPrice = async () => {
  try {
    const gasPrice = await getWeb3().eth.getGasPrice();
    console.log(gasPrice);
    return gasPrice;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getBlock = async () => {
  try {
    const getBlock = await getWeb3().eth.getBlock("latest");
    console.log(getBlock);
    return getBlock;
  } catch (e) {
    console.log(e);
    return e;
  }
};

app.get("/", (req, res) => {
  getAccounts().then((accounts) => {
    res.send(accounts);
  });
});

app.get("/gasprice", (req, res) => {
  getGasPrice().then((gp) => {
    res.send(gp);
  });
});

app.get("/getblock", (req, res) => {
  getBlock().then((getBlock) => {
    res.send(getBlock);
  });
});

// solidity contract 작성 => remix + ganache로 testRPC에 compile and deploy => ABI를 사용하여 해당 컨트랙트 사용.
const helloWorld = async () => {
  try {
    const abi = [
      {
        inputs: [],
        name: "renderHelloWorld",
        outputs: [
          {
            internalType: "string",
            name: "greeting",
            type: "string",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
    ];
    // constract address
    const address = "0x36CAc150ADA85add31c2348dA38e016981B4238b";
    Contract.setProvider("http://127.0.0.1:7545");
    const contract = new Contract(abi, address);
    const result = await contract.methods.renderHelloWorld().call();
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
};

app.get("/helloworld", (req, res) => {
  helloWorld().then((result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log("Listening...");
});
