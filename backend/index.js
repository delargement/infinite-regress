// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors')
const app = express()
app.use(express.json());
app.use(cors())
const port = 3000

async function callpython(args,res) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python3',["citation-graph.py", args[0], 3, 5,6],{cwd:"infinite-regress-backend/citation-graph"});
	let chunk = ''
	pythonProcess.stdout.on('err', (err) => {
		console.log(err);
	})
	pythonProcess.stdout.on('data', (data) => {
		chunk += data.toString();
	});
	pythonProcess.on('close', (code) => {
		console.log(chunk)
		chunk = chunk.replace(/'/g,'"');
		console.log(`child process exited with code ${code}`);
		res.json({
			'Access-Control-Allow-Origin': '*',
			graph: JSON.parse(chunk),
		});
	});
}

app.get('/', async (req, res) => {
	res.send('Hello World!')
	console.log(req.body)
})
app.post('/api',async (req,res) => {
	console.log(req.body)
	if (!req.body.args) {
		res.send('No args')
		return
	}
	await callpython(req.body.args,res)
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)

})
