const axios = require('axios');


(async () => {
  try {
   const response = await axios.post('http://localhost:3000', {
    oldBlockNumber:16619795,
    NewBlockNumber:16619800,
    oldRPC:"'https://mainnet.infura.io/v3/7f6f5921404842ba992a4d334431c6f7'",
    newRPC:"'https://mainnet.infura.io/v3/7f6f5921404842ba992a4d334431c6f7'",
    port:8545,
    hardhatProjPath: "/home/oem/Documents/hardhat-local-node/",
   })
    console.log(response.data)
  } catch (error) {
    console.log(error, 'error')
  }
})()
