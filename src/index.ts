import { TProduct, TUser, TBoughtProduct } from "./types";
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
      const specificProduct: Array<TProduct> = await db("products").whereLike(
        "name",
        `%${q}%`
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
    const [idExists]: Array<TUser> = await db("users")
      .select("id")
      .where("id", id);
    const [emailExists]: Array<TUser> = await db("users")
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
    const [idExists]: Array<TProduct> = await db("products").whereLike(
      "id",
      id
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

    const newProduct: {
      id: string;
      name: string;
      price: number;
      description: string;
      image_url: string;
    } = {
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
    const {
      idPurchase,
      idBuyer,
      products,
    }: {
      idPurchase: string;
      idBuyer: string;
      products: Array<TBoughtProduct>;
    } = req.body;
    const totalPrice: Array<number> = [];
    const [idExists]: Array<TProduct> = await db("purchases").where(
      "id",
      idPurchase
    );

    if (idExists) {
      res.statusCode = 404;
      throw new Error('"id" ja existente');
    }
    if (typeof idPurchase !== "string" || typeof idBuyer !== "string") {
      res.statusCode = 400;
      throw new Error("Tipos errados no body");
    }

    for (let i = 0; i < products.length; i++) {
      const productPrices = [];
      const [eachProduct]: Array<TProduct> = await db("products").select("price").where("id", products[i].id)
      if(!eachProduct) {
        res.statusCode = 404;
        throw new Error("Produto nao nao encontrado, checar o id do produto comprado")
      }
      productPrices.push(
        eachProduct
      );
      totalPrice.push(productPrices.flat()[0].price * products[i].quantity);
    }

    const newPurchase: { id: string; buyer: string; total_price: number } = {
      id: idPurchase,
      buyer: idBuyer,
      total_price: totalPrice.reduce((acc, currValue) => acc + currValue, 0),
    };

    await db("purchases").insert(newPurchase);

    for (let product of products) {
      const newPurchaseProduct: {
        purchase_id: string;
        product_id: string;
        quantity: number;
      } = {
        purchase_id: idPurchase,
        product_id: product.id,
        quantity: product.quantity,
      };
      await db("purchases_products").insert(newPurchaseProduct);
    }

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
    const id: string = req.params.id;
    const newName = req.body.name as string | undefined;
    const newDescription = req.body.description as string | undefined;
    const newPrice = req.body.price as number;
    const newImageUrl = req.body.imageUrl as string | undefined;

    const [product]: Array<TProduct> = await db("products").where("id", id);
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
          image_url: newImageUrl || product.imageUrl,
        });

      res.status(200).send({ message: "Item editado com sucesso" });
    }
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

// // endpoint DELETE userById

// app.delete("/users/:id", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const id = req.params.id;
//     const [accountExists] = await db('users').where('id', id);
//     if (!accountExists) {
//       res.statusCode = 400;
//       throw new Error("account nao encontrada, cheque o id");
//     }

//     await db('users').del().where('id', id)
//     res.status(201).send('Usuario deletado com sucesso')

//   } catch (error) {
//     if (error instanceof Error) {
//       res.send(error.message);
//     }
//   }
// });

// // Endpoint DELETE productById
// app.delete("/products/:id", async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const productExists = await db('products').where('id', id);
//     if (!productExists) {
//       res.statusCode = 404;
//       throw new Error("produto nao encontrado, cheque o id");
//     }

//     await db('products').del().where('id', id)
//     res.status(201).send('Produto deletado com sucesso')

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
      const id: string = req.params.id;
      const [isId]: Array<TProduct> = await db("purchases").where("id", id);

      if (!isId) {
        res.statusCode = 404;
        throw new Error("produto nao encontrado");
      }

      await db("purchases_products").del().where("purchase_id", id);
      await db("purchases").del().where("id", id);
      res.status(200).send("compra apagada com sucesso!");
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
      const id: string = req.params.id;
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
