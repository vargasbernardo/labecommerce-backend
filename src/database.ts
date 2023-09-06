import { TUser, TProduct } from "./types"

export const createUser = (id: string, name: string, email: string, password: string): string => {
    let newUser: TUser = {
        id: id,
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    }
    users.push(newUser)
    return 'Cadastro realizado com sucesso'
    
}

export const getAllUsers = (): Array<TUser> => {
    return users 
}

export const createProduct = (id: string, name: string, price: number, description: string, imageUrl: string): string => {
    let newProduct:TProduct = {
        id: id,
        name: name, 
        price: price,
        description: description,
        imageUrl: imageUrl,

    }
    products.push(newProduct);
    return 'Produto adicionado com sucesso'

}

export const getAllProducts = (): Array<TProduct> => {
    return products
}

export const searchProductByName = (name:string): Array<TProduct> => {
    return products.filter(product => product.name.toLowerCase().includes(name.toLowerCase()))
    
}


export const users: Array<TUser> = [
    {
        id: "u001",
        name: "Fulano",
        email: "fulano@gmail.com",
        password: "fulano123",
        createdAt: new Date().toISOString()
    },
    {
        id: "u002",
        name: "Beltrana",
        email: "beltrana@gmail.com",
        password: "beltrana123",
        createdAt: new Date().toISOString()
    }
]

export const products: Array<TProduct> = [
    {
        id: "prod001",
        name: "Mouse Gamer",
        price: 250,
        description: "Melhor mouse do mercado",
        imageUrl: "https://picsum.photos/seed/Mouse%20gamer/400",
    },
    {
        id: "prod002",
        name: "Monitor",
        price: 900,
        description: "Monitor LED Full HD 24 polegadas",
        imageUrl: "https://picsum.photos/seed/Monitor/400",
    }
]