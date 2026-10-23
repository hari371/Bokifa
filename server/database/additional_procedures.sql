
USE bokifa_store;

DELIMITER $$

CREATE PROCEDURE UpdateAuthor(
    IN p_id INT,
    IN p_name VARCHAR(255),
    IN p_bio TEXT,
    IN p_image_url VARCHAR(500)
)
BEGIN
    UPDATE authors
    SET name = p_name,
        bio = p_bio,
        image_url = p_image_url
    WHERE id = p_id;
END $$

CREATE PROCEDURE DeleteAuthor(IN p_id INT)
BEGIN
    DELETE FROM authors WHERE id = p_id;
END $$

CREATE PROCEDURE UpdateBook(
    IN p_id INT,
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_price DECIMAL(10, 2),
    IN p_image_url VARCHAR(500),
    IN p_author_id INT
)
BEGIN
    UPDATE books
    SET title = p_title,
        description = p_description,
        price = p_price,
        image_url = p_image_url,
        author_id = p_author_id
    WHERE id = p_id;
END $$

CREATE PROCEDURE DeleteBook(IN p_id INT)
BEGIN
    DELETE FROM books WHERE id = p_id;
END $$

CREATE PROCEDURE UpdateBlog(
    IN p_id INT,
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_image_url VARCHAR(500),
    IN p_author_id INT
)
BEGIN
    UPDATE blogs
    SET title = p_title,
        description = p_description,
        image_url = p_image_url,
        author_id = p_author_id
    WHERE id = p_id;
END $$

CREATE PROCEDURE DeleteBlog(IN p_id INT)
BEGIN
    DELETE FROM blogs WHERE id = p_id;
END $$

DELIMITER ;
