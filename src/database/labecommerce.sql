-- Active: 1695743127152@@127.0.0.1@3306

-- Criacao da tabela de usuarios

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT(DATETIME()) NOT NULL
    );

-- Populando a tabela de usuarios

INSERT INTO
    users (id, name, email, password)
VALUES (
        'u001',
        'Fulano',
        'fulano@gmail.com',
        '12345678'
    ), (
        'u002',
        'Ciclana',
        'ciclana@gmail.com',
        '22345132'
    ), (
        'u003',
        'Beltrano',
        'beltra@gmail.com',
        '0987uh62'
    );

-- ver a tabela

SELECT * from users 

-- Deletar tabela de users

DROP TABLE users;

-- Criacao da tabela de produtos

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

-- Populando tabela de produtos

INSERT INTO products
VALUES (
        'p001',
        'Headset Gamer HyperX Cloud Stinger Core',
        179.90,
        'É um headset feito exclusivamente para proporcionar mais qualidade no som em consoles como o PS4, Xbox One e Nintendo Switch. O utensílio também vem com um controle ajustável de aço no arco da cabeça e fones de ouvido macios e um microfone flexível e giratório que te permite posicionar o microfone onde quiser.',
        'https://m.media-amazon.com/images/I/71vhzgcnD+L._AC_SX466_.jpg'
    ), (
        'p002',
        'Razer Mouse DeathAdder',
        139.26,
        'O Razer DeathAdder essencial mantém a forma ergonômica clássica que foi uma marca registrada das gerações anteriores do Razer DeathAdder. Seu corpo elegante e distinto é projetado para conforto, permitindo que você mantenha altos níveis de desempenho durante longas maratonas de jogos, para que você nunca caia no calor da batalha.',
        'https://m.media-amazon.com/images/I/51xLy45CSfL._AC_SY450_.jpg'
    ), (
        'p003',
        'Teclado Mecânico Gamer Logitech G PRO',
        599.99,
        'Construído com e para atletas de eSports para oferecer desempenho, velocidade e precisão em nível de competição, o teclado mecânico para jogos Logitech G PRO vem em um design compacto tenkeyless que libera espaço na mesa para o mouse de baixa sensibilidade.',
        'https://m.media-amazon.com/images/I/51HaCM8wFcL._AC_SY450_.jpg'
    ), (
        'p004',
        'Cadeira Gamer MX5',
        969.00,
        ' nova linha de Cadeira Gamer Mymax, são as mais iradas do mercado, a MX5 possui design ergonômico e revestimento em couro sintético.',
        'https://m.media-amazon.com/images/I/510-o-DFAbL._AC_SX569_.jpg'
    ), (
        'p005',
        'Monitor Gamer Curvo Mancer Valak',
        829.90,
        'Com seu design diferenciado, tela curva de 23,6" Full HD e bordas super finas, este monitor vai mudar completamente seu conceito de imersão e elevar seu desempenho a outro nível.',
        'https://m.media-amazon.com/images/I/61V1a6dTUrL._AC_SY450_.jpg'
    );

--pegar a tabela de produtos

SELECT * FROM products;

-- criar um novo user

INSERT INTO users (id, name, email, password) VALUES ( 

'u004',) 

-- criar um novo produto

INSERT INTO products VALUES ( 

'p006',) 

-- Retornar produtos especificos

SELECT * FROM products WHERE name LIKE '%gamer%';

-- deletar user por ID

DELETE FROM users WHERE id = 'u001';

--deletar produto por ID

DELETE FROM products WHERE id = 'p001';

-- editar produtos por ID

UPDATE products
SET
    name = 'teste',
    price = 40.99,
    description = 'teste',
    image_url = 'teste'
WHERE id = 'p001';

-- Criacao da tabela de pedidos

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer TEXT NOT NULL,
        total_price REAL NOT NULL,
        created_at TEXT DEFAULT(DATETIME()) NOT NULL,
        FOREIGN KEY (buyer) REFERENCES users(id)

ON UPDATE CASCADE ON DELETE CASCADE ) 

DROP TABLE purchases;

-- popular tabela de pedidos

INSERT INTO purchases (id, buyer, total_price) 

VALUES ('pu001', 'u001', 44.5), ('pu002', 'u003', 32), ('pu003', 'u002', 100.99), ('pu004', 'u002', 10000);

SELECT * FROM purchases 

--editar pedido

UPDATE purchases SET total_price = 300 WHERE id = 'pu001';

-- consulta com juncao(endpoint de informacoes de uma compra especifica)

SELECT
    purchases.id,
    users.id,
    users.name,
    users.email,
    purchases.total_price,
    purchases.created_at
FROM purchases

INNER JOIN users ON purchases.buyer = users.id;

--criacao tabela de relacoes

CREATE TABLE
    purchases_products (
        purchase_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchases (id),
        FOREIGN KEY (product_id) REFERENCES products (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

DROP TABLE purchases_products;

-- populando tabela purchases_products

INSERT INTO purchases_products
VALUES ('pu001', 'p005', 1), ('pu002', 'p002', 1), ('pu003', 'p003', 2);

-- consulta com INNER JOIN

SELECT *
FROM purchases_products AS pp
    INNER JOIN products AS pr ON pp.product_id = pr.id
    INNER JOIN purchases AS pu ON pp.purchase_id = pu.id;

SELECT
    purchases.id AS purchaseId,
    purchases.buyer AS buyerId,
    users.name AS buyerName,
    users.email AS buyerEmail,
    purchases.total_price AS totalPrice,
    purchases.created_at AS createdAt
FROM purchases
    INNER JOIN users ON users.id = purchases.buyer
    