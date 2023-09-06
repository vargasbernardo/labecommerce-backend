import { users, products, createUser, getAllUsers, createProduct, getAllProducts, searchProductByName } from "./database";




createUser("003", "Cicrano", "cicrano@gmail.com", "90809890")
createProduct('p003', "Televisao", 4250, '2022 Smart TV LG 70" 4K UHD 70UQ8050 WiFi Bluetooth HDR Inteligência Artificial ThinQ Smart Magic Google Alexa', 'https://www.lg.com/br/images/tv/md07556159/gallery/1-imagem-70UQ8050PSB-1100-730.jpg')


// console.table(users)
// console.log(getAllUsers())
// console.log(getAllProducts());
console.log(searchProductByName("televisao"))
