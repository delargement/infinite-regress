// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

async function callpython(args) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python',["infinite-regress-backend/clustering.py", ...args]);
	pythonProcess.stdout.on('data', (data) => {
		return data.toString();
	});
}

app.get('/', async (req, res) => {
	res.send('Hello World!')
	console.log(req.body)
})
app.get('/q',async (req,res)=>{
	console.log(req)
	if (!req.body.args) return
	const ans = await callpython(req.body.args)
	res.send(ans)
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)

})
