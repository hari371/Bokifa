
USE bokifa_store;

DELIMITER $$

CREATE PROCEDURE GetAuthors()
BEGIN
    SELECT id, name, bio, image_url, created_at
    FROM authors
    ORDER BY id;
END $$

CREATE PROCEDURE AddAuthor(
    IN p_name VARCHAR(255),
    IN p_bio TEXT,
    IN p_image_url VARCHAR(500)
)
BEGIN
    INSERT INTO authors (name, bio, image_url)
    VALUES (p_name, p_bio, p_image_url);
END $$

CREATE PROCEDURE GetBooks()
BEGIN
    SELECT
        b.id,
        b.title,
        b.description,
        b.price,
        b.image_url,
        b.author_id,
        a.name AS author_name,
        b.created_at
    FROM books b
    INNER JOIN authors a ON a.id = b.author_id
    ORDER BY b.id;
END $$

CREATE PROCEDURE AddBook(
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_price DECIMAL(10, 2),
    IN p_image_url VARCHAR(500),
    IN p_author_id INT
)
BEGIN
    INSERT INTO books (title, description, price, image_url, author_id)
    VALUES (p_title, p_description, p_price, p_image_url, p_author_id);
END $$

CREATE PROCEDURE GetBlogs()
BEGIN
    SELECT
        b.id,
        b.title,
        b.description,
        b.image_url,
        b.author_id,
        a.name AS author_name,
        b.created_at
    FROM blogs b
    INNER JOIN authors a ON a.id = b.author_id
    ORDER BY b.id;
END $$

CREATE PROCEDURE AddBlog(
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_image_url VARCHAR(500),
    IN p_author_id INT
)
BEGIN
    INSERT INTO blogs (title, description, image_url, author_id)
    VALUES (p_title, p_description, p_image_url, p_author_id);
END $$

DELIMITER ;

