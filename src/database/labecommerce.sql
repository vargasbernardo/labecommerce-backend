-- Active: 1695743127152@@127.0.0.1@3306

-- Criacao da tabela de usuarios

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT(DATETIME())NOT NULL
    );

-- Populando a tabela de usuarios

INSERT INTO users (id, name, email, password)
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
INSERT INTO users (id, name, email, password)
VALUES ('p0043', 'Jon Jones', 'jon.jones@gmail.com', '00933445f');

-- criar um novo produto
INSERT INTO products
VALUES ('p0057', 'tests', 'teste', 'teste', 'teste');

-- Retornar produtos especificos
SELECT * FROM products WHERE name LIKE '%gamer%';


-- deletar user por ID
DELETE FROM users WHERE id = 'u001';


--deletar produto por ID
DELETE FROM products WHERE id = 'p001';

-- editar produtos por ID
UPDATE products
SET name = 'teste', price = 40.99, description = 'teste', image_url = 'teste'
WHERE id = 'p001';