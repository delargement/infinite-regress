// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

async function callpython(args) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python3',["infinite-regress-backend/clustering.py", ...args]);
	let chunk = ''
	pythonProcess.stdout.on('data', (data) => {
		chunk += data.toString()
	});
	pythonProcess.stdout.on('exit', () => {
		console.log(chunk)
		return chunk
	});
}

app.get('/', async (req, res) => {
	res.send('Hello World!')
	console.log(req.body)
})
app.get('/q',async (req,res)=>{
	console.log(req.body)
	if (!req.body.args) {
		res.send('No args')
		return
	}
	const ans = await callpython(req.body.args)
	res.send(ans)
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)

})
