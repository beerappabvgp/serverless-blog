import { signInInput, signupInput } from "@bharathbvgp/common";
import { Hono } from "hono";
import { sign, verify } from 'hono/jwt';

interface Variables {
    userId: string
    prisma: any
}

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: Variables
}>();


userRouter.post('/signup', async (c) => {
    console.log(c.env);
    console.log("c.env.DATABASE_URL" , c.env.DATABASE_URL);
    const prisma = c.get('prisma');
    
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ "error" : "invalid inputs"});
    }
    try {
      console.log("entered...");
      console.log(body);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: (body.name !== null ? body.name : null)
        },
      });
      
      console.log(user);
      
      // Sign JWT
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      console.log("jwt : ", jwt);
      
      return c.json({ jwt });
      
    } catch (error) {
      console.error(error);
      c.status(403)
      return c.json({ error: error });
    }
  });
  
  
  userRouter.post('/signin', async (c) => {
    const prisma = c.get('prisma');
    
    const body = await c.req.json();
    const { success } = signInInput.safeParse(body);
    if (!success) {
        c.status(403);
        return c.json({
            "error" : "Invalid inputs"
        });
    }
    
    // Get the user
    try {
        const user = await prisma.user.findUnique({
            where: {
              email: body.email,
              password: body.password,
            },
          });
        if (!user) {
        c.status(403);
        return c.json({ error: "User not found" });
        }
        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ jwt });
    } catch (error) {
        console.log(error);
        c.status(403);
        return c.json({
            "error" : error
        });
    }
  });
  



