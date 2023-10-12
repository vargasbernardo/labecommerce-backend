// import {
//   users,
//   products,
//   createUser,
//   getAllUsers,
//   createProduct,
//   getAllProducts,
//   searchProductByName,
// } from "./database";
import { TProduct, TUser } from "./types";
import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/knex";

// criacao do servidor com express
const app = express();

// configuracao do middleware para json()
app.use(express.json());

// configuracao do middleware que habilita o cors
app.use(cors());

// Colocando o servidor para "escutar" a porta 3003
app.listen(3003, () => {
  console.log("servidor rodando na porta 3003");
});

// endpoint teste
app.get("/ping", (req: Request, res: Response): void => {
  res.status(200).send("Pong!");
});

// Endpoint getAllUsers
app.get("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const result: Array<TUser> = await db.raw(`SELECT * FROM users`);

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

// Endpoint getAllProducts
app.get("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const result: Array<TProduct> = await db.raw(`SELECT * FROM products`);
    const q = req.query.name as string;

    if (q === undefined) {
      res.status(200).send(result);
    } else if (q.length < 2) {
      res.statusCode = 400;
      throw new Error("query nao pode ser menor que 2 caracteres");
    } else {
      const specificProduct = await db.raw(
        `SELECT * FROM products WHERE name LIKE "%${q}%"`
      );
      res.status(200).send(specificProduct);
    }
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// Endpoint POST createUser
app.post("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      id,
      name,
      email,
      password,
    }: { id: string; name: string; email: string; password: string } = req.body;
    const [idExists] = await db.raw(`SELECT id FROM users WHERE id = "${id}"`);
    const [emailExists] = await db.raw(
      `SELECT email FROM users WHERE email = "${email}"`
    );
    if (idExists || emailExists) {
      res.statusCode = 400;
      throw new Error('"id" ou "email" ja cadastrado');
    }
    if (!name || !email || !password || !email || !id) {
      res.statusCode = 400;
      throw new Error(
        'os campos "name", "email", "password" e "id" sao obrigatorios'
      );
    }
    if (
      typeof id !== "string" ||
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.statusCode = 400;
      throw new Error(
        '"id", "email", "name" e "password" precisam ser strings'
      );
    }
    if (!email.includes("@")) {
      res.statusCode = 400;
      throw new Error("Por favor, insira um email valido");
    }

    await db.raw(
      `INSERT INTO users (id, name, email, password) VALUES("${id}", "${name}", "${email}", "${password}")`
    );

    res.status(201).send("Cadastro realizado com sucesso!");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// // Endpoint POST createProduct
app.post("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      id,
      name,
      price,
      description,
      imageUrl,
    }: {
      id: string;
      name: string;
      price: number;
      description: string;
      imageUrl: string;
    } = req.body;
    const [idExists] = await db.raw(
      `SELECT * FROM products WHERE id = "${id}"`
    );
    if (idExists) {
      res.statusCode = 400;
      throw new Error('"id" ja existente');
    }
    if (
      typeof id !== "string" ||
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof imageUrl !== "string"
    ) {
      res.statusCode = 404;
      throw new Error(
        '"id", "name", "description" e "imageUrl" precisam ser strings'
      );
    }
    if (typeof price !== "number") {
      res.statusCode = 400;
      throw new Error('"price" precisa ser um number');
    }

    await db.raw(
      `INSERT INTO products VALUES ("${id}", "${name}", ${price}, "${description}", "${imageUrl}")`
    );

    res.status(201).send("Produto cadastrado com sucesso!");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// endpoint POST create purchase
app.post('/purchases', async (req: Request, res: Response): Promise<void> => {
  try {
    const {id, buyer, totalPrice } = req.body
    
    const [idExists] = await db.raw(`SELECT * FROM purchases WHERE id = "${id}"`)
    console.log(idExists)
    if(idExists) {
      res.statusCode = 404
      throw new Error('"id" ja existente')
    }
    if(typeof id !== 'string' || typeof buyer !== 'string' || typeof totalPrice !== 'number') {
      res.statusCode = 400
      throw new Error('Tipos errados no body')
    }

    await db.raw(`INSERT INTO purchases (id, buyer, total_price) VALUES ("${id}", "${buyer}", ${totalPrice})`)
    // await db.raw(`INSERT INTO purchases_products VALUES ("${id}", "${}")`)

    res.status(200).send('Compra cadastrada com sucesso')

  } catch (error) {
    if (req.statusCode === 200) {
      res.status(500)
  }

  if (error instanceof Error) {
      res.send(error.message)
  } else {
      res.send("Erro inesperado")
  }
  }
})

// // Endpoint PUT editProductById
app.put("/products/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const newName = req.body.name as string | undefined;
    const newDescription = req.body.description as string | undefined;
    const newPrice = req.body.price as number;
    const newImageUrl = req.body.imageUrl as string | undefined;

    const [product] = await db.raw(`SELECT * FROM products WHERE id = "${id}"`);
    console.log(id);
    console.log(product);
    if (!product) {
      res.statusCode = 404;
      throw new Error("Producto nao encontrado, cheque o id");
    }

    if (product) {
      await db.raw(
        `UPDATE products SET name = "${newName || product.name}", price = ${
          newPrice || product.price
        }, description = "${
          newDescription || product.description
        }", image_url = "${
          newImageUrl || product.imageUrl
        }" WHERE id = "${id}" `
      );

      res.status(200).send({ message: "Item editado com sucesso" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// // endpoint DELETE userById

// app.delete("/users/:id", async (req: Request, res: Response): => {
//   try {
//     const id = req.params.id;
//     const accountExists = users.find((user) => user.id === id);
//     if (!accountExists) {
//       res.statusCode = 400;
//       throw new Error("account nao encontrada, cheque o id");
//     }
//     const indexToDelete = users.findIndex((user) => user.id === id);
//     if (indexToDelete >= 0) {
//       users.splice(indexToDelete, 1);
//       return res.status(200).send("User apagado com sucesso!");
//     } else {
//       return res.status(404).send("User nao encontrado");
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       res.send(error.message);
//     }
//   }
// });

// // Endpoint DELETE productById
// app.delete("/products/:id", (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const result = products.findIndex((product) => product.id === id);
//     const productExists = products.find((product) => product.id === id);
//     if (!productExists) {
//       res.statusCode = 400;
//       throw new Error("produto nao encontrado, cheque o id");
//     }

//     if (result >= 0) {
//       products.splice(result, 1);
//       return res.status(200).send("Product apagado com sucesso!");
//     } else {
//       return res.status(404).send("Product nao encontrado");
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       res.send(error.message);
//     }
//   }
// });

// endpoint delete purchase by id
app.delete('/purchases/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id
    const [isId] = await db.raw(`SELECT * FROM purchases WHERE id = "${id}"`)
  
    if(!isId) {
      res.statusCode = 404
      throw new Error("produto nao encontrado")
    }

    await db.raw(`DELETE FROM purchases WHERE id = "${id}"`)
    res.status(200).send("Product apagado com sucesso!")
    
  } catch (error) {
    if (req.statusCode === 200) {
      res.status(500)
  }

  if (error instanceof Error) {
      res.send(error.message)
  } else {
      res.send("Erro inesperado")
  }
  }
})
