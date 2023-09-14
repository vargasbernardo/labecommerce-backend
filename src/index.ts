import {
  users,
  products,
  createUser,
  getAllUsers,
  createProduct,
  getAllProducts,
  searchProductByName,
} from "./database";
import { TProduct, TUser } from "./types";
import express, { Request, Response } from "express";
import cors from "cors";
import { log } from "console";

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
app.get("/users", (req: Request, res: Response): void => {
  const result: Array<TUser> = getAllUsers();

  res.status(200).send(result);
});

// Endpoint getAllProducts
app.get("/products", (req: Request, res: Response): void => {
  const result: Array<TProduct> = getAllProducts();
  const q = req.query.name as string;

  if (q === undefined) {
    res.status(200).send(result);
  } else {
    res.status(200).send(searchProductByName(q));
  }
});

// Endpoint POST createUser
app.post("/users", (req: Request, res: Response): void => {
  const {
    id,
    name,
    email,
    password,
  }: { id: string; name: string; email: string; password: string } = req.body;

  createUser(id, name, email, password);

  res.status(201).send("Cadastro realizado com sucesso!");
});

// Endpoint POST createProduct
app.post("/products", (req: Request, res: Response): void => {
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

  createProduct(id, name, price, description, imageUrl);

  res.status(201).send("Produto cadastrado com sucesso!");
});

// Endpoint PUT editProductById
app.put("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const newName = req.body.name as string | undefined;
  const newDescription = req.body.description as string | undefined;
  const newPrice = req.body.price as number;
  const newImageUrl = req.body.imageUrl as string | undefined;

  const product = products.find((product) => product.id === id);

  if (product) {
    product.name = newName || product.name;
    product.price = isNaN(newPrice) ? product.price : newPrice;
    product.description = newDescription || product.description;
    product.imageUrl = newImageUrl || product.imageUrl;

    res.status(200).send({ message: "Item editado com sucesso" });
  } else {
    res.status(404).send({ message: "item nao encontrado" });
  }
});

// endpoint DELETE userById
app.delete("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const indexToDelete = users.findIndex((user) => user.id === id);
  if (indexToDelete >= 0) {
    users.splice(indexToDelete, 1);
    return res.status(200).send("User apagado com sucesso!");
  } else {
    return res.status(404).send("User nao encontrado");
  }
});

// Endpoint DELETE productById
app.delete("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const result = products.findIndex((product) => product.id === id);

  if (result >= 0) {
    products.splice(result, 1);
    return res.status(200).send("Product apagado com sucesso!");
  } else {
    return res.status(404).send("Product nao encontrado");
  }
});
