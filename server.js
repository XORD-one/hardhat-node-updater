const http = require("http");
const pids = require("port-pid");
const { exec } = require("child_process");
const fs = require("fs");


async function updateBlockNumber(filePath, NewBlockNumber, oldBlockNumber, oldRPC, newRPC) {
	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) throw new Error(err);
		const updatedDataBlockNumber = data.replace(`blockNumber: ${oldBlockNumber}`, `blockNumber: ${NewBlockNumber}`);
		const updatedDataRPC = updatedDataBlockNumber.replace(`url: ${oldRPC}`, `url: ${newRPC}`);

		fs.writeFile(filePath, updatedDataRPC, "utf8", (err) => {
			if (err) throw new Error(err);
			console.log("Block number updated successfully.");
		});
	});
}

const server = http.createServer((req, res) => {
	if (req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", async () => {
			try {
				console.log(body, "body");

				const postData = JSON.parse(body);
				const { NewBlockNumber, oldBlockNumber, oldRPC, newRPC, port, processId } = postData;

				const { tcp } = await pids(parseInt(port));
        
        //if processId is passed, use it
        if(processId) tcp[0] = processId

				console.log(oldBlockNumber, NewBlockNumber, oldRPC, newRPC, tcp, processId, "processId", port, "port");

        //if no process found, throw error
				if (tcp.length === 0) {
					console.log(tcp);
					throw new Error("No process found");
				}

				// Step 2: Kill the first server
				process.kill(tcp[0]);
				console.log("Process killed");

				//head to the hardhat.config.js file
				const filePath = "./../hardhat-local-node/hardhat.config.js";

        ///===========================================================
				//modify blockNumbe and RPC using data.replace method
				//write file
				console.log(__dirname,"____________________");
				await updateBlockNumber(filePath, NewBlockNumber, oldBlockNumber, oldRPC, newRPC);
				
        ///===========================================================
        //start the server
        const cwd = "/home/oem/Documents/hardhat-local-node/";
        exec('npx hardhat node', { cwd }, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        });

        ///===========================================================
				//return the response
				res.end(JSON.stringify({
					message: `Server restarted successfully and node updated at block number ${NewBlockNumber}`,
					status: 200,
				}));
			} catch (error) {
				console.log(error, "error");
				res.end('error');
			}
		});
	} else {
		res.end("Not a post request");
	}
});

server.listen(3000, () => {
	console.log("Server listening on port 3000");
});
