const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const canvas = require('canvas');
const querystring = require('querystring');

app.use((req, res, next) => {
	const parsedQs = querystring.parse(url.parse('https://domian.com' + req.originalUrl).query);
	req.urlParams = parsedQs;
	next();
});

app.get('/', async (req, res) => {

  const imgUrl = req.urlParams.imgUrl;

	if (!imgUrl) return res.json({
		error: true,
		message: 'Missing the imgUrl parameter'
	});


	let toLayer;
	try {
		toLayer = await canvas.loadImage(imgUrl);
	}
	catch (err) {
		return res.status(400).json({
			error: true,
			message: 'Failed to load this image'
		});
	}
  
  const flag = await canvas.loadImage('https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/255px-Flag_of_the_United_States.svg.png');

	const Canvas = canvas.createCanvas(toLayer.width, toLayer.height);
	const ctx = Canvas.getContext('2d');
	ctx.drawImage(toLayer, 0, 0, Canvas.width, Canvas.height);
	ctx.drawImage(flag, 0, 0, Canvas.width, Canvas.height);

	res.set({ 'Content-Type': 'image/png' });
	res.status(200).send(Canvas.toBuffer());
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})