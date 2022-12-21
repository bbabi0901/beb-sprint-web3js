const express = require("express");
const Web3 = require("web3");

const app = express();
app.use(express.json());
const port = 8070;

require("dotenv").config();
const { GOERLI_URL, GOERLI_ADDRESS } = process.env;
const getWeb3 = () => {
  const web3 = new Web3(new Web3.providers.HttpProvider(GOERLI_URL));
  return web3;
};

const getGasPrice = () => {
  try {
    const gasPrice = getWeb3().eth.getGasPrice();
    return gasPrice;
  } catch (e) {
    return e;
  }
};
app.get("/api/gasprice", async (req, res) => {
  const result = await getGasPrice();
  res.send({ gasPrice: result });
});

const okStatus = { status: "1", message: "OK" };
const notOkStatus = { status: "0", message: "NOTOK", result: {} };

const getBalance = async (address, tag = "latest") => {
  try {
    okStatus["result"] = await getWeb3().eth.getBalance(address, tag);
    return okStatus;
  } catch (e) {
    // console.log(e);
    return notOkStatus;
  }
};

const getBalanceMulti = (address, tag = "latest") => {
  try {
    okStatus["result"] = address.split(",").map(async (addr) => {
      const balance = await getWeb3().eth.getBalance(addr, tag);
      return { account: addr, balance: balance };
    });
    return okStatus;
  } catch (e) {
    return notOkStatus;
  }
};
// trycatch도 반복되니까 묶어서 처리할까

const ethAccAPI = (args) => {
  const { action, address, ...kwargs } = args;
  // action이 "balance"면
  switch (action) {
    case "balance":
      return getBalance(address, kwargs["tag"]);
    case "balancemulti":
      return getBalanceMulti(address, kwargs["tag"]);
    default:
      // action이 없으면
      break;
  }
};

const ethContractAPI = (kwargs) => {};

const ethTxAPI = (kwargs) => {};

const ethBlockAPI = (kwargs) => {};

const ethAPI = (module, kwargs) => {
  switch (module) {
    case "account":
      return ethAccAPI(kwargs);
    case "contract":
      return ethContractAPI(kwargs);
    case "transaction":
      return ethTxAPI(kwargs);
    case "block":
      return ethBlockAPI(kwargs);
    default:
      return {
        status: "0",
        message: "NOTOK-Missing/Invalid module name",
        result: {},
      };
  }
};

app.get("/api", async (req, res) => {
  const { module, apikey, ...kwargs } = req.query; // module or apikey 없으면?
  const result = await ethAPI(module, kwargs);
  if (!apikey) {
    result["message"] +=
      "-Missing/Invalid API Key, rate limit of 1/5sec applied";
  }
  res.send(result);
});

app.listen(port, () => {
  console.log("Listening on port:", port);
});
