const express = require("express");
const Web3 = require("web3");

const app = express();
app.use(express.json());
const port = 8080;

{
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

  // solidity contract 작성 => remix + ganache로 testRPC에 compile and deploy => 복사해온 ABI를 사용하여 해당 컨트랙트 사용.
  const Contract = require("web3-eth-contract");

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
      const address = "0x119Ef396690397d9E4C5DAC1352Bc2AEfF535b3f";
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

  // Deploy contract with Bytecode / ABI
  const deploySimpleToken = async () => {
    try {
      const abi = [
        {
          inputs: [
            {
              internalType: "string",
              name: "getName",
              type: "string",
            },
            {
              internalType: "string",
              name: "getSymbol",
              type: "string",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "oldAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "_allowances",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];
      const byteCode =
        "60806040523480156200001157600080fd5b5060405162001ac938038062001ac9833981810160405281019062000037919062000212565b81600390805190602001906200004f929190620000e4565b50806004908051906020019062000068929190620000e4565b506012600560006101000a81548160ff021916908360ff1602179055506a52b7d2dcc80cd2e40000006002819055506002546000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050506200041b565b828054620000f2906200032c565b90600052602060002090601f01602090048101928262000116576000855562000162565b82601f106200013157805160ff191683800117855562000162565b8280016001018555821562000162579182015b828111156200016157825182559160200191906001019062000144565b5b50905062000171919062000175565b5090565b5b808211156200019057600081600090555060010162000176565b5090565b6000620001ab620001a584620002c0565b62000297565b905082815260208101848484011115620001ca57620001c9620003fb565b5b620001d7848285620002f6565b509392505050565b600082601f830112620001f757620001f6620003f6565b5b81516200020984826020860162000194565b91505092915050565b600080604083850312156200022c576200022b62000405565b5b600083015167ffffffffffffffff8111156200024d576200024c62000400565b5b6200025b85828601620001df565b925050602083015167ffffffffffffffff8111156200027f576200027e62000400565b5b6200028d85828601620001df565b9150509250929050565b6000620002a3620002b6565b9050620002b1828262000362565b919050565b6000604051905090565b600067ffffffffffffffff821115620002de57620002dd620003c7565b5b620002e9826200040a565b9050602081019050919050565b60005b8381101562000316578082015181840152602081019050620002f9565b8381111562000326576000848401525b50505050565b600060028204905060018216806200034557607f821691505b602082108114156200035c576200035b62000398565b5b50919050565b6200036d826200040a565b810181811067ffffffffffffffff821117156200038f576200038e620003c7565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b61169e806200042b6000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80633eaaf86b1161008c578063a9059cbb11610066578063a9059cbb14610263578063b09f126614610293578063d28d8852146102b1578063dd62ed3e146102cf576100ea565b80633eaaf86b146101f757806370a082311461021557806395d89b4114610245576100ea565b806318160ddd116100c857806318160ddd1461016d57806323b872dd1461018b578063313ce567146101bb57806332424aa3146101d9576100ea565b8063024c2ddd146100ef57806306fdde031461011f578063095ea7b31461013d575b600080fd5b61010960048036038101906101049190610e27565b6102ff565b60405161011691906111b5565b60405180910390f35b610127610324565b6040516101349190611093565b60405180910390f35b61015760048036038101906101529190610eba565b6103b6565b6040516101649190611078565b60405180910390f35b610175610492565b60405161018291906111b5565b60405180910390f35b6101a560048036038101906101a09190610e67565b61049c565b6040516101b29190611078565b60405180910390f35b6101c361060c565b6040516101d091906111f9565b60405180910390f35b6101e1610623565b6040516101ee91906111f9565b60405180910390f35b6101ff610636565b60405161020c91906111b5565b60405180910390f35b61022f600480360381019061022a9190610dfa565b61063c565b60405161023c91906111b5565b60405180910390f35b61024d610684565b60405161025a9190611093565b60405180910390f35b61027d60048036038101906102789190610eba565b610716565b60405161028a9190611078565b60405180910390f35b61029b610792565b6040516102a89190611093565b60405180910390f35b6102b9610820565b6040516102c69190611093565b60405180910390f35b6102e960048036038101906102e49190610e27565b6108ae565b6040516102f691906111b5565b60405180910390f35b6001602052816000526040600020602052806000526040600020600091509150505481565b60606003805461033390611342565b80601f016020809104026020016040519081016040528092919081815260200182805461035f90611342565b80156103ac5780601f10610381576101008083540402835291602001916103ac565b820191906000526020600020905b81548152906001019060200180831161038f57829003601f168201915b5050505050905090565b600080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508281101561047b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161047290611135565b60405180910390fd5b61048733858386610935565b600191505092915050565b6000600254905090565b60006104a9848484610bc1565b8273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fd1398bee19313d6bf672ccb116e51f4a1a947e91c757907f51fbb5b5e56c698f8560405161051d91906111b5565b60405180910390a46000600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050828110156105e9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105e090611155565b60405180910390fd5b61060085338386856105fb9190611286565b610935565b60019150509392505050565b6000600560009054906101000a900460ff16905090565b600560009054906101000a900460ff1681565b60025481565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461069390611342565b80601f01602080910402602001604051908101604052809291908181526020018280546106bf90611342565b801561070c5780601f106106e15761010080835404028352916020019161070c565b820191906000526020600020905b8154815290600101906020018083116106ef57829003601f168201915b5050505050905090565b6000610723338484610bc1565b8273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161078091906111b5565b60405180910390a36001905092915050565b6004805461079f90611342565b80601f01602080910402602001604051908101604052809291908181526020018280546107cb90611342565b80156108185780601f106107ed57610100808354040283529160200191610818565b820191906000526020600020905b8154815290600101906020018083116107fb57829003601f168201915b505050505081565b6003805461082d90611342565b80601f016020809104026020016040519081016040528092919081815260200182805461085990611342565b80156108a65780601f1061087b576101008083540402835291602001916108a6565b820191906000526020600020905b81548152906001019060200180831161088957829003601f168201915b505050505081565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614156109a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161099c90611195565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610a15576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a0c906110d5565b60405180910390fd5b600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548214610ad3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aca90611115565b60405180910390fd5b80600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fb3fd5071835887567a0671151121894ddccc2842f1d10bedad13e0d17cace9a78484604051610bb39291906111d0565b60405180910390a350505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610c31576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c2890611175565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610ca1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c98906110b5565b60405180910390fd5b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610d27576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d1e906110f5565b60405180910390fd5b8181610d339190611286565b6000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610dc39190611230565b9250508190555050505050565b600081359050610ddf8161163a565b92915050565b600081359050610df481611651565b92915050565b600060208284031215610e1057610e0f6113d2565b5b6000610e1e84828501610dd0565b91505092915050565b60008060408385031215610e3e57610e3d6113d2565b5b6000610e4c85828601610dd0565b9250506020610e5d85828601610dd0565b9150509250929050565b600080600060608486031215610e8057610e7f6113d2565b5b6000610e8e86828701610dd0565b9350506020610e9f86828701610dd0565b9250506040610eb086828701610de5565b9150509250925092565b60008060408385031215610ed157610ed06113d2565b5b6000610edf85828601610dd0565b9250506020610ef085828601610de5565b9150509250929050565b610f03816112cc565b82525050565b6000610f1482611214565b610f1e818561121f565b9350610f2e81856020860161130f565b610f37816113d7565b840191505092915050565b6000610f4f60238361121f565b9150610f5a826113e8565b604082019050919050565b6000610f7260228361121f565b9150610f7d82611437565b604082019050919050565b6000610f9560268361121f565b9150610fa082611486565b604082019050919050565b6000610fb8601c8361121f565b9150610fc3826114d5565b602082019050919050565b6000610fdb60288361121f565b9150610fe6826114fe565b604082019050919050565b6000610ffe60288361121f565b91506110098261154d565b604082019050919050565b600061102160258361121f565b915061102c8261159c565b604082019050919050565b600061104460248361121f565b915061104f826115eb565b604082019050919050565b611063816112f8565b82525050565b61107281611302565b82525050565b600060208201905061108d6000830184610efa565b92915050565b600060208201905081810360008301526110ad8184610f09565b905092915050565b600060208201905081810360008301526110ce81610f42565b9050919050565b600060208201905081810360008301526110ee81610f65565b9050919050565b6000602082019050818103600083015261110e81610f88565b9050919050565b6000602082019050818103600083015261112e81610fab565b9050919050565b6000602082019050818103600083015261114e81610fce565b9050919050565b6000602082019050818103600083015261116e81610ff1565b9050919050565b6000602082019050818103600083015261118e81611014565b9050919050565b600060208201905081810360008301526111ae81611037565b9050919050565b60006020820190506111ca600083018461105a565b92915050565b60006040820190506111e5600083018561105a565b6111f2602083018461105a565b9392505050565b600060208201905061120e6000830184611069565b92915050565b600081519050919050565b600082825260208201905092915050565b600061123b826112f8565b9150611246836112f8565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561127b5761127a611374565b5b828201905092915050565b6000611291826112f8565b915061129c836112f8565b9250828210156112af576112ae611374565b5b828203905092915050565b60006112c5826112d8565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b8381101561132d578082015181840152602081019050611312565b8381111561133c576000848401525b50505050565b6000600282049050600182168061135a57607f821691505b6020821081141561136e5761136d6113a3565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600080fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20696e76616c69642063757272656e74416d6f756e7400000000600082015250565b7f45524332303a205472616e7366657220616d6f756e742065786365656473206160008201527f6c6c6f77616e6365000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206160008201527f6c6c6f77616e6365000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b611643816112ba565b811461164e57600080fd5b50565b61165a816112f8565b811461166557600080fd5b5056fea26469706673582212201973dd38b80a74511dc0799b8f94e1b9aae13d4ff80cef1b403baf437148a38964736f6c63430008070033";

      Contract.setProvider("http://127.0.0.1:7545");
      const contract = new Contract(abi);
      const reciept = await contract
        .deploy({
          data: "0x" + byteCode,
          arguments: ["YoonsooTestToken", "YTT"],
        })
        .send({
          from: "0x3E06Ce8F00984e1751AC9ecC9b0C94478c7Ff2A5",
          gas: 2000000,
          gasPrice: "1000000000000",
        });
      console.log(reciept);
      return reciept;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  app.get("/deploy", (req, res) => {
    deploySimpleToken().then((result) => {
      res.send(result);
    });
  });

  const getBalance = async (address) => {
    try {
      const balance = await getWeb3().eth.getBalance(address);
      console.log(balance);
      return balance;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  app.get("/balance", async (req, res) => {
    const address = req.query.address;
    const result = await getBalance(address);
    res.send(result);
  });

  const getTokenBalance = (address) => {
    try {
      const abi = [
        {
          inputs: [
            {
              internalType: "string",
              name: "getName",
              type: "string",
            },
            {
              internalType: "string",
              name: "getSymbol",
              type: "string",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "oldAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "_allowances",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ];
      const tokenContractAddr = "0x44C19B081a7c5bE121332515D72309Ed95f9a388";
      Contract.setProvider("http://127.0.0.1:7545");
      const contract = new Contract(abi, tokenContractAddr);
      const tokenBalance = contract.methods.balanceOf(address).call();
      console.log(tokenBalance);
      return tokenBalance;
    } catch (e) {}
  };

  app.get("/tokenbalance", async (req, res) => {
    const address = req.query.address;
    const result = await getTokenBalance(address);
    res.send(result);
    // getTokenBalance(address).then((result) => {
    //   res.send(result);
    // });
  });

  const transferToken = async (amount, address) => {
    try {
      const abi = [
        {
          inputs: [
            {
              internalType: "string",
              name: "getName",
              type: "string",
            },
            {
              internalType: "string",
              name: "getSymbol",
              type: "string",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "oldAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "_allowances",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "_totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ];
      const tokenContractAddr = "0x44C19B081a7c5bE121332515D72309Ed95f9a388";
      Contract.setProvider("http://127.0.0.1:7545");
      const contract = new Contract(abi, tokenContractAddr);
      const result = contract.methods.transfer(address, amount).send({
        from: "0x3E06Ce8F00984e1751AC9ecC9b0C94478c7Ff2A5",
      });
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  app.post("/tokentransfer", async (req, res) => {
    const { amount, address } = req.body;
    const result = await transferToken(amount, address);
    res.send(result);
  });
}

// helloWorld contract on goerli network after delopying using remix
require("dotenv").config();
const { GOERLI_URL } = process.env;
const helloWorldGoerli = async () => {
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
    const address = "0x76a7e84f985c8b9ddbb053ef8cdfccf1315b10d1";
    Contract.setProvider(GOERLI_URL);
    const contract = new Contract(abi, address);
    const result = await contract.methods.renderHelloWorld().call();
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
};

app.get("/helloworldgoerli", async (req, res) => {
  const result = await helloWorldGoerli();
  res.send(result);
});

// publish and verify => solc or remix-local로 compile contract => get bytecode / abi
// const axios = require("axios");

const deployGoerli = async () => {
  try {
    const abi = [
      {
        inputs: [
          { internalType: "string", name: "getName", type: "string" },
          { internalType: "string", name: "getSymbol", type: "string" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "oldAmount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "address", name: "", type: "address" },
        ],
        name: "_allowances",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "_decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "_name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "_symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "_totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const byteCode =
      "60806040523480156200001157600080fd5b5060405162000daa38038062000daa833981016040819052620000349162000155565b60036200004283826200024e565b5060046200005182826200024e565b50506005805460ff19166012179055506a52b7d2dcc80cd2e40000006002819055336000908152602081905260409020556200031a565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620000b057600080fd5b81516001600160401b0380821115620000cd57620000cd62000088565b604051601f8301601f19908116603f01168101908282118183101715620000f857620000f862000088565b816040528381526020925086838588010111156200011557600080fd5b600091505b838210156200013957858201830151818301840152908201906200011a565b838211156200014b5760008385830101525b9695505050505050565b600080604083850312156200016957600080fd5b82516001600160401b03808211156200018157600080fd5b6200018f868387016200009e565b93506020850151915080821115620001a657600080fd5b50620001b5858286016200009e565b9150509250929050565b600181811c90821680620001d457607f821691505b602082108103620001f557634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200024957600081815260208120601f850160051c81016020861015620002245750805b601f850160051c820191505b81811015620002455782815560010162000230565b5050505b505050565b81516001600160401b038111156200026a576200026a62000088565b62000282816200027b8454620001bf565b84620001fb565b602080601f831160018114620002ba5760008415620002a15750858301515b600019600386901b1c1916600185901b17855562000245565b600085815260208120601f198616915b82811015620002eb57888601518255948401946001909101908401620002ca565b50858210156200030a5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b610a80806200032a6000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80633eaaf86b1161008c578063a9059cbb11610066578063a9059cbb146101e0578063b09f1266146101f3578063d28d8852146101fb578063dd62ed3e1461020357600080fd5b80633eaaf86b146101a657806370a08231146101af57806395d89b41146101d857600080fd5b806318160ddd116100c857806318160ddd1461016557806323b872dd1461016d578063313ce5671461018057806332424aa31461019957600080fd5b8063024c2ddd146100ef57806306fdde031461012d578063095ea7b314610142575b600080fd5b61011a6100fd3660046108bb565b600160209081526000928352604080842090915290825290205481565b6040519081526020015b60405180910390f35b61013561023c565b60405161012491906108ee565b610155610150366004610943565b6102ce565b6040519015158152602001610124565b60025461011a565b61015561017b36600461096d565b61036e565b60055460ff165b60405160ff9091168152602001610124565b6005546101879060ff1681565b61011a60025481565b61011a6101bd3660046109a9565b6001600160a01b031660009081526020819052604090205490565b610135610477565b6101556101ee366004610943565b610486565b6101356104dc565b61013561056a565b61011a6102113660046108bb565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b60606003805461024b906109cb565b80601f0160208091040260200160405190810160405280929190818152602001828054610277906109cb565b80156102c45780601f10610299576101008083540402835291602001916102c4565b820191906000526020600020905b8154815290600101906020018083116102a757829003601f168201915b5050505050905090565b3360009081526001602090815260408083206001600160a01b0386168452909152812054828110156103585760405162461bcd60e51b815260206004820152602860248201527f45524332303a205472616e7366657220616d6f756e74206578636565647320616044820152676c6c6f77616e636560c01b60648201526084015b60405180910390fd5b61036433858386610577565b5060019392505050565b600061037b848484610716565b826001600160a01b0316846001600160a01b0316336001600160a01b03167fd1398bee19313d6bf672ccb116e51f4a1a947e91c757907f51fbb5b5e56c698f856040516103ca91815260200190565b60405180910390a46001600160a01b0384166000908152600160209081526040808320338452909152902054828110156104575760405162461bcd60e51b815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e74206578636565647320616044820152676c6c6f77616e636560c01b606482015260840161034f565b61046c8533836104678782610a1b565b610577565b506001949350505050565b60606004805461024b906109cb565b6000610493338484610716565b6040518281526001600160a01b0384169033907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a350600192915050565b600480546104e9906109cb565b80601f0160208091040260200160405190810160405280929190818152602001828054610515906109cb565b80156105625780601f1061053757610100808354040283529160200191610562565b820191906000526020600020905b81548152906001019060200180831161054557829003601f168201915b505050505081565b600380546104e9906109cb565b6001600160a01b0384166105d95760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b606482015260840161034f565b6001600160a01b03831661063a5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b606482015260840161034f565b6001600160a01b0380851660009081526001602090815260408083209387168352929052205482146106ae5760405162461bcd60e51b815260206004820152601c60248201527f45524332303a20696e76616c69642063757272656e74416d6f756e7400000000604482015260640161034f565b6001600160a01b0384811660008181526001602090815260408083209488168084529482529182902085905581518681529081018590527fb3fd5071835887567a0671151121894ddccc2842f1d10bedad13e0d17cace9a7910160405180910390a350505050565b6001600160a01b03831661077a5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b606482015260840161034f565b6001600160a01b0382166107dc5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b606482015260840161034f565b6001600160a01b038316600090815260208190526040902054818110156108545760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b606482015260840161034f565b61085e8282610a1b565b6001600160a01b038086166000908152602081905260408082209390935590851681529081208054849290610894908490610a32565b909155505050505050565b80356001600160a01b03811681146108b657600080fd5b919050565b600080604083850312156108ce57600080fd5b6108d78361089f565b91506108e56020840161089f565b90509250929050565b600060208083528351808285015260005b8181101561091b578581018301518582016040015282016108ff565b8181111561092d576000604083870101525b50601f01601f1916929092016040019392505050565b6000806040838503121561095657600080fd5b61095f8361089f565b946020939093013593505050565b60008060006060848603121561098257600080fd5b61098b8461089f565b92506109996020850161089f565b9150604084013590509250925092565b6000602082840312156109bb57600080fd5b6109c48261089f565b9392505050565b600181811c908216806109df57607f821691505b6020821081036109ff57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b600082821015610a2d57610a2d610a05565b500390565b60008219821115610a4557610a45610a05565b50019056fea2646970667358221220bd07cac5e11e6831c1b12d80936309473961ca212b9e3a2a44b02354dca1a92464736f6c634300080f0033";
    Contract.setProvider(GOERLI_URL);
    const contract = new Contract(abi);
    const reciept = await contract
      .deploy({
        data: "0x" + byteCode,
        arguments: ["YoonsooTestToken", "YTT"],
      })
      .send({
        from: "0x279e774b2Fc2E9e995d2Cbadba1eC618Cba8d647",
        gas: 2000000,
        gasPrice: "1000000000000",
      });
    console.log(reciept);
    //   (err, transactionHash) => {
    //     console.info("transactionHash", transactionHash);
    //   }
    // )
    // .on("error", (error) => {
    //   console.info("error", error);
    // })
    // .on("transactionHash", (transactionHash) => {
    //   console.info("transactionHash", transactionHash);
    // })
    // .on("confirmation", (confirmation) => {
    //   console.info("confirmation", confirmation);
    // })
    // .then((newContractInstance) => {
    //   console.info("newContractInstance", newContractInstance);
    // }
    // jQuery를 통해 AJAX 사용
    // $.ajax({
    //   url: "//api.etherscan.io/api",
    //   type: "POST",
    //   data:""
    // });
    return reciept;
  } catch (e) {
    console.log(e);
    return e;
  }
};

app.get("/deploygoerli", (req, res) => {
  deployGoerli().then((result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log("Listening...");
});
