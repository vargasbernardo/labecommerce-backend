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
    const result: Array<TUser> = await db("users");

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

// Endpoint getAllProducts
app.get("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const result: Array<TProduct> = await db("products");
    const q = req.query.name as string;

    if (q === undefined) {
      res.status(200).send(result);
    } else if (q.length < 2) {
      res.statusCode = 400;
      throw new Error("query nao pode ser menor que 2 caracteres");
    } else {
      const specificProduct = await db("products").whereLike("name", `%${q}%`);
     

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
    const [idExists] = await db("users").select("id").where("id", id);
    const [emailExists] = await db("users")
      .select("email")
      .where("email", email);
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

    const newUser = {
      id,
      name,
      email,
      password,
    };

    await db("users").insert(newUser);

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
    const [idExists] = await db("products").whereLike("id", id);
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

    const newProduct = {
      id,
      name,
      price,
      description,
      image_url: imageUrl,
    };

    await db("products").insert(newProduct);

    res.status(201).send("Produto cadastrado com sucesso!");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// endpoint POST create purchase
app.post("/purchases", async (req: Request, res: Response): Promise<void> => {
  try {
    const { idPurchase, idBuyer, idProduct, quantity, totalPrice } = req.body;

    // const [idExists] = await db('purchases').where('id', idPurchase);
    // console.log(idExists);
    // if (idExists) {
    //   res.statusCode = 404;
    //   throw new Error('"id" ja existente');
    // }
    if (typeof idPurchase !== "string" || typeof idBuyer !== "string") {
      res.statusCode = 400;
      throw new Error("Tipos errados no body");
    }
    const newPurchase = {
      id: idPurchase,
      buyer: idBuyer,
      total_price: totalPrice,
    };
    const newPurchaseProduct = {
      purchase_id: idPurchase,
      product_id: idProduct,
      quantity,
    };

    await db("purchases").insert(newPurchase);

    // .raw(
    //   `INSERT INTO purchases (id, buyer, total_price) VALUES ("${idPurchase}", "${idBuyer}", ${totalPrice})`
    // );
    await db("purchases_products").insert(newPurchaseProduct);

    // .raw(`INSERT INTO purchases_products VALUES ("${idPurchase}", "${idProduct}", ${quantity})`)

    res.status(200).send("Compra cadastrada com sucesso");
  } catch (error) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// // Endpoint PUT editProductById
app.put("/products/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const newName = req.body.name as string | undefined;
    const newDescription = req.body.description as string | undefined;
    const newPrice = req.body.price as number;
    const newImageUrl = req.body.imageUrl as string | undefined;

    const [product] = await db("products").where("id", id);
    if (!product) {
      res.statusCode = 404;
      throw new Error("Producto nao encontrado, cheque o id");
    }

    if (product) {
      await db("products")
        .where("id", id)
        .update({
          name: newName || product.name,
          price: newPrice || product.price,
          description: newDescription || product.description,
          image_url: newImageUrl || product.image_url,
        })

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
app.delete(
  "/purchases/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const [isId] = await db('purchases').where('id', id);

      if (!isId) {
        res.statusCode = 404;
        throw new Error("produto nao encontrado");
      }

      await db('purchases').where('id', id).del();
      res.status(200).send("Product apagado com sucesso!");
    } catch (error) {
      if (req.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  }
);

// endpoint getPurchases
app.get("/purchases", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db("purchases");
    res.status(200).send(result);
  } catch (error) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// endpoint getPurchaseById
app.get(
  "/purchases/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const [isId] = await db("purchases").select("id").where("id", id);

      if (!isId) {
        res.statusCode = 404;
        throw new Error("Compra nao encontrada, favor checar o ID");
      }

      // const result = await db("purchases").where("id", id);
      const [result] = await db
        .select(
          "purchases.id AS purchaseId",
          "purchases.buyer AS buyerId",
          "users.name AS buyerName",
          "users.email AS buyerEmail",
          "purchases.total_price AS totalPrice",
          "purchases.created_at AS createdAt"
        )
        .from("purchases")
        .innerJoin("users", "users.id", "=", "purchases.buyer")
        .where({ "purchases.id": id });

      const productsResult = await db("purchases_products AS pp")
        .select(
          "p.id",
          "p.name",
          "p.price",
          "p.description",
          "p.image_url",
          "pp.quantity"
        )
        .innerJoin("products AS p", "p.id", "=", "pp.product_id")
        .where("pp.purchase_id", id);

      const finalResult = { ...result, products: productsResult };

      res.status(200).send(finalResult);
    } catch (error) {
      if (req.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  }
);
