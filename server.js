
import app from './app';
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
 console.log(`Node.js API server is listening on http://localhost:${port}/`);
});