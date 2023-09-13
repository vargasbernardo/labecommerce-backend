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

// criacao do servidor com express
const app = express();

// configuracao do middleware para json()
app.use(express.json());

// configuracao do middleware que habilita o cors
app.use(cors());

// Colocando o servidor para "escutar" a porta 3000
app.listen(3000, () => {
  console.log("servidor rodando na porta 3000");
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
