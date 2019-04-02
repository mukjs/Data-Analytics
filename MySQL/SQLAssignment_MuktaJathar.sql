USE Sakila;

-- 1a. Display the first and last names of all actors from the table actor.--
SELECT first_name,last_name
FROM actor;


-- 1b. Display the first and last name of each actor in a single column in upper case letters.
-- Name the column Actor Name.--
SELECT 	upper(concat(first_name," ",last_name)) AS "Actor Name"
from actor;


-- 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the
-- first name, "Joe." What is one query would you use to obtain this information?--
SELECT actor_id,first_name,last_name
FROM actor
WHERE first_name="Joe";


-- 2b. Find all actors whose last name contain the letters GEN:--
SELECT actor_id,first_name,last_name
FROM actor
WHERE last_name LIKE "%GEN%";


-- 2c. Find all actors whose last names contain the letters LI. 
-- This time, order the rows by last name and first name, in that order: --
SELECT actor_id,first_name,last_name
FROM actor
WHERE last_name LIKE "%LI%"
ORDER BY last_name,first_name;


-- 2d. Using IN, display the country_id and country columns of the following countries: 
-- Afghanistan, Bangladesh, and China: --
SELECT *
FROM country
WHERE country IN ("Afghanistan","Bangladesh","China");


-- 3a. You want to keep a description of each actor. 
-- You don't think you will be performing queries on a description, 
-- so create a column in the table actor named description and use the data type BLOB 
-- (Make sure to research the type BLOB, as the difference between it and VARCHAR are significant).--
ALTER TABLE actor
ADD description BLOB;


-- 3b. Very quickly you realize that entering descriptions for each actor is too much effort.
--  Delete the description column.--
ALTER TABLE actor
DROP COLUMN description;

-- 4a. List the last names of actors, as well as how many actors have that last name.--
SELECT last_name AS "Last Name",COUNT(actor_id) AS "Number of Actors"
FROM actor
GROUP BY last_name;

-- 4b. List last names of actors and the number of actors who have that last name, 
-- but only for names that are shared by at least two actors --
SELECT last_name AS "Last Name",COUNT(actor_id) AS "Number of Actors"
FROM actor
GROUP BY last_name
HAVING COUNT(actor_id)>=2;

-- 4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. 
-- Write a query to fix the record. --
UPDATE actor
SET first_name="HARPO"
WHERE last_name="WILLIAMS"
AND   first_name="GROUCHO";

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! 
-- In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO.--
UPDATE actor
SET first_name="GROUCHO"
WHERE last_name="WILLIAMS"
AND   first_name="HARPO";

-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it? --
SHOW CREATE TABLE address;


-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. 
-- Use the tables staff and address: --
SELECT s.first_name,s.last_name,a.address
FROM staff AS s
LEFT JOIN address AS a
ON s.address_id=a.address_id;

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. 
-- Use tables staff and payment.--
SELECT s.first_name,s.last_name,SUM(p.amount)
FROM staff AS s
LEFT JOIN payment AS p
ON s.staff_id=p.staff_id
WHERE MONTH(p.payment_date)=08 AND YEAR(p.payment_date)=2005
GROUP BY s.staff_id;

-- 6c. List each film and the number of actors who are listed for that film. 
-- Use tables film_actor and film. Use inner join. --
SELECT f.film_id,f.title,COUNT(fa.actor_id) AS Count_actors
FROM film AS f
INNER JOIN film_actor AS fa
ON f.film_id=fa.film_id
GROUP BY f.film_id;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT COUNT(film_id)
FROM inventory
WHERE film_id = 
      (SELECT film_id 
       FROM film
       WHERE title="Hunchback Impossible");

-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer.
-- List the customers alphabetically by last name:--
SELECT c.first_name,c.last_name,SUM(p.amount)
FROM customer AS c
LEFT JOIN payment AS p
ON c.customer_id=p.customer_id
GROUP BY c.customer_id
ORDER BY c.last_name;

-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. 
-- As an unintended consequence, films starting with the letters K and Q have also soared in popularity. 
-- Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.--
SELECT title
FROM film
WHERE (title LIKE 'k%'
	   OR title LIKE 'q%')
	   AND language_id=(SELECT language_id 
						FROM language
						WHERE name="English");
                     
-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.--
SELECT a.first_name,a.last_name 
FROM actor AS a
INNER JOIN film_actor AS fa
ON a.actor_id=fa.actor_id
WHERE fa.film_id=(SELECT f.film_id
                  FROM film AS f
                  WHERE f.title='Alone Trip');
                  
-- 7c. You want to run an email marketing campaign in Canada, for which you will need the 
-- names and email addresses of all Canadian customers. Use joins to retrieve this information.--
SELECT c.first_name,c.last_name,c.email
FROM customer AS c
JOIN address AS a ON c.address_id=a.address_id
JOIN city AS ct ON a.city_id=ct.city_id
JOIN country AS ctry ON ct.country_id=ctry.country_id
WHERE ctry.country='CANADA';
                  
                  
-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. 
-- Identify all movies categorized as family films.--
SELECT f.title
FROM film AS f
JOIN film_category AS fc ON f.film_id=fc.film_id
JOIN category AS c ON fc.category_id=c.category_id
WHERE c.name='Family';
                
-- 7e. Display the most frequently rented movies in descending order.--
SELECT f.title,COUNT(f.film_id)
FROM rental AS r
JOIN inventory AS i ON r.inventory_id=i.inventory_id
JOIN film AS f ON i.film_id=f.film_id
GROUP BY f.film_id 
ORDER BY COUNT(f.film_id) DESC;

-- 7f. Write a query to display how much business, in dollars, each store brought in.--
SELECT i.store_id,SUM(p.amount)
FROM payment AS p
JOIN rental AS r ON p.rental_id=r.rental_id
JOIN inventory AS i ON r.inventory_id=i.inventory_id
GROUP BY i.store_id;

-- 7g. Write a query to display for each store its store ID, city, and country.--
SELECT s.store_id,ct.city,ctry.country
FROM store AS s
JOIN address AS a ON a.address_id=s.address_id
JOIN city AS ct ON a.city_id=ct.city_id
JOIN country AS ctry ON ct.country_id=ctry.country_id;

-- 7h. List the top five genres in gross revenue in descending order. 
-- (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
SELECT c.name AS genre,SUM(p.amount) AS gross_revenue
FROM payment AS p
JOIN rental AS r ON p.rental_id=r.rental_id
JOIN inventory AS i ON r.inventory_id=i.inventory_id
JOIN film_category AS fc ON i.film_id=fc.film_id
JOIN category AS c ON fc.category_id=c.category_id
GROUP BY c.name
ORDER BY SUM(p.amount) DESC
LIMIT 5;

-- 8a. In your new role as an executive, you would like to have an easy way of viewing 
-- the Top five genres by gross revenue. Use the solution from the problem above to 
-- create a view. If you haven't solved 7h, you can substitute another query to create a view.
CREATE VIEW top5genres AS
SELECT c.name AS genre,SUM(p.amount) AS gross_revenue
FROM payment AS p
JOIN rental AS r ON p.rental_id=r.rental_id
JOIN inventory AS i ON r.inventory_id=i.inventory_id
JOIN film_category AS fc ON i.film_id=fc.film_id
JOIN category AS c ON fc.category_id=c.category_id
GROUP BY c.name
ORDER BY SUM(p.amount) DESC
LIMIT 5;

-- 8b. How would you display the view that you created in 8a?
SELECT * FROM top5genres;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW top5genres;

