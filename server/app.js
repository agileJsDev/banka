import express from 'express';

const app = express();

app.get('/', (req, res) => res.status(200).json({
  status: res.statusCode,
  data: 'Welcome to Banka Default'
}));

const port = process.env.PORT || 9000;
app.listen(port, console.log('Server running...!!!'));

export default app;
