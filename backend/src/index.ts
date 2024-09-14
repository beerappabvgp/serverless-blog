import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors';


// import * as dotenv from "dotenv";
// dotenv.config();

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string,
	},
  Variables: {
    userId: string,
    prisma: any,
  }
}>();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend's origin
  allowMethods: ['GET', 'POST', 'OPTIONS' , 'PUT' , 'DELETE'], // Methods allowed
  allowHeaders: ['Content-Type', 'Authorization'], // Headers allowed
  maxAge: 600, // Cache preflight response for 10 minutes
}));


// globally settting prisma client so every handler can acceess it 
app.use("*", async (c , next) => {
  c.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  c.set('prisma', prisma);
  await next();
  await prisma.$disconnect(); // Close the Prisma connection
});


app.options('*', (c) => {
  c.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Max-Age', '600'); // Cache the response for 10 minutes
  return c.text('', 204); // Respond with 204 No Content for OPTIONS
});


app.route('/api/v1/user' , userRouter)
app.route('/api/v1/blog' , blogRouter)

export default app;