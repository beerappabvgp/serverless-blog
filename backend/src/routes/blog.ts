import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createPostInput, updatePostInput } from "@bharathbvgp/common";

interface Variables {
  userId: string;
}

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: Variables;
}>();

blogRouter.use("*", async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  const token = jwt.split(" ")[1];
  const payload = await verify(token, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  c.set("userId", payload.id as string);
  await next();
});

blogRouter.get("/bulk", async (c) => {
  console.log("Handling GET /bulk");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  
  if (!userId) {
    // Return an error if userId is not provided
    return c.json({ error: "User ID is required" }, { status: 400 });
  }
  const posts = await prisma.post.findMany({
    where: { authorId: userId }
  });
  console.log(posts);
  return c.json({ posts });
});

blogRouter.get("/:id", async (c) => {
  console.log("/:id route");
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blog = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });
  console.log(blog);
  return c.json({
    blog: blog,
  });
});

blogRouter.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);
  if (!success) {
    c.json(403);
    return c.json({
      error: "Invalid Inputs",
    });
  }
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });
    console.log(blog);
    return c.json({
      id: blog.id,
    });
  } catch (error) {
    console.log(error);
    c.status(403);
    c.json({
      error: error,
    });
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  const body = await c.req.json();
  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.json(403);
    return c.json({
      error: "Invalid Inputs",
    });
  }
  try {
    const updatedBlog = await prisma.post.update({
      where: {
        id: body.id,
        authorId: userId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    console.log(updatedBlog);
    return c.json({
      message: "updated post",
    });
  } catch (error) {
    console.log(error);
    c.status(403);
    c.json({
      error: error,
    });
  }
});
