// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express')
const app = express()
app.use(express.json());
const port = 3000

async function callpython(args,res) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python3',["infinite-regress-backend/test.py"]);
	let chunk = ''
	return pythonProcess.stdout.on('data', (data) => {
		console.log('fweihfw')
		chunk = data.toString();
		console.log(chunk);
		res.send(chunk);
	});
}

app.get('/', async (req, res) => {
	res.send('Hello World!')
	console.log(req.body)
})
app.get('/q',async (req,res) => {
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
